import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ArticleService } from '../article.service';
import type { Article } from '~/entities/article/model/types';

vi.mock('~/entities/article/api/article.repository', () => ({
    articleRepository: {
        findAll: vi.fn(),
        findBySlug: vi.fn(),
        create: vi.fn(),
        updateBySlug: vi.fn(),
        deleteBySlug: vi.fn(),
        getAllSlugs: vi.fn(),
    },
}));

import { articleRepository } from '~/entities/article/api/article.repository';

const service = new ArticleService();

function baseArticle(overrides: Partial<Article> = {}): Omit<Article, '_id' | 'createdAt' | 'editedAt'> {
    return {
        slug: 'test-slug',
        title: 'Test',
        description: 'Desc',
        category: 'it',
        author: 'user1',
        ...overrides,
    };
}

describe('ArticleService', () => {
    beforeEach(() => {
        vi.mocked(articleRepository.findAll).mockReset();
        vi.mocked(articleRepository.findBySlug).mockReset();
        vi.mocked(articleRepository.create).mockReset();
        vi.mocked(articleRepository.updateBySlug).mockReset();
        vi.mocked(articleRepository.deleteBySlug).mockReset();
        vi.mocked(articleRepository.getAllSlugs).mockReset();
    });

    describe('happy path', () => {
        it('create sets contentFormat pm and contentSchemaVersion 1 when contentPm is present', async () => {
            const articleData = baseArticle({ contentPm: { type: 'doc' } });
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(null);
            vi.mocked(articleRepository.create).mockImplementation(async (data) => data as Article);

            await service.create(articleData);

            expect(articleRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    contentFormat: 'pm',
                    contentSchemaVersion: 1,
                    contentPm: { type: 'doc' },
                }),
            );
        });

        it('create sets contentFormat from articleData.contentFormat when contentPm is absent', async () => {
            const articleData = baseArticle({ contentPm: undefined, contentFormat: 'pm' });
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(null);
            vi.mocked(articleRepository.create).mockImplementation(async (data) => data as Article);

            await service.create(articleData);

            expect(articleRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    contentFormat: 'pm',
                    contentSchemaVersion: 1,
                }),
            );
        });

        it('create defaults to pm and schema 1 when contentPm and contentFormat omitted', async () => {
            const articleData = baseArticle();
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(null);
            vi.mocked(articleRepository.create).mockImplementation(async (data) => data as Article);

            await service.create(articleData);

            expect(articleRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    contentFormat: 'pm',
                    contentSchemaVersion: 1,
                }),
            );
        });

        it('update allows when user is author', async () => {
            const article = { ...baseArticle(), author: 'user1' };
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(article as Article);
            vi.mocked(articleRepository.updateBySlug).mockResolvedValue({ ...article, title: 'Updated' } as Article);

            const result = await service.update('test-slug', { title: 'Updated' }, 'user1');

            expect(articleRepository.updateBySlug).toHaveBeenCalledWith('test-slug', { title: 'Updated' });
            expect(result).toEqual(expect.objectContaining({ title: 'Updated' }));
        });

        it('update allows when user is admin even if not author', async () => {
            const article = { ...baseArticle(), author: 'other' };
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(article as Article);
            vi.mocked(articleRepository.updateBySlug).mockResolvedValue(article as Article);

            await service.update('test-slug', { title: 'Updated' }, 'admin-user', 'admin');

            expect(articleRepository.updateBySlug).toHaveBeenCalledWith('test-slug', { title: 'Updated' });
        });

        it('delete allows when user is author', async () => {
            const article = { ...baseArticle(), author: 'user1' };
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(article as Article);
            vi.mocked(articleRepository.deleteBySlug).mockResolvedValue(true);

            const result = await service.delete('test-slug', 'user1');

            expect(result).toEqual({ success: true });
        });

        it('delete allows when user is admin even if not author', async () => {
            const article = { ...baseArticle(), author: 'other' };
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(article as Article);
            vi.mocked(articleRepository.deleteBySlug).mockResolvedValue(true);

            const result = await service.delete('test-slug', 'admin-user', 'admin');

            expect(result).toEqual({ success: true });
        });
    });

    describe('edge cases', () => {
        it('findBySlug throws NOT_FOUND when article is null', async () => {
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(null);

            await expect(service.findBySlug('missing')).rejects.toMatchObject({
                code: 'NOT_FOUND',
                message: 'Article not found',
            });
            expect(articleRepository.findBySlug).toHaveBeenCalledWith('missing');
        });

        it('create throws CONFLICT when slug already exists', async () => {
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(baseArticle() as Article);

            await expect(service.create(baseArticle())).rejects.toMatchObject({
                code: 'CONFLICT',
                message: 'Article with this slug already exists',
            });
            expect(articleRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('invalid input / permission', () => {
        it('update throws FORBIDDEN when user is not author and not admin', async () => {
            const article = { ...baseArticle(), author: 'other' };
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(article as Article);

            await expect(service.update('test-slug', { title: 'Updated' }, 'random-user')).rejects.toMatchObject({
                code: 'FORBIDDEN',
                message: 'You do not have permission to edit this article',
            });
            expect(articleRepository.updateBySlug).not.toHaveBeenCalled();
        });

        it('update throws FORBIDDEN when user is not author and userRole is not admin', async () => {
            const article = { ...baseArticle(), author: 'other' };
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(article as Article);

            await expect(service.update('test-slug', {}, 'random-user', 'user')).rejects.toMatchObject({
                code: 'FORBIDDEN',
            });
        });

        it('update throws NOT_FOUND when article does not exist', async () => {
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(null);

            await expect(service.update('missing', {}, 'user1')).rejects.toMatchObject({
                code: 'NOT_FOUND',
                message: 'Article not found',
            });
        });

        it('delete throws FORBIDDEN when user is not author and not admin', async () => {
            const article = { ...baseArticle(), author: 'other' };
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(article as Article);

            await expect(service.delete('test-slug', 'random-user')).rejects.toMatchObject({
                code: 'FORBIDDEN',
                message: 'You do not have permission to delete this article',
            });
            expect(articleRepository.deleteBySlug).not.toHaveBeenCalled();
        });

        it('delete throws NOT_FOUND when article does not exist', async () => {
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(null);

            await expect(service.delete('missing', 'user1')).rejects.toMatchObject({
                code: 'NOT_FOUND',
                message: 'Article not found',
            });
        });

        it('delete throws INTERNAL_SERVER_ERROR when deleteBySlug returns false', async () => {
            const article = { ...baseArticle(), author: 'user1' };
            vi.mocked(articleRepository.findBySlug).mockResolvedValue(article as Article);
            vi.mocked(articleRepository.deleteBySlug).mockResolvedValue(false);

            await expect(service.delete('test-slug', 'user1')).rejects.toMatchObject({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete article',
            });
        });
    });
});
