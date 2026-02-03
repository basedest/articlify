import type { ReactNode } from 'react';

export interface SendParams {
    to: string | string[];
    subject: string;
    /** HTML string or React node (e.g. React Email template). */
    body: string | ReactNode;
    /** Optional locale for future i18n; no translation in this layer. */
    locale?: string;
    from?: string;
    replyTo?: string;
    /** Optional idempotency key for retry/dedup. */
    idempotencyKey?: string;
}

export type SendResult = { success: true; id?: string } | { success: false; error: Error };

export interface Mailer {
    send(params: SendParams): Promise<SendResult>;
}

export * from './factory';
