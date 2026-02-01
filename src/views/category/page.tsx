import { createServerCaller } from '~/shared/api/trpc/server';
import { notFound } from 'next/navigation';
import { SmartList } from '~/widgets/smart-list';
import { categories, Category } from '~/shared/config/categories';
import { Badge } from '~/shared/ui/badge';

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

    const caller = await createServerCaller();
    const result = await caller.article.list({
        category,
        title: title || undefined,
        page,
        pagesize: 10,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center gap-3">
                <h1 className="text-4xl font-bold capitalize">{category}</h1>
                <Badge variant="secondary" className="text-lg">
                    {result.total} articles
                </Badge>
            </div>

            <SmartList articles={result.articles} searchQuery={title} page={page} totalPages={result.totalPages} />
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    return {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Articles | Articlify`,
        description: `Browse all articles in the ${category} category`,
    };
}
