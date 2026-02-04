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
import type { ServerConfig } from '~/shared/config/env/server';
import type { StorageClient } from './index';

type MinIOStorageConfig = Extract<ServerConfig['storage'], { provider: 'minio' }>;

/** MinIO/S3-compatible: ensure bucket exists before upload (fixes "bucket does not exist"). */
async function ensureBucketExists(client: S3Client, bucket: string): Promise<void> {
    try {
        await client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (err: unknown) {
        const name = err && typeof err === 'object' && 'name' in err ? (err as { name?: string }).name : '';
        const message =
            err && typeof err === 'object' && 'message' in err ? String((err as { message?: string }).message) : '';
        const isBucketMissing = name === 'NotFound' || name === 'NoSuchBucket' || message.includes('does not exist');
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
            }),
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

    constructor(config: MinIOStorageConfig) {
        this.bucket = config.bucket;
        this.publicUrl = config.publicUrl;

        this.client = new S3Client({
            endpoint: config.endpoint,
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
            forcePathStyle: true, // Required for MinIO
        });
    }

    async uploadFile(buffer: Buffer, key: string, contentType: string): Promise<string> {
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
