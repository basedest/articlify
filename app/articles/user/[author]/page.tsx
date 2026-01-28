import { createServerCaller } from '@/lib/trpc/server';
import SmartList from '@/components/SmartList';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface PageProps {
  params: Promise<{ author: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UserArticlesPage({
  params,
  searchParams,
}: PageProps) {
  const { author } = await params;
  const search = await searchParams;

  const page = search.page ? parseInt(search.page as string) : 1;
  const title = (search.title as string) || '';

  const caller = await createServerCaller();
  const result = await caller.article.list({
    author,
    title: title || undefined,
    page,
    pagesize: 10,
  });

  if (!result.articles || result.articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-primary">No articles</h1>
        <p className="text-muted-foreground">
          @{author} hasn&apos;t published any articles yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">
          Articles by <span className="text-primary">@{author}</span>
        </h1>
        <Badge variant="secondary">{result.total} articles</Badge>
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
  const { author } = await params;
  return {
    title: `Articles by @${author} | Articlify`,
    description: `Browse all articles written by ${author}`,
  };
}
