import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { StorageClient } from './index';

export class S3Storage implements StorageClient {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const region = process.env.S3_REGION || 'us-east-1';
    const accessKeyId = process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.S3_SECRET_KEY;
    this.bucket = process.env.S3_BUCKET || 'articlify-production';
    // Virtual-hosted style: https://bucket.s3.region.amazonaws.com (required for public URLs)
    this.publicUrl =
      process.env.S3_PUBLIC_URL ||
      `https://${this.bucket}.s3.${region}.amazonaws.com`;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are required for S3 storage');
    }

    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      ...(process.env.S3_ENDPOINT && {
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      }),
    });
  }

  async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read', // Make files publicly accessible
    });

    await this.client.send(command);
    return this.getPublicUrl(key);
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  getPublicUrl(key: string): string {
    const base = this.publicUrl.replace(/\/$/, '');
    return `${base}/${key}`;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await awsGetSignedUrl(this.client, command, { expiresIn });
  }
}
