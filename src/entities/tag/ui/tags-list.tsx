'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname, Link } from 'i18n/navigation';
import React from 'react';
import { Badge } from '~/shared/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/shared/ui/tooltip';

const MAX_VISIBLE_TAGS = 3;

function getTagsFromSearchParams(searchParams: URLSearchParams): string[] {
    const tags = searchParams.getAll('tags');
    return tags.filter(Boolean);
}

function buildHrefWithTag(pathname: string, searchParams: URLSearchParams, tag: string): string {
    const params = new URLSearchParams(searchParams);
    const current = getTagsFromSearchParams(params);
    if (current.includes(tag)) return `${pathname}?${params.toString()}`;
    params.delete('tags');
    [...current, tag].forEach((t) => params.append('tags', t));
    params.set('page', '1');
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
}

function orderTagsWithSelectedFirst(tags: string[], selectedTags: string[]): string[] {
    if (selectedTags.length === 0) return tags;
    const selectedSet = new Set(selectedTags);
    const selectedInArticle = selectedTags.filter((t) => tags.includes(t));
    const rest = tags.filter((t) => !selectedSet.has(t));
    return [...selectedInArticle, ...rest];
}

export function TagsList({
    tags,
    maxVisible = MAX_VISIBLE_TAGS,
    showAll = false,
}: {
    tags?: string[];
    maxVisible?: number;
    showAll?: boolean;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (!tags || tags.length === 0) {
        return <div />;
    }

    const selectedInUrl = getTagsFromSearchParams(searchParams);
    const selectedSet = new Set(selectedInUrl);
    const orderedTags = orderTagsWithSelectedFirst(tags, selectedInUrl);

    const visible = showAll ? orderedTags : orderedTags.slice(0, maxVisible);
    const collapsed = showAll ? [] : orderedTags.slice(maxVisible);
    const collapsedCount = collapsed.length;

    const badgeForTag = (tag: string) => {
        const isSelected = selectedSet.has(tag);
        return (
            <Badge
                variant={isSelected ? 'default' : 'outline'}
                className={
                    isSelected
                        ? 'h-8 cursor-pointer transition-colors'
                        : 'hover:bg-primary hover:text-primary-foreground h-8 cursor-pointer transition-colors'
                }
            >
                {tag}
            </Badge>
        );
    };

    return (
        <div
            className={
                showAll
                    ? 'flex flex-wrap items-center gap-2'
                    : 'flex h-9 min-w-0 flex-1 shrink-0 flex-nowrap items-center gap-2 overflow-hidden'
            }
        >
            {visible.map((tag) => (
                <Link key={tag} href={buildHrefWithTag(pathname, searchParams, tag)} className="shrink-0">
                    {badgeForTag(tag)}
                </Link>
            ))}
            {collapsedCount > 0 && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-muted-foreground h-8 shrink-0 cursor-default">
                            +{collapsedCount}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex flex-wrap items-center gap-2">
                            {collapsed.map((tag) => (
                                <Link
                                    key={tag}
                                    href={buildHrefWithTag(pathname, searchParams, tag)}
                                    className="shrink-0"
                                >
                                    {badgeForTag(tag)}
                                </Link>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    );
}
