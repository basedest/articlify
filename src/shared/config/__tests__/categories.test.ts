import { describe, it, expect } from 'vitest';
import { categories, type Category } from '../categories';

describe('categories', () => {
    describe('happy path', () => {
        it('exports non-empty array of categories', () => {
            expect(categories).toBeInstanceOf(Array);
            expect(categories.length).toBeGreaterThan(0);
        });

        it('includes expected category values', () => {
            expect(categories).toContain('art');
            expect(categories).toContain('it');
            expect(categories).toContain('games');
            expect(categories).toContain('music');
            expect(categories).toContain('science');
            expect(categories).toContain('sports');
            expect(categories).toContain('travel');
            expect(categories).toContain('movies');
            expect(categories).toContain('other');
        });
    });

    describe('edge cases', () => {
        it('every element is a valid Category type', () => {
            const validCategories: Category[] = [...categories];
            expect(validCategories).toHaveLength(categories.length);
        });

        it('has fixed length of 9 categories', () => {
            expect(categories).toHaveLength(9);
        });
    });
});
