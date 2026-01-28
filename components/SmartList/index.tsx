'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Article } from '@/lib/ArticleTypes';
import ArticleList from '../ArticleList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const clearInput = () => {
    setSearchQuery('');
    router.push(pathname);
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
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} variant="default">
          <Search className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Search</span>
        </Button>
        <Button onClick={clearInput} variant="outline">
          <X className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Clear</span>
        </Button>
      </div>

      {/* Caption */}
      <h2 className="text-2xl font-bold text-primary">{caption}</h2>

      {/* Articles List */}
      <ArticleList articles={props.articles} />

      {/* Pagination */}
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