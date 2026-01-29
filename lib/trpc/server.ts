import { appRouter } from '~/server/routers';
import { createContext } from '~/server/context';

export async function createServerCaller() {
  const context = await createContext();
  return appRouter.createCaller(context);
}
