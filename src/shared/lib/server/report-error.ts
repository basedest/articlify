'use server';

import { log } from '~/shared/lib/server/logger';

export type ReportErrorPayload = {
    message: string;
    digest?: string;
    stack?: string;
};

/**
 * Server action to log client/error-boundary errors from the client.
 * Use from error.tsx or global-error.tsx in useEffect.
 */
export async function reportError(payload: ReportErrorPayload): Promise<void> {
    log({
        level: 'error',
        message: payload.message,
        extra: {
            digest: payload.digest,
            stack: payload.stack,
            source: 'error-boundary',
        },
    });
}
