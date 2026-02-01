import { router } from '../trpc';
import { articleRouter } from './article';
import { userRouter } from './user';
import { authRouter } from './auth';

export const appRouter = router({
  article: articleRouter,
  user: userRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
