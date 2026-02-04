import { createServerCaller } from '~/shared/api/trpc/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SmartList } from '~/widgets/smart-list';
import { categories, Category } from '~/shared/config/categories';
import { Badge } from '~/shared/ui/badge';

function parseTags(search: { [key: string]: string | string[] | undefined }): string[] {
    if (!search.tags) return [];
    return (Array.isArray(search.tags) ? search.tags : [search.tags]).filter(Boolean) as string[];
}

interface CategoryPageProps {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { category } = await params;
    const search = await searchParams;

    if (!categories.includes(category as Category)) {
        notFound();
    }

    const page = search.page ? parseInt(search.page as string) : 1;
    const title = (search.title as string) || '';
    const tags = parseTags(search);

    const caller = await createServerCaller();
    const [result, availableTags] = await Promise.all([
        caller.article.list({
            category,
            title: title || undefined,
            tags: tags.length > 0 ? tags : undefined,
            page,
            pagesize: 10,
        }),
        caller.article.getDistinctTags(),
    ]);

    const tCategory = await getTranslations('category');
    const tArticles = await getTranslations('articles');
    const categoryLabel = tCategory(category as Category);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center gap-3">
                <h1 className="text-4xl font-bold">{categoryLabel}</h1>
                <Badge variant="secondary" className="text-lg">
                    {tArticles('articlesCount', { count: result.total ?? 0 })}
                </Badge>
            </div>

            <SmartList
                articles={result.articles ?? []}
                searchQuery={title}
                page={page}
                totalPages={result.totalPages}
                initialTags={tags}
                showCategoryFilter={false}
                availableTags={availableTags ?? []}
            />
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const tCategory = await getTranslations('category');
    const tArticles = await getTranslations('articles');
    const categoryLabel = tCategory(category as Category);
    return {
        title: tArticles('categoryPageTitle', { category: categoryLabel }),
        description: tArticles('categoryPageDescription', { category: categoryLabel }),
    };
}
