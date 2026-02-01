export interface StorageClient {
  uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string
  ): Promise<string>;
  deleteFile(key: string): Promise<void>;
  getPublicUrl(key: string): string;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

export * from './minio';
export * from './s3';
export * from './factory';
