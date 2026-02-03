import type { Mailer, SendParams, SendResult } from './index';

export interface RateLimitOptions {
    /** Max number of sends per minute. When exceeded, send() returns failure. */
    maxPerMinute: number;
}

/**
 * In-memory sliding-window rate limiter. When over limit, returns
 * { success: false, error: Error('Rate limit exceeded') } without calling the inner mailer.
 */
export function withRateLimit(mailer: Mailer, options: RateLimitOptions): Mailer {
    const { maxPerMinute } = options;
    const timestamps: number[] = [];

    function pruneOlderThanOneMinute(now: number): void {
        const cutoff = now - 60_000;
        while (timestamps.length > 0 && timestamps[0]! < cutoff) {
            timestamps.shift();
        }
    }

    return {
        async send(params: SendParams): Promise<SendResult> {
            const now = Date.now();
            pruneOlderThanOneMinute(now);
            if (timestamps.length >= maxPerMinute) {
                return {
                    success: false,
                    error: new Error('Mailer rate limit exceeded'),
                };
            }
            timestamps.push(now);
            return mailer.send(params);
        },
    };
}
