import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';
import { userService } from '../services/user.service';
import { getStorageClient } from '~/lib/server/storage/factory';

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const userRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await userService.findById(input.id);
    }),

  updateAvatar: protectedProcedure
    .input(
      z.object({
        imageUrl: z
          .url()
          .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
            message: 'Avatar must be an http or https URL',
          }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User ID not found' });
      }
      return await userService.updateAvatar(userId, input.imageUrl);
    }),

  uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageBase64: z.string(),
        contentType: z.string().regex(/^image\/(jpeg|jpg|png|webp|gif)$/),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User ID not found' });
      }

      let buffer: Buffer;
      try {
        buffer = Buffer.from(input.imageBase64, 'base64');
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid image data',
        });
      }

      if (buffer.length > 2 * 1024 * 1024) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Image must be smaller than 2MB',
        });
      }

      const ext = CONTENT_TYPE_TO_EXT[input.contentType] ?? 'jpg';
      const key = `avatars/${userId}-${Date.now()}.${ext}`;
      let imageUrl: string;
      try {
        const storage = getStorageClient();
        imageUrl = await storage.uploadFile(buffer, key, input.contentType);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Storage upload failed';
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            message.includes('credentials') || message.includes('Storage')
              ? `${message}. Configure STORAGE_PROVIDER and S3/MinIO env vars.`
              : message,
        });
      }

      return await userService.updateAvatar(userId, imageUrl);
    }),
});
