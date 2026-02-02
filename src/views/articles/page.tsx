import { getTranslations } from 'next-intl/server';
import { createServerCaller } from '~/shared/api/trpc/server';
import { SmartList } from '~/widgets/smart-list';

function parseTags(search: { [key: string]: string | string[] | undefined }): string[] {
    if (!search.tags) return [];
    return (Array.isArray(search.tags) ? search.tags : [search.tags]).filter(Boolean) as string[];
}

interface ArticlesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function ArticlesPage({ searchParams }: ArticlesPageProps) {
    const t = await getTranslations('articles');
    const search = await searchParams;

    const page = search.page ? parseInt(search.page as string) : 1;
    const title = (search.title as string) || '';
    const category = (search.category as string) || undefined;
    const tags = parseTags(search);

    const caller = await createServerCaller();
    const [result, availableTags] = await Promise.all([
        caller.article.list({
            title: title || undefined,
            category,
            tags: tags.length > 0 ? tags : undefined,
            page,
            pagesize: 10,
        }),
        caller.article.getDistinctTags(),
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-primary mb-8 text-3xl font-bold">
                {tags.length > 0
                    ? t('articlesByTagsHeading', { count: tags.length, tags: tags.join(', ') })
                    : t('allArticles')}
            </h1>

            <SmartList
                articles={result.articles ?? []}
                searchQuery={title}
                page={page}
                totalPages={result.totalPages}
                initialCategory={category}
                initialTags={tags}
                showCategoryFilter={true}
                availableTags={availableTags ?? []}
            />
        </div>
    );
}

export async function generateMetadata({ searchParams }: ArticlesPageProps) {
    const t = await getTranslations('articles');
    const search = await searchParams;
    const title = (search.title as string) || '';

    return {
        title: title ? t('searchTitle', { title }) : t('allArticlesTitle'),
        description: t('browseAndSearch'),
    };
}
