import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { userService } from '../services/user.service';

export const authRouter = router({
    register: publicProcedure
        .input(
            z.object({
                name: z.string().min(3).max(20),
                email: z.string().email(),
                password: z.string().min(6),
            }),
        )
        .mutation(async ({ input }) => {
            return await userService.register(input);
        }),
});
