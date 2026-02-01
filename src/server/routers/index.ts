import { router } from '../trpc';
import { articleRouter } from '~/entities/article/api/article.router';
import { userRouter } from '~/entities/user/api/user.router';
import { authRouter } from './auth';

export const appRouter = router({
    article: articleRouter,
    user: userRouter,
    auth: authRouter,
});

export type AppRouter = typeof appRouter;
