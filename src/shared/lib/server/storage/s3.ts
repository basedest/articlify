import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { ServerConfig } from '~/shared/config/env/server';
import type { StorageClient } from './index';

type S3StorageConfig = Extract<ServerConfig['storage'], { provider: 's3' }>;

export class S3Storage implements StorageClient {
    private client: S3Client;
    private bucket: string;
    private publicUrl: string;

    constructor(config: S3StorageConfig) {
        this.bucket = config.bucket;
        this.publicUrl = config.publicUrl;

        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
            endpoint: config.publicUrl,
            forcePathStyle: config.forcePathStyle,
        });
    }

    async uploadFile(buffer: Buffer, key: string, contentType: string): Promise<string> {
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
        const url = new URL(this.publicUrl);
        const normalizedUrl = `${url.protocol}//${this.bucket}.${url.hostname}`;
        const base = normalizedUrl.replace(/\/$/, '');
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
