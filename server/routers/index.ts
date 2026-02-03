import { router } from '../trpc';
import { articleRouter } from '~/entities/article/api/article.router';
import { userRouter } from '~/entities/user/api/user.router';

export const appRouter = router({
    article: articleRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
