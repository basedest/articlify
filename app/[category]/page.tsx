import { createServerCaller } from '~/lib/trpc/server';
import { notFound } from 'next/navigation';
import SmartList from '~/components/SmartList';
import { categories } from '~/lib/lib';
import { Badge } from '~/components/ui/badge';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category } = await params;
  const search = await searchParams;

  // Validate category
  if (!categories.includes(category)) {
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

      <SmartList
        articles={result.articles}
        searchQuery={title}
        page={page}
        totalPages={result.totalPages}
      />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Articles | Articlify`,
    description: `Browse all articles in the ${category} category`,
  };
}
