import { createServerCallerPublic } from '~/lib/trpc/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TagsList from '~/components/TagsList';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { ProseMirrorRenderer } from '~/components/ProseMirrorRenderer';
import type { PMDoc } from '~/lib/ProseMirrorTypes';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const revalidate = 30; // ISR - revalidate every 30 seconds

export async function generateStaticParams() {
  const caller = createServerCallerPublic();
  const slugs = await caller.article.getAllSlugs();

  return slugs.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const caller = createServerCallerPublic();

  let article;
  try {
    article = await caller.article.getBySlug({ slug });
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  const img = article.img ?? `/img/${article.category}.png`;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-xl bg-card p-6 md:p-8">
      <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={img}
          alt={`Cover image for ${article.title}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/articles/user/${article.author}`}>
            <span className="font-medium text-primary hover:underline">
              @{article.author}
            </span>
          </Link>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          {article.title}
        </h1>

        <p className="text-lg text-muted-foreground">{article.description}</p>
      </div>

      <Separator className="mb-8" />

      <article className="prose prose-zinc dark:prose-invert max-w-none">
        {article.contentPm ? (
          <ProseMirrorRenderer doc={article.contentPm as unknown as PMDoc} />
        ) : null}
      </article>

      <div className="mt-12 space-y-6 border-t pt-8">
        <TagsList tags={article.tags} />

        <p className="text-sm text-muted-foreground">
          Last updated:{' '}
          {article.editedAt
            ? new Date(article.editedAt).toLocaleString()
            : new Date(article.createdAt).toLocaleString()}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <Link href={`/${article.category}`}>
              Browse {article.category} category
            </Link>
          </Button>

          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to all articles
            </Link>
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const caller = createServerCallerPublic();

  try {
    const article = await caller.article.getBySlug({ slug });
    return {
      title: `${article.title} | Articlify`,
      description: article.description,
    };
  } catch {
    return {
      title: 'Article Not Found | Articlify',
    };
  }
}
