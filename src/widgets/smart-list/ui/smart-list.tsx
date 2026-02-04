/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { PenSquare, X } from 'lucide-react';
import { authClient } from '~/shared/api/auth-client';
import { useRouter, usePathname, Link } from 'i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState, useCallback, useEffect } from 'react';
import type { Article } from '~/entities/article/model/types';
import { categories, type Category } from '~/shared/config/categories';
import { Button } from '~/shared/ui/button';
import { ArticleList } from '~/widgets/article-list';
import { SearchBar } from './search-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/ui/select';
import { MultiSelect } from '~/shared/ui/multi-select';
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
    initialCategory?: string;
    initialTags?: string[];
    showCategoryFilter: boolean;
    availableTags: string[];
}

export function SmartList(props: SmartListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = authClient.useSession();
    const t = useTranslations('articles');
    const tCategory = useTranslations('category');
    const tEditor = useTranslations('editor');
    const [searchQuery, setSearchQuery] = useState(props.searchQuery || '');
    const [category, setCategory] = useState<string>(props.initialCategory ?? '');
    const [selectedTags, setSelectedTags] = useState<string[]>(props.initialTags ?? []);

    useEffect(() => {
        if (props.searchQuery) {
            setSearchQuery(props.searchQuery);
        }
    }, [props.searchQuery]);
    useEffect(() => {
        if (props.initialCategory) {
            setCategory(props.initialCategory);
        }
    }, [props.initialCategory]);
    useEffect(() => {
        if (props.initialTags) {
            setSelectedTags(props.initialTags);
        }
    }, [props.initialTags]);

    const caption =
        props.articles.length === 0 ? t('noArticles') : props.searchQuery ? t('searchResults') : t('latestArticles');

    const buildParams = useCallback(
        (opts: { page?: number; title?: string; category?: string; tags?: string[] }) => {
            const params = new URLSearchParams();
            const title = opts.title !== undefined ? opts.title : searchQuery;
            const page = opts.page ?? props.page;
            const cat = opts.category !== undefined ? opts.category : category;
            const tags = opts.tags !== undefined ? opts.tags : selectedTags;

            if (title) params.set('title', title);
            params.set('page', page.toString());
            if (props.showCategoryFilter && cat) params.set('category', cat);
            tags.forEach((tag) => params.append('tags', tag));
            return params;
        },
        [searchQuery, category, selectedTags, props.page, props.showCategoryFilter],
    );

    const handleSearch = () => {
        router.push(`${pathname}?${buildParams({ page: 1 }).toString()}`);
    };

    const buildPageUrl = (page: number) => {
        return `${pathname}?${buildParams({ page }).toString()}`;
    };

    const changePage = (page: number) => {
        router.push(buildPageUrl(page));
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        const params = buildParams({ category: value || undefined, page: 1 });
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleTagsChange = (tags: string[]) => {
        setSelectedTags(tags);
        const params = buildParams({ tags, page: 1 });
        router.push(`${pathname}?${params.toString()}`);
    };

    const hasActiveFilters =
        searchQuery.trim() !== '' || selectedTags.length > 0 || (props.showCategoryFilter && category !== '');

    const handleResetFilters = () => {
        setSearchQuery('');
        setCategory('');
        setSelectedTags([]);
        router.push(`${pathname}?page=1`);
    };

    const { page, totalPages } = props;
    const pageStart = Math.max(1, page - 2);
    const pageEnd = Math.min(totalPages, page + 2);
    const showLeftEllipsis = pageStart > 1;
    const showRightEllipsis = pageEnd < totalPages;
    const pageNumbers = Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i);

    const categoryOptions = categories as readonly string[];
    const tagOptions = props.availableTags.map((value) => ({ value, label: value }));

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-[200px] flex-1">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        placeholder={t('searchByTitle')}
                    />
                </div>
                {props.showCategoryFilter && (
                    <Select
                        value={category || '_all'}
                        onValueChange={(v) => handleCategoryChange(v === '_all' ? '' : v)}
                    >
                        <SelectTrigger className="bg-input dark:bg-input/30 h-10 w-[180px]">
                            <SelectValue placeholder={t('filterAllCategories')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_all">{t('filterAllCategories')}</SelectItem>
                            {categoryOptions.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {tCategory(cat as Category)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <div className="max-w-[320px] min-w-[200px] flex-1">
                    <MultiSelect
                        options={tagOptions}
                        selected={selectedTags}
                        onChange={handleTagsChange}
                        placeholder={t('filterTags')}
                        allowCustom={false}
                    />
                </div>
                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleResetFilters}
                        title={t('resetFilters')}
                        className="h-10 shrink-0"
                    >
                        <X className="size-4" />
                    </Button>
                )}
            </div>

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

            {props.articles.length === 0 ? (
                <div className="text-muted-foreground flex min-h-[200px] items-center justify-center rounded-lg border border-dashed p-8">
                    <p className="text-center">{t('noArticlesMatchCriteria')}</p>
                </div>
            ) : (
                <ArticleList articles={props.articles} />
            )}

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
