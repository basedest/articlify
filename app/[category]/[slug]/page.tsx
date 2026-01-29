import { createServerCaller } from '~/lib/trpc/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TagsList from '~/components/TagsList';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const revalidate = 30; // ISR - revalidate every 30 seconds

export async function generateStaticParams() {
  const caller = await createServerCaller();
  const slugs = await caller.article.getAllSlugs();

  return slugs.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const caller = await createServerCaller();

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
        {article?.content?.blocks.map((item: any) => {
          const { id } = item;
          switch (item.type) {
            case 'paragraph':
              return (
                <p
                  key={id}
                  dangerouslySetInnerHTML={{ __html: item.data.text }}
                  className="mb-4 leading-relaxed"
                />
              );
            case 'header':
              return item.data.level === 2 ? (
                <h2 key={id} className="mb-6 mt-12 text-3xl font-bold">
                  {item.data.text}
                </h2>
              ) : (
                <h3 key={id} className="mb-4 mt-8 text-2xl font-semibold">
                  {item.data.text}
                </h3>
              );
            case 'list':
              if (item.data.style === 'ordered') {
                return (
                  <ol key={id} className="mb-4 list-decimal pl-6">
                    {item.data.items.map((li: any, i: number) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{ __html: li }}
                        className="mb-2"
                      />
                    ))}
                  </ol>
                );
              } else {
                return (
                  <ul key={id} className="mb-4 list-disc pl-6">
                    {item.data.items.map((li: any, i: number) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{ __html: li }}
                        className="mb-2"
                      />
                    ))}
                  </ul>
                );
              }
            case 'quote':
              return (
                <blockquote
                  key={id}
                  className="mb-6 border-l-4 border-primary pl-4 italic"
                >
                  <p dangerouslySetInnerHTML={{ __html: item.data.text }} />
                  {item.data.caption && (
                    <footer className="mt-2 text-sm text-muted-foreground">
                      — {item.data.caption}
                    </footer>
                  )}
                </blockquote>
              );
            case 'checklist':
              return (
                <ul key={id} className="mb-4 list-none space-y-2">
                  {item.data.items.map((li: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      {li.checked ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      )}
                      <span dangerouslySetInnerHTML={{ __html: li.text }} />
                    </li>
                  ))}
                </ul>
              );
            case 'delimiter':
              return (
                <Separator key={id} className="my-8" />
              );
            case 'simpleImage':
            case 'image':
              return (
                <figure key={id} className="my-6">
                  <img
                    className="w-full rounded-lg"
                    src={item.data.url || item.data.file?.url}
                    alt={item.data.caption || ''}
                  />
                  {item.data.caption && (
                    <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                      {item.data.caption}
                    </figcaption>
                  )}
                </figure>
              );
            case 'code':
              return (
                <pre
                  key={id}
                  className="my-6 overflow-x-auto rounded-lg bg-muted p-4"
                >
                  <code>{item.data.code}</code>
                </pre>
              );
            case 'table':
              return (
                <div key={id} className="my-6 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {item.data.content.map((row: string[], i: number) => (
                        <tr key={i} className="border-b">
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="border px-4 py-2"
                              dangerouslySetInnerHTML={{ __html: cell }}
                            />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            case 'warning':
              return (
                <div
                  key={id}
                  className="my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950"
                >
                  <div className="font-semibold">{item.data.title}</div>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.data.message }}
                    className="mt-1 text-sm"
                  />
                </div>
              );
            default:
              return null;
          }
        })}
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
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const caller = await createServerCaller();

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
