import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { articleService } from '../services/article.service';

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
        .optional()
    )
    .query(async ({ input }) => {
      return await articleService.findAll(input || {});
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await articleService.findBySlug(input.slug);
    }),

  create: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.string().min(1),
        img: z.string().optional(),
        tags: z.array(z.string()).optional(),
        content: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await articleService.create({
        ...input,
        author: ctx.session.user.name!,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        img: z.string().optional(),
        tags: z.array(z.string()).optional(),
        content: z.any().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { slug, ...updateData } = input;
      return await articleService.update(
        slug,
        updateData,
        ctx.session.user.name!,
        ctx.session.user.role
      );
    }),

  delete: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await articleService.delete(
        input.slug,
        ctx.session.user.name!,
        ctx.session.user.role
      );
    }),

  getAllSlugs: publicProcedure.query(async () => {
    return await articleService.getAllSlugs();
  }),
});
