import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from 'server/trpc';
import { articleService } from '~/entities/article/api/article.service';
import { getStorageClient } from '~/shared/lib/server/storage/factory';

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
};

export const articleRouter = router({
    list: publicProcedure
        .input(
            z
                .object({
                    category: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                    title: z.string().optional(),
                    author: z.string().optional(),
                    page: z.number().int().min(1).default(1),
                    pagesize: z.number().int().min(1).max(100).default(10),
                })
                .optional(),
        )
        .query(async ({ input }) => {
            return await articleService.findAll(input || {});
        }),

    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
        return await articleService.findBySlug(input.slug);
    }),

    create: protectedProcedure
        .input(
            z
                .object({
                    slug: z.string().min(1),
                    title: z.string().min(1),
                    description: z.string().min(1),
                    category: z.string().min(1),
                    img: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                    content: z.any().optional(),
                    contentPm: z.record(z.string(), z.unknown()),
                    contentFormat: z.union([z.literal('editorjs'), z.literal('pm')]).optional(),
                    contentSchemaVersion: z.number().int().optional(),
                })
                .refine((data) => !data.img || data.img.startsWith('http://') || data.img.startsWith('https://'), {
                    message: 'Cover image must be an http(s) URL from storage',
                }),
        )
        .mutation(async ({ input, ctx }) => {
            return await articleService.create({
                ...input,
                author: ctx.session.user.name!,
            });
        }),

    update: protectedProcedure
        .input(
            z
                .object({
                    slug: z.string(),
                    title: z.string().optional(),
                    description: z.string().optional(),
                    category: z.string().optional(),
                    img: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                    content: z.any().optional(),
                    contentPm: z.record(z.string(), z.unknown()).optional().nullable(),
                    contentFormat: z.union([z.literal('editorjs'), z.literal('pm')]).optional(),
                    contentSchemaVersion: z.number().int().optional(),
                })
                .refine((data) => !data.img || data.img.startsWith('http://') || data.img.startsWith('https://'), {
                    message: 'Cover image must be an http(s) URL from storage',
                }),
        )
        .mutation(async ({ input, ctx }) => {
            const { slug, ...updateData } = input;
            return await articleService.update(slug, updateData, ctx.session.user.name!, ctx.session.user.role);
        }),

    delete: protectedProcedure.input(z.object({ slug: z.string() })).mutation(async ({ input, ctx }) => {
        return await articleService.delete(input.slug, ctx.session.user.name!, ctx.session.user.role);
    }),

    getAllSlugs: publicProcedure.query(async () => {
        return await articleService.getAllSlugs();
    }),

    uploadCoverImage: protectedProcedure
        .input(
            z.object({
                imageBase64: z.string(),
                contentType: z.string().regex(/^image\/(jpeg|jpg|png|webp|gif)$/),
            }),
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
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid image data' });
            }
            if (buffer.length > 5 * 1024 * 1024) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Cover image must be smaller than 5MB',
                });
            }
            const ext = CONTENT_TYPE_TO_EXT[input.contentType] ?? 'jpg';
            const key = `articles/covers/${userId}-${Date.now()}.${ext}`;
            try {
                const storage = getStorageClient();
                const url = await storage.uploadFile(buffer, key, input.contentType);
                return { url };
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Storage upload failed';
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message:
                        message.includes('credentials') || message.includes('Storage')
                            ? `${message}. Configure STORAGE_PROVIDER and S3/MinIO env vars.`
                            : message,
                });
            }
        }),
});
