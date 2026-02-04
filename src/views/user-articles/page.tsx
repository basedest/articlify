import { getTranslations } from 'next-intl/server';
import { createServerCaller } from '~/shared/api/trpc/server';
import { SmartList } from '~/widgets/smart-list';
import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar';
import { Badge } from '~/shared/ui/badge';

function parseTags(search: { [key: string]: string | string[] | undefined }): string[] {
    if (!search.tags) return [];
    return (Array.isArray(search.tags) ? search.tags : [search.tags]).filter(Boolean) as string[];
}

interface UserArticlesPageProps {
    params: Promise<{ author: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function UserArticlesPage({ params, searchParams }: UserArticlesPageProps) {
    const t = await getTranslations('articles');
    const { author } = await params;
    const search = await searchParams;

    const page = search.page ? parseInt(search.page as string) : 1;
    const title = (search.title as string) || '';
    const category = (search.category as string) || undefined;
    const tags = parseTags(search);

    const caller = await createServerCaller();
    const [result, availableTags] = await Promise.all([
        caller.article.list({
            author,
            title: title || undefined,
            category,
            tags: tags.length > 0 ? tags : undefined,
            page,
            pagesize: 10,
        }),
        caller.article.getDistinctTags(),
    ]);

    const articles = result.articles ?? [];
    const total = result.total ?? 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={`/api/user/avatar/${encodeURIComponent(author)}`} />
                    <AvatarFallback className="text-primary text-lg">{author[0]?.toUpperCase() ?? '?'}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold">
                    {t('articlesByLabel')} <span className="text-primary">@{author}</span>
                </h1>
                <Badge variant="secondary">{t('articlesCount', { count: total })}</Badge>
            </div>

            <SmartList
                articles={articles}
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

export async function generateMetadata({ params }: { params: Promise<{ author: string }> }) {
    const t = await getTranslations('articles');
    const { author } = await params;
    return {
        title: t('userArticlesPageTitle', { author }),
        description: t('userArticlesPageDescription', { author }),
    };
}
