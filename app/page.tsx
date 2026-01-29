import { createServerCaller } from '~/lib/trpc/server';
import SmartList from '~/components/SmartList';
import { Suspense } from 'react';
import { Skeleton } from '~/components/ui/skeleton';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const title = (params.title as string) || '';

  const caller = await createServerCaller();
  const result = await caller.article.list({
    page,
    pagesize: 10,
    title: title || undefined,
  });

  return (
    <div className="min-h-screen">
      <div className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl font-bold tracking-tight md:text-7xl">
            Articlify
          </h1>
          <h2 className="mt-4 text-xl font-light tracking-wide md:text-2xl">
            A place <em>with</em> articles and <em>without</em> cancel-culture.
          </h2>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ArticleListSkeleton />}>
          <SmartList
            articles={result.articles}
            searchQuery={title}
            page={page}
            totalPages={result.totalPages}
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
