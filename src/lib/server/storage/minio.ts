import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { StorageClient } from './index';

/** MinIO/S3-compatible: ensure bucket exists before upload (fixes "bucket does not exist"). */
async function ensureBucketExists(client: S3Client, bucket: string): Promise<void> {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (err: unknown) {
    const name = err && typeof err === 'object' && 'name' in err ? (err as { name?: string }).name : '';
    const message = err && typeof err === 'object' && 'message' in err ? String((err as { message?: string }).message) : '';
    const isBucketMissing =
      name === 'NotFound' ||
      name === 'NoSuchBucket' ||
      message.includes('does not exist');
    if (isBucketMissing) {
      await client.send(new CreateBucketCommand({ Bucket: bucket }));
    } else {
      throw err;
    }
  }
}

/** Set bucket policy to allow public read (GetObject) so image URLs work without 403. */
function getPublicReadBucketPolicy(bucket: string): string {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucket}/*`,
      },
    ],
  });
}

async function ensureBucketPolicyPublic(client: S3Client, bucket: string): Promise<void> {
  try {
    await client.send(
      new PutBucketPolicyCommand({
        Bucket: bucket,
        Policy: getPublicReadBucketPolicy(bucket),
      })
    );
  } catch (err) {
    // Ignore if policy already set or MinIO/S3 denies (e.g. block public access)
    console.warn('[MinIO] Could not set bucket public read policy:', err instanceof Error ? err.message : err);
  }
}

export class MinIOStorage implements StorageClient {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
    const region = process.env.S3_REGION || 'us-east-1';
    const accessKeyId = process.env.S3_ACCESS_KEY || 'minioadmin';
    const secretAccessKey = process.env.S3_SECRET_KEY || 'minioadmin';
    this.bucket = process.env.S3_BUCKET || 'articlify-images';
    this.publicUrl =
      process.env.S3_PUBLIC_URL || 'http://localhost:9000/articlify-images';

    this.client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string
  ): Promise<string> {
    await ensureBucketExists(this.client, this.bucket);
    await ensureBucketPolicyPublic(this.client, this.bucket);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
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
