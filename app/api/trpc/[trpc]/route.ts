import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '~/server/routers';
import { createContext } from '~/server/context';
import { withApiLogging } from '~/shared/lib/server/with-api-logging';

const trpcHandler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext,
    });

const wrappedHandler = withApiLogging(async (req) => trpcHandler(req));

export const GET = wrappedHandler;
export const POST = wrappedHandler;
