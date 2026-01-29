'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Article } from '~/lib/ArticleTypes';
import ArticleList from '../ArticleList';
import SearchBar from '../SearchBar';
import { Button } from '~/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SmartListProps {
  articles: Article[];
  page: number;
  searchQuery: string;
  totalPages: number;
}

export default function SmartList(props: SmartListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(props.searchQuery || '');
  const [caption, setCaption] = useState('Latest articles');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('title', searchQuery);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (props.articles.length === 0) {
      setCaption('No articles');
    } else if (props.searchQuery) {
      setCaption(`Search results [Page ${props.page}]`);
    } else {
      setCaption(`Latest articles [Page ${props.page}]`);
    }
  }, [props.articles, props.searchQuery, props.page]);

  const changePage = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('title', searchQuery);
    }
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <h2 className="text-2xl font-bold text-primary">{caption}</h2>

      <ArticleList articles={props.articles} />

      {props.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => changePage(props.page - 1)}
            disabled={props.page <= 1}
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {props.page} of {props.totalPages}
          </span>
          <Button
            onClick={() => changePage(props.page + 1)}
            disabled={props.page >= props.totalPages}
            variant="outline"
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}