import { createServerCaller } from '~/shared/api/trpc/server';
import { getTranslations } from 'next-intl/server';
import { SmartList } from '~/widgets/smart-list';
import { Suspense } from 'react';
import { Skeleton } from '~/shared/ui/skeleton';

function parseTags(search: { [key: string]: string | string[] | undefined }): string[] {
    if (!search.tags) return [];
    return (Array.isArray(search.tags) ? search.tags : [search.tags]).filter(Boolean) as string[];
}

interface HomePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function HomePage({ searchParams }: HomePageProps) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page as string) : 1;
    const title = (params.title as string) || '';
    const category = (params.category as string) || undefined;
    const tags = parseTags(params);

    const caller = await createServerCaller();
    const [result, availableTags] = await Promise.all([
        caller.article.list({
            page,
            pagesize: 10,
            title: title || undefined,
            category,
            tags: tags.length > 0 ? tags : undefined,
        }),
        caller.article.getDistinctTags(),
    ]);

    const t = await getTranslations('home');
    const tNav = await getTranslations('nav');

    return (
        <div className="min-h-screen">
            <div className="from-primary to-primary/80 text-primary-foreground w-full bg-gradient-to-r shadow-lg">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-6xl font-bold tracking-tight md:text-7xl">{tNav('brand')}</h1>
                    <h2 className="mt-4 text-xl font-light tracking-wide md:text-2xl">
                        {t.rich('tagline', { em: (chunks) => <em>{chunks}</em> })}
                    </h2>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<ArticleListSkeleton />}>
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
                </Suspense>
            </div>
        </div>
    );
}

function ArticleListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
    );
}
