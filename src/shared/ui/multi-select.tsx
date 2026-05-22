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
    ariaLabel?: string;
    /** Label rendered above the "create new" option when allowCustom is true. Receives the typed value. */
    createLabel?: (value: string) => string;
    /** Localized label for the per-tag remove button (e.g. "Remove tag"). */
    removeLabel?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Select items...',
    className,
    allowCustom = false,
    ariaLabel,
    createLabel,
    removeLabel = 'Remove',
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
        } else if (e.key === 'Escape') {
            setInputValue('');
        } else if (e.key === 'Backspace' && !input.value && selected.length > 0) {
            onChange(selected.slice(0, -1));
        }
    };

    const selectables = options.filter((option) => !selected.includes(option.value));

    return (
        <div className={cn('relative', className)}>
            <div
                role="combobox"
                aria-expanded={!!inputValue && selectables.length > 0}
                aria-haspopup="listbox"
                aria-label={ariaLabel}
                className="border-input bg-input dark:bg-input/30 ring-offset-background focus-within:ring-ring flex h-10 w-full flex-nowrap items-center gap-1 overflow-x-auto rounded-md border px-3 py-2 text-sm focus-within:ring-1"
            >
                {selected.map((item) => {
                    const option = options.find((o) => o.value === item);
                    return (
                        <Badge key={item} variant="secondary" className="gap-1">
                            {option?.label || item}
                            <button
                                type="button"
                                aria-label={`${removeLabel}: ${option?.label || item}`}
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
                    aria-label={ariaLabel}
                    className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
                />
            </div>
            {inputValue && selectables.length > 0 && (
                <div className="relative">
                    <div
                        role="listbox"
                        className="bg-popover text-popover-foreground animate-in absolute top-2 z-10 w-full rounded-md border shadow-md outline-none"
                    >
                        <div className="max-h-64 overflow-auto p-1">
                            {selectables
                                .filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
                                .map((option) => (
                                    <div
                                        key={option.value}
                                        role="option"
                                        aria-selected={false}
                                        tabIndex={0}
                                        onClick={() => {
                                            onChange([...selected, option.value]);
                                            setInputValue('');
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                onChange([...selected, option.value]);
                                                setInputValue('');
                                            }
                                        }}
                                        className="hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            {allowCustom && (
                                <div
                                    role="option"
                                    aria-selected={false}
                                    tabIndex={0}
                                    onClick={() => {
                                        const newValue = inputValue.trim().toLowerCase();
                                        if (newValue && !selected.includes(newValue)) {
                                            onChange([...selected, newValue]);
                                            setInputValue('');
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            const newValue = inputValue.trim().toLowerCase();
                                            if (newValue && !selected.includes(newValue)) {
                                                onChange([...selected, newValue]);
                                                setInputValue('');
                                            }
                                        }
                                    }}
                                    className="hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
                                >
                                    {createLabel ? createLabel(inputValue) : `Create "${inputValue}"`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
