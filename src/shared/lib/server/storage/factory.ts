import { getServerConfig } from '~/shared/config/env/server';
import type { StorageClient } from './index';
import { MinIOStorage } from './minio';
import { S3Storage } from './s3';

let storageInstance: StorageClient | null = null;

export function getStorageClient(): StorageClient {
    if (storageInstance) {
        return storageInstance;
    }

    const storage = getServerConfig().storage;

    if (storage.provider === 's3') {
        storageInstance = new S3Storage(storage);
    } else {
        storageInstance = new MinIOStorage(storage);
    }

    return storageInstance;
}
