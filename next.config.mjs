/** @type {import('next').NextConfig} */

// Derive image config from storage env (local MinIO vs prod S3)
const storageProvider = process.env.STORAGE_PROVIDER || 'minio';
const isLocalStorage = storageProvider === 'minio';
const publicUrl = process.env.S3_PUBLIC_URL;

const imageRemotePatterns = [
    // AWS S3
    { protocol: 'https', hostname: '**.s3.amazonaws.com', pathname: '/**' },
    { protocol: 'https', hostname: '**.s3.*.amazonaws.com', pathname: '/**' },
];

if (isLocalStorage) {
    // MinIO on localhost: allow private IP and localhost pattern
    imageRemotePatterns.unshift({
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/articlify-images/**',
    });
} else if (publicUrl) {
    imageRemotePatterns.unshift({
        protocol: new URL(publicUrl).protocol.slice(0, -1),
        hostname: `**.${new URL(publicUrl).hostname}`,
        pathname: '/**',
    });
}

const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: imageRemotePatterns,
        ...(isLocalStorage && { dangerouslyAllowLocalIP: true }),
    },
    serverExternalPackages: ['mongoose'],
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
