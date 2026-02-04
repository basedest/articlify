import { z } from 'zod';

/**
 * Only NEXT_PUBLIC_* env vars are allowed here.
 * Safe to import and use in client components.
 */
const clientEnvSchema = z.object({
    // Add NEXT_PUBLIC_* keys here when needed, e.g.:
    // NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export type ClientConfig = z.infer<typeof clientEnvSchema>;

function getRawClientEnv(): Record<string, string | undefined> {
    if (typeof window !== 'undefined') {
        return {
            // In browser, only NEXT_PUBLIC_* are available (injected at build)
            ...Object.fromEntries(Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_'))),
        };
    }
    return Object.fromEntries(Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_')));
}

let cached: ClientConfig | null = null;

export function getClientConfig(): ClientConfig {
    if (cached) return cached;
    const raw = getRawClientEnv();
    const parsed = clientEnvSchema.safeParse(raw);
    if (!parsed.success) {
        const msg = parsed.error.flatten().formErrors?.[0] ?? parsed.error.message;
        throw new Error(`Client config validation failed: ${msg}`);
    }
    cached = parsed.data;
    return parsed.data;
}
