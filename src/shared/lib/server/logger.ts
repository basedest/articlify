import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';
import { context, trace } from '@opentelemetry/api';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogOptions {
    level?: LogLevel;
    message: string;
    requestId?: string;
    traceId?: string;
    userId?: string;
    sessionId?: string;
    articleId?: string;
    url?: string;
    extra?: Record<string, unknown>;
    durationMs?: number;
}

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
    base: { service: 'articlify', environment: process.env.NODE_ENV || 'dev' },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
});

export const log = (opts: LogOptions) => {
    const traceId = opts.traceId || trace.getSpan(context.active())?.spanContext().traceId;
    const requestId = opts.requestId || uuidv4();

    const logPayload = {
        message: opts.message,
        requestId,
        traceId,
        userId: opts.userId,
        sessionId: opts.sessionId,
        articleId: opts.articleId,
        url: opts.url,
        durationMs: opts.durationMs,
        extra: opts.extra,
    };

    switch (opts.level) {
        case 'debug':
            logger.debug(logPayload);
            break;
        case 'warn':
            logger.warn(logPayload);
            break;
        case 'error':
            logger.error(logPayload);
            break;
        case 'fatal':
            logger.fatal(logPayload);
            break;
        case 'info':
        default:
            logger.info(logPayload);
            break;
    }
};

export interface RequestLoggerContext {
    requestId?: string;
    traceId?: string;
    userId?: string;
    sessionId?: string;
}

export function createRequestLogger(ctx: RequestLoggerContext) {
    const base: Omit<LogOptions, 'message' | 'level'> = {
        requestId: ctx.requestId,
        traceId: ctx.traceId,
        userId: ctx.userId,
        sessionId: ctx.sessionId,
    };
    return {
        debug(message: string, extra?: Record<string, unknown>) {
            log({ ...base, level: 'debug', message, extra });
        },
        info(message: string, extra?: Record<string, unknown>) {
            log({ ...base, level: 'info', message, extra });
        },
        warn(message: string, extra?: Record<string, unknown>) {
            log({ ...base, level: 'warn', message, extra });
        },
        error(message: string, extra?: Record<string, unknown>) {
            log({ ...base, level: 'error', message, extra });
        },
    };
}
