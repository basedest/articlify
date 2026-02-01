'use client';

import { useEffect, useRef } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { Search } from 'lucide-react';
import { Input } from '~/shared/ui/input';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
    debounceMs?: number;
}

export function SearchBar({
    value,
    onChange,
    onSearch,
    placeholder = 'Search by title...',
    debounceMs = 500,
}: SearchBarProps) {
    const [debouncedValue] = useDebounceValue(value, debounceMs);
    const onSearchRef = useRef(onSearch);
    const isFirstRun = useRef(true);

    useEffect(() => {
        onSearchRef.current = onSearch;
    }, [onSearch]);

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
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
                className="bg-input dark:bg-input pl-9"
                placeholder={placeholder}
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
