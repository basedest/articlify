import { articleRepository, type ArticleQuery } from '../repositories/article.repository';
import { type Article } from '~/lib/ArticleTypes';
import { TRPCError } from '@trpc/server';

export class ArticleService {
  async findAll(query: ArticleQuery = {}) {
    return await articleRepository.findAll(query);
  }

  async findBySlug(slug: string) {
    const article = await articleRepository.findBySlug(slug);
    if (!article) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Article not found',
      });
    }
    return article;
  }

  async create(articleData: Omit<Article, '_id' | 'createdAt' | 'editedAt'>) {
    // Check if slug already exists
    const existing = await articleRepository.findBySlug(articleData.slug);
    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Article with this slug already exists',
      });
    }

    return await articleRepository.create({
      ...articleData,
      createdAt: new Date(),
    });
  }

  async update(
    slug: string,
    updateData: Partial<Article>,
    userId: string,
    userRole?: string
  ) {
    const article = await articleRepository.findBySlug(slug);
    if (!article) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Article not found',
      });
    }

    // Check if user is author or admin
    if (article.author !== userId && userRole !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to edit this article',
      });
    }

    return await articleRepository.updateBySlug(slug, updateData);
  }

  async delete(slug: string, userId: string, userRole?: string) {
    const article = await articleRepository.findBySlug(slug);
    if (!article) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Article not found',
      });
    }

    // Check if user is author or admin
    if (article.author !== userId && userRole !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to delete this article',
      });
    }

    const deleted = await articleRepository.deleteBySlug(slug);
    if (!deleted) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete article',
      });
    }

    return { success: true };
  }

  async getAllSlugs() {
    return await articleRepository.getAllSlugs();
  }
}

export const articleService = new ArticleService();
