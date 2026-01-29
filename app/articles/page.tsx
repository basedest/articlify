import { createServerCaller } from '~/lib/trpc/server';
import SmartList from '~/components/SmartList';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const search = await searchParams;

  const page = search.page ? parseInt(search.page as string) : 1;
  const title = (search.title as string) || '';
  const tags = search.tags
    ? Array.isArray(search.tags)
      ? search.tags
      : [search.tags]
    : undefined;

  const caller = await createServerCaller();
  const result = await caller.article.list({
    title: title || undefined,
    tags,
    page,
    pagesize: 10,
  });

  if (!result.articles || result.articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-primary">No articles</h1>
        <p className="text-muted-foreground">
          No articles match your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-primary">
        {tags && tags.length > 0 ? 'Articles by Tags' : 'All Articles'}
      </h1>

      <SmartList
        articles={result.articles}
        searchQuery={title}
        page={page}
        totalPages={result.totalPages}
      />
    </div>
  );
}

export async function generateMetadata({ searchParams }: PageProps) {
  const search = await searchParams;
  const title = (search.title as string) || '';

  return {
    title: title
      ? `Search: ${title} | Articlify`
      : 'All Articles | Articlify',
    description: 'Browse and search articles',
  };
}
