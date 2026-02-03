import type { Mailer, SendParams, SendResult } from './index';

export interface RetryOptions {
    /** Max send attempts including the first. Default 3. */
    maxAttempts?: number;
    /** Delay in ms before each retry. Default 1000. */
    delayMs?: number;
    /** Called after final failure; no persistence in this layer. */
    onDeadLetter?(params: SendParams, error: Error): void | Promise<void>;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function withRetry(mailer: Mailer, options?: RetryOptions): Mailer {
    const maxAttempts = options?.maxAttempts ?? 3;
    const delayMs = options?.delayMs ?? 1000;
    const onDeadLetter = options?.onDeadLetter;

    return {
        async send(params: SendParams): Promise<SendResult> {
            let lastResult: SendResult | null = null;
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                lastResult = await mailer.send(params);
                if (lastResult.success) return lastResult;
                if (attempt < maxAttempts) await sleep(delayMs);
            }
            const result = lastResult! as { success: false; error: Error };
            if (onDeadLetter) {
                await Promise.resolve(onDeadLetter(params, result.error));
            }
            return result;
        },
    };
}
