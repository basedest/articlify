import { initTRPC, TRPCError } from '@trpc/server';
import { type Context } from './context';
import superjson from 'superjson';
import { log } from '~/shared/lib/server/logger';

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

const loggingMiddleware = t.middleware(async (opts) => {
    const start = Date.now();
    const { ctx, path, type } = opts;
    const userId = ctx.session?.user?.id;

    log({
        level: 'debug',
        message: 'trpc procedure start',
        requestId: ctx.requestId,
        traceId: ctx.traceId,
        userId,
        extra: { path, type },
    });

    try {
        const result = await opts.next({ ctx });
        const durationMs = Date.now() - start;
        log({
            level: 'info',
            message: 'trpc procedure success',
            requestId: ctx.requestId,
            traceId: ctx.traceId,
            userId,
            durationMs,
            extra: { path, type },
        });
        return result;
    } catch (err) {
        const durationMs = Date.now() - start;
        const message = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error ? err.stack : undefined;
        const inputSummary =
            typeof opts.input === 'object' && opts.input !== null
                ? { keys: Object.keys(opts.input as object) }
                : undefined;
        log({
            level: 'error',
            message: 'trpc procedure error',
            requestId: ctx.requestId,
            traceId: ctx.traceId,
            userId,
            durationMs,
            extra: { path, type, message, stack, inputSummary },
        });
        throw err;
    }
});

export const router = t.router;
export const publicProcedure = t.procedure.use(loggingMiddleware);

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async (opts) => {
    const { ctx } = opts;
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return opts.next({
        ctx: {
            ...ctx,
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

// Admin procedure - requires admin role
export const adminProcedure = protectedProcedure.use(async (opts) => {
    const { ctx } = opts;
    if (ctx.session.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return opts.next({
        ctx,
    });
});
