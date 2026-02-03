import { log } from '../logger';
import type { Mailer } from './index';
import { LogMailer } from './log';
import { ResendMailer } from './resend';
import { withRateLimit } from './with-rate-limit';
import { withRetry } from './with-retry';

let mailerInstance: Mailer | null = null;

export function getMailer(): Mailer {
    if (mailerInstance) {
        return mailerInstance;
    }

    const provider = process.env.MAILER_PROVIDER || 'log';
    let mailer: Mailer;

    switch (provider) {
        case 'resend':
            mailer = new ResendMailer();
            break;
        case 'log':
        default:
            mailer = new LogMailer();
            break;
    }

    const retryEnabled = process.env.MAILER_RETRY_ENABLED === 'true';
    if (retryEnabled) {
        mailer = withRetry(mailer, {
            maxAttempts: 3,
            delayMs: 1000,
            onDeadLetter(params, error) {
                log({
                    level: 'error',
                    message: 'Mail dead letter',
                    extra: {
                        to: params.to,
                        subject: params.subject,
                        error: error.message,
                    },
                });
            },
        });
    }

    const rateLimitPerMinute = process.env.MAILER_RATE_LIMIT_PER_MINUTE;
    if (rateLimitPerMinute) {
        const maxPerMinute = parseInt(rateLimitPerMinute, 10);
        if (!Number.isNaN(maxPerMinute) && maxPerMinute > 0) {
            mailer = withRateLimit(mailer, { maxPerMinute });
        }
    }

    mailerInstance = mailer;
    return mailerInstance;
}
