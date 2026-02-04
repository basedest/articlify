import { log } from '../logger';
import type { Mailer, SendParams, SendResult } from './index';

const BODY_PREVIEW_MAX_LEN = 200;

function bodyPreview(body: SendParams['body']): string {
    if (typeof body === 'string') {
        return body.length <= BODY_PREVIEW_MAX_LEN ? body : `${body.slice(0, BODY_PREVIEW_MAX_LEN)}...`;
    }
    return '[React template]';
}

export class LogMailer implements Mailer {
    async send(params: SendParams): Promise<SendResult> {
        const to = Array.isArray(params.to) ? params.to : [params.to];
        log({
            message: 'Mail (log provider)',
            extra: {
                to,
                subject: params.subject,
                bodyPreview: bodyPreview(params.body),
                locale: params.locale,
            },
        });
        return { success: true };
    }
}
