'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge } from '~/shared/ui/badge';
import { cn } from '~/shared/lib/utils';

export interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
    allowCustom?: boolean;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Select items...',
    className,
    allowCustom = false,
}: MultiSelectProps) {
    const [inputValue, setInputValue] = React.useState('');

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        if (e.key === 'Enter' && inputValue && allowCustom) {
            e.preventDefault();
            const newValue = inputValue.trim().toLowerCase();
            if (newValue && !selected.includes(newValue)) {
                onChange([...selected, newValue]);
                setInputValue('');
            }
        } else if (e.key === 'Backspace' && !input.value && selected.length > 0) {
            onChange(selected.slice(0, -1));
        }
    };

    const selectables = options.filter((option) => !selected.includes(option.value));

    return (
        <div className={cn('relative', className)}>
            <div className="border-input bg-input dark:bg-input/30 ring-offset-background focus-within:ring-ring flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border px-3 py-2 text-sm focus-within:ring-1">
                {selected.map((item) => {
                    const option = options.find((o) => o.value === item);
                    return (
                        <Badge key={item} variant="secondary" className="gap-1">
                            {option?.label || item}
                            <button
                                type="button"
                                className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUnselect(item);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(item)}
                            >
                                <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                            </button>
                        </Badge>
                    );
                })}
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selected.length === 0 ? placeholder : ''}
                    className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
                />
            </div>
            {inputValue && selectables.length > 0 && (
                <div className="relative">
                    <div className="bg-popover text-popover-foreground animate-in absolute top-2 z-10 w-full rounded-md border shadow-md outline-none">
                        <div className="max-h-64 overflow-auto p-1">
                            {selectables
                                .filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
                                .map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            onChange([...selected, option.value]);
                                            setInputValue('');
                                        }}
                                        className="hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            {allowCustom && (
                                <div
                                    onClick={() => {
                                        const newValue = inputValue.trim().toLowerCase();
                                        if (newValue && !selected.includes(newValue)) {
                                            onChange([...selected, newValue]);
                                            setInputValue('');
                                        }
                                    }}
                                    className="hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
                                >
                                    Create &quot;{inputValue}&quot;
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
