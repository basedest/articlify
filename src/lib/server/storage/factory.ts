import type { StorageClient } from './index';
import { MinIOStorage } from './minio';
import { S3Storage } from './s3';

let storageInstance: StorageClient | null = null;

export function getStorageClient(): StorageClient {
  if (storageInstance) {
    return storageInstance;
  }

  const provider = process.env.STORAGE_PROVIDER || 'minio';

  switch (provider) {
    case 's3':
      storageInstance = new S3Storage();
      break;
    case 'minio':
    default:
      storageInstance = new MinIOStorage();
      break;
  }

  return storageInstance;
}
