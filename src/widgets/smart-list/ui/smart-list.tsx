'use client';

import { PenSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname, Link } from 'i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { Article } from '~/entities/article/model/types';
import { Button } from '~/shared/ui/button';
import { ArticleList } from '~/widgets/article-list';
import { SearchBar } from './search-bar';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '~/shared/ui/pagination';

interface SmartListProps {
    articles: Article[];
    page: number;
    searchQuery: string;
    totalPages: number;
}

export function SmartList(props: SmartListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const t = useTranslations('articles');
    const tEditor = useTranslations('editor');
    const [searchQuery, setSearchQuery] = useState(props.searchQuery || '');
    const caption =
        props.articles.length === 0 ? t('noArticles') : props.searchQuery ? t('searchResults') : t('latestArticles');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) {
            params.set('title', searchQuery);
        }
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams();
        if (searchQuery) {
            params.set('title', searchQuery);
        }
        params.set('page', page.toString());
        return `${pathname}?${params.toString()}`;
    };

    const changePage = (page: number) => {
        router.push(buildPageUrl(page));
    };

    const { page, totalPages } = props;
    const pageStart = Math.max(1, page - 2);
    const pageEnd = Math.min(totalPages, page + 2);
    const showLeftEllipsis = pageStart > 1;
    const showRightEllipsis = pageEnd < totalPages;
    const pageNumbers = Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i);

    return (
        <div className="space-y-6">
            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder={t('searchByTitle')}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-primary text-2xl font-bold">{caption}</h2>
                {session && (
                    <Button asChild>
                        <Link href="/editor" className="inline-flex items-center gap-2">
                            <PenSquare className="size-4" />
                            {tEditor('createNewArticle')}
                        </Link>
                    </Button>
                )}
            </div>

            <ArticleList articles={props.articles} />

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href={page > 1 ? buildPageUrl(page - 1) : '#'}
                                onClick={(e) => {
                                    if (page <= 1) e.preventDefault();
                                    else {
                                        e.preventDefault();
                                        changePage(page - 1);
                                    }
                                }}
                                className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                aria-disabled={page <= 1}
                            />
                        </PaginationItem>
                        {showLeftEllipsis && (
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        href={buildPageUrl(1)}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            changePage(1);
                                        }}
                                    >
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            </>
                        )}
                        {pageNumbers.map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href={buildPageUrl(p)}
                                    isActive={p === page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        changePage(p);
                                    }}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        {showRightEllipsis && (
                            <>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href={buildPageUrl(totalPages)}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            changePage(totalPages);
                                        }}
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}
                        <PaginationItem>
                            <PaginationNext
                                href={page < totalPages ? buildPageUrl(page + 1) : '#'}
                                onClick={(e) => {
                                    if (page >= totalPages) e.preventDefault();
                                    else {
                                        e.preventDefault();
                                        changePage(page + 1);
                                    }
                                }}
                                className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                aria-disabled={page >= totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
