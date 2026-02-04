import 'server-only';
import { z } from 'zod';

const logLevelSchema = z.enum(['debug', 'info', 'warn', 'error', 'fatal']);
const nodeEnvSchema = z.enum(['development', 'production', 'test']);
const mailerProviderSchema = z.enum(['log', 'resend']);
const storageProviderSchema = z.enum(['minio', 's3']);

const rawServerEnvSchema = z.object({
    NODE_ENV: z.string().optional(),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    MONGODB_USE_TRANSACTIONS: z
        .string()
        .optional()
        .transform((s) => s === 'true'),
    BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
    BETTER_AUTH_URL: z.string().optional(),
    BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
    VERCEL_URL: z.string().optional(),
    LOG_LEVEL: z.string().optional(),
    MAILER_PROVIDER: z.string().optional(),
    MAILER_FROM: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    MAILER_RETRY_ENABLED: z
        .string()
        .optional()
        .transform((s) => s === 'true'),
    MAILER_RATE_LIMIT_PER_MINUTE: z
        .string()
        .optional()
        .transform((s) => (s ? parseInt(s, 10) : undefined)),
    STORAGE_PROVIDER: z.string().optional(),
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_ACCESS_KEY: z.string().optional(),
    S3_SECRET_KEY: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_PUBLIC_URL: z.string().optional(),
    S3_FORCE_PATH_STYLE: z
        .string()
        .optional()
        .transform((s) => s === 'true'),
});

const serverEnvSchema = rawServerEnvSchema
    .refine(
        (data) => {
            if (data.MAILER_PROVIDER === 'resend') {
                return !!data.RESEND_API_KEY?.trim();
            }
            return true;
        },
        { message: 'RESEND_API_KEY is required when MAILER_PROVIDER=resend', path: ['RESEND_API_KEY'] },
    )
    .transform((raw): ServerConfig => {
        const nodeEnv = nodeEnvSchema.catch('development').parse(raw.NODE_ENV ?? 'development');
        const logLevel = logLevelSchema.catch('info').parse(raw.LOG_LEVEL ?? 'info');
        const mailerProvider = mailerProviderSchema.catch('log').parse(raw.MAILER_PROVIDER ?? 'log');
        const storageProvider = storageProviderSchema.catch('minio').parse(raw.STORAGE_PROVIDER ?? 'minio');

        const betterAuthBaseUrl =
            raw.BETTER_AUTH_URL?.trim() || (raw.VERCEL_URL ? `https://${raw.VERCEL_URL}` : 'http://localhost:3000');

        const trustedOrigins: string[] = [betterAuthBaseUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'];
        if (raw.VERCEL_URL) {
            trustedOrigins.push(`https://${raw.VERCEL_URL}`, `https://www.${raw.VERCEL_URL}`);
        }
        const extraOrigins = raw.BETTER_AUTH_TRUSTED_ORIGINS?.split(',')
            .map((o) => o.trim())
            .filter(Boolean);
        if (extraOrigins?.length) trustedOrigins.push(...extraOrigins);

        const mailerRateLimitPerMinute =
            raw.MAILER_RATE_LIMIT_PER_MINUTE !== undefined &&
            !Number.isNaN(raw.MAILER_RATE_LIMIT_PER_MINUTE) &&
            raw.MAILER_RATE_LIMIT_PER_MINUTE > 0
                ? raw.MAILER_RATE_LIMIT_PER_MINUTE
                : undefined;

        const storage =
            storageProvider === 'minio'
                ? {
                      provider: 'minio' as const,
                      endpoint: raw.S3_ENDPOINT?.trim() || 'http://localhost:9000',
                      region: raw.S3_REGION?.trim() || 'us-east-1',
                      accessKeyId: raw.S3_ACCESS_KEY?.trim() || 'minioadmin',
                      secretAccessKey: raw.S3_SECRET_KEY?.trim() || 'minioadmin',
                      bucket: raw.S3_BUCKET?.trim() || 'articlify-images',
                      publicUrl: raw.S3_PUBLIC_URL?.trim() || 'http://localhost:9000/articlify-images',
                      forcePathStyle: true,
                  }
                : ({
                      provider: 's3' as const,
                      endpoint: undefined,
                      region: raw.S3_REGION?.trim() || '',
                      accessKeyId: raw.S3_ACCESS_KEY?.trim() ?? '',
                      secretAccessKey: raw.S3_SECRET_KEY?.trim() ?? '',
                      bucket: raw.S3_BUCKET?.trim() ?? '',
                      publicUrl: raw.S3_PUBLIC_URL?.trim() ?? '',
                      forcePathStyle: raw.S3_FORCE_PATH_STYLE ?? false,
                  } as const);

        if (storageProvider === 's3') {
            if (
                !storage.region ||
                !storage.accessKeyId ||
                !storage.secretAccessKey ||
                !storage.bucket ||
                !storage.publicUrl
            ) {
                throw new Error(
                    'AWS S3 requires S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, and S3_PUBLIC_URL',
                );
            }
        }

        return {
            nodeEnv,
            mongodb: {
                uri: raw.MONGODB_URI,
                useTransactions: raw.MONGODB_USE_TRANSACTIONS ?? false,
            },
            auth: {
                secret: raw.BETTER_AUTH_SECRET,
                baseUrl: betterAuthBaseUrl,
                trustedOrigins,
            },
            logLevel,
            mailer: {
                provider: mailerProvider,
                from: raw.MAILER_FROM?.trim() || 'onboarding@resend.dev',
                resendApiKey: raw.RESEND_API_KEY?.trim() || undefined,
                retryEnabled: raw.MAILER_RETRY_ENABLED ?? false,
                rateLimitPerMinute: mailerRateLimitPerMinute,
            },
            storage,
        };
    });

export type ServerConfig = {
    nodeEnv: 'development' | 'production' | 'test';
    mongodb: { uri: string; useTransactions: boolean };
    auth: { secret: string; baseUrl: string; trustedOrigins: string[] };
    logLevel: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    mailer: {
        provider: 'log' | 'resend';
        from: string;
        resendApiKey: string | undefined;
        retryEnabled: boolean;
        rateLimitPerMinute: number | undefined;
    };
    storage:
        | {
              provider: 'minio';
              endpoint: string;
              region: string;
              accessKeyId: string;
              secretAccessKey: string;
              bucket: string;
              publicUrl: string;
              forcePathStyle: boolean;
          }
        | {
              provider: 's3';
              endpoint: undefined;
              region: string;
              accessKeyId: string;
              secretAccessKey: string;
              bucket: string;
              publicUrl: string;
              forcePathStyle: boolean;
          };
};

function getRawEnv(): Record<string, string | undefined> {
    return {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI,
        MONGODB_USE_TRANSACTIONS: process.env.MONGODB_USE_TRANSACTIONS,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        BETTER_AUTH_TRUSTED_ORIGINS: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
        VERCEL_URL: process.env.VERCEL_URL,
        LOG_LEVEL: process.env.LOG_LEVEL,
        MAILER_PROVIDER: process.env.MAILER_PROVIDER,
        MAILER_FROM: process.env.MAILER_FROM,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        MAILER_RETRY_ENABLED: process.env.MAILER_RETRY_ENABLED,
        MAILER_RATE_LIMIT_PER_MINUTE: process.env.MAILER_RATE_LIMIT_PER_MINUTE,
        STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
        S3_ENDPOINT: process.env.S3_ENDPOINT,
        S3_REGION: process.env.S3_REGION,
        S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
        S3_SECRET_KEY: process.env.S3_SECRET_KEY,
        S3_BUCKET: process.env.S3_BUCKET,
        S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,
        S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE,
    };
}

let cached: ServerConfig | null = null;

export function getServerConfig(): ServerConfig {
    if (cached) return cached;
    const raw = getRawEnv();
    const parsed = serverEnvSchema.safeParse(raw);
    if (!parsed.success) {
        const first = parsed.error.flatten();
        const fieldErrors = first.fieldErrors as Record<string, string[] | undefined>;
        const message =
            first.formErrors?.[0] ??
            (typeof fieldErrors.RESEND_API_KEY === 'string'
                ? fieldErrors.RESEND_API_KEY
                : Array.isArray(fieldErrors.RESEND_API_KEY)
                  ? fieldErrors.RESEND_API_KEY[0]
                  : parsed.error.message);
        throw new Error(`Server config validation failed: ${message}`);
    }
    cached = parsed.data;
    return parsed.data;
}
