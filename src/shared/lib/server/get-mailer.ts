import 'server-only';
import { getServerConfig } from '~/shared/config/env/server';
import { log } from '~/shared/lib/server/logger';
import { createMailer, type Mailer } from '@basedest/mailer';

let mailerInstance: Mailer | null = null;

/**
 * App-level singleton. Wires mailer with app config and logger.
 */
export function getMailer(): Mailer {
    if (mailerInstance) {
        return mailerInstance;
    }
    const { mailer: mailerConfig } = getServerConfig();
    mailerInstance = createMailer(mailerConfig, {
        logger: {
            log: (opts) => log(opts),
        },
    });
    return mailerInstance;
}
