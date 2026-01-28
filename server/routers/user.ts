import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { userService } from '../services/user.service';

export const userRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await userService.findById(input.id);
    }),

  updateAvatar: protectedProcedure
    .input(z.object({ imageUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // User can only update their own avatar
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new Error('User ID not found');
      }
      return await userService.updateAvatar(userId, input.imageUrl);
    }),
});
