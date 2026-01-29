'use client';

import { useEffect, useRef } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { Search } from 'lucide-react';
import { Input } from '~/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search by title...',
  debounceMs = 500,
}: SearchBarProps) {
  const [debouncedValue] = useDebounceValue(value, debounceMs);
  const onSearchRef = useRef(onSearch);
  const isFirstRun = useRef(true);
  onSearchRef.current = onSearch;

  // Only run when debouncedValue changes 
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onSearchRef.current();
  }, [debouncedValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
      <Input
        className="bg-background pl-9"
        placeholder={placeholder}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
