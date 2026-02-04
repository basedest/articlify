import { appRouter } from 'server/routers';
import { createContext, createPublicContext } from 'server/context';

export async function createServerCaller() {
    const context = await createContext();
    return appRouter.createCaller(context);
}

/** Caller with no auth (no headers/cookies). Use for static/ISR pages to avoid "static to dynamic" error. */
export function createServerCallerPublic() {
    return appRouter.createCaller(createPublicContext());
}
