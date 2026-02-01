import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
    describe('happy path', () => {
        it('merges multiple class strings', () => {
            const result = cn('foo', 'bar');
            expect(result).toBe('foo bar');
        });

        it('deduplicates tailwind classes with later override', () => {
            const result = cn('p-4', 'p-2');
            expect(result).toBe('p-2');
        });

        it('combines conditional and static classes', () => {
            const result = cn('base', true && 'included', false && 'excluded');
            expect(result).toBe('base included');
        });
    });

    describe('edge cases', () => {
        it('handles empty string', () => {
            expect(cn('')).toBe('');
        });

        it('handles undefined and null', () => {
            expect(cn(undefined, 'a', null)).toBe('a');
        });

        it('handles single argument', () => {
            expect(cn('only')).toBe('only');
        });

        it('handles no arguments', () => {
            expect(cn()).toBe('');
        });

        it('handles conditional object (classNames pattern)', () => {
            const result = cn({ 'font-bold': true, italic: false });
            expect(result).toBe('font-bold');
        });
    });

    describe('invalid input', () => {
        it('handles non-string values via clsx', () => {
            expect(cn(0, false, null, undefined)).toBe('');
        });

        it('handles mixed valid and invalid inputs', () => {
            const result = cn('valid', undefined, null, false, 0, 'end');
            expect(result).toBe('valid end');
        });
    });
});
