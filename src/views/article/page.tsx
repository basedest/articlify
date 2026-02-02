import { createServerCallerPublic } from '~/shared/api/trpc/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from 'i18n/navigation';
import { TagsList } from '~/entities/tag/ui/tags-list';
import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar';
import { Button } from '~/shared/ui/button';
import { Separator } from '~/shared/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { ProseMirrorRenderer } from '~/shared/ui/prose-mirror-renderer';
import type { PMDoc } from '~/shared/types/prose-mirror';

export const revalidate = 30;

interface ArticlePageProps {
    params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
    const caller = createServerCallerPublic();
    const slugs = await caller.article.getAllSlugs();

    return slugs.map((article) => ({
        category: article.category,
        slug: article.slug,
    }));
}

export async function ArticlePage({ params }: ArticlePageProps) {
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
    const tCategory = await getTranslations('category');
    const tArticles = await getTranslations('articles');
    const categoryLabel = tCategory(article.category);

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="bg-card rounded-xl p-6 md:p-8">
                <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
                    <Image src={img} alt={`Cover image for ${article.title}`} fill className="object-cover" priority />
                </div>

                <div className="mb-8">
                    <div className="text-muted-foreground mb-4 flex items-center gap-3 text-sm">
                        <Link
                            href={`/articles/user/${article.author}`}
                            className="flex items-center gap-2 hover:opacity-90"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`/api/user/avatar/${encodeURIComponent(article.author)}`} />
                                <AvatarFallback>{article.author[0]?.toUpperCase() ?? '?'}</AvatarFallback>
                            </Avatar>
                            <span className="text-primary font-medium hover:underline">@{article.author}</span>
                        </Link>
                        <span>•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{article.title}</h1>

                    <p className="text-muted-foreground text-lg">{article.description}</p>
                </div>

                <Separator className="mb-8" />

                <article className="prose prose-zinc dark:prose-invert max-w-none">
                    {article.contentPm ? <ProseMirrorRenderer doc={article.contentPm as unknown as PMDoc} /> : null}
                </article>

                <div className="mt-12 space-y-6 border-t pt-8">
                    <TagsList tags={article.tags} showAll />

                    <p className="text-muted-foreground text-sm">
                        {tArticles('lastUpdated')}{' '}
                        {article.editedAt
                            ? new Date(article.editedAt).toLocaleString()
                            : new Date(article.createdAt).toLocaleString()}
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button variant="outline" asChild>
                            <Link href={`/${article.category}`}>
                                {tArticles('browseCategory', { category: categoryLabel })}
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {tArticles('returnToAllArticles')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
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
