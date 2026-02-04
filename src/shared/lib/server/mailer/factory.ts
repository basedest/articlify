import { getServerConfig } from '~/shared/config/env/server';
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

    const { mailer: mailerConfig } = getServerConfig();
    let mailer: Mailer;

    switch (mailerConfig.provider) {
        case 'resend':
            mailer = new ResendMailer({
                apiKey: mailerConfig.resendApiKey!,
                from: mailerConfig.from,
            });
            break;
        case 'log':
        default:
            mailer = new LogMailer();
            break;
    }

    if (mailerConfig.retryEnabled) {
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

    if (mailerConfig.rateLimitPerMinute != null && mailerConfig.rateLimitPerMinute > 0) {
        mailer = withRateLimit(mailer, { maxPerMinute: mailerConfig.rateLimitPerMinute });
    }

    mailerInstance = mailer;
    return mailerInstance;
}
