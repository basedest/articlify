import { describe, it, expect } from 'vitest';
import { escapeRegex } from '~/shared/lib/escape-regex';

describe('escapeRegex', () => {
    it('leaves ordinary characters untouched', () => {
        expect(escapeRegex('hello world')).toBe('hello world');
        expect(escapeRegex('Привет мир')).toBe('Привет мир');
    });

    it('escapes all regex metacharacters', () => {
        expect(escapeRegex('.*+?^${}()|[]\\')).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('produces a regex source that matches the original input literally', () => {
        const inputs = ['a(b', 'foo.*bar', '$100', '(^_^)', 'C:\\path\\to\\file'];
        for (const s of inputs) {
            const re = new RegExp(escapeRegex(s));
            expect(re.test(s)).toBe(true);
        }
    });

    it('escaped input cannot trigger ReDoS by injecting alternation/quantifiers', () => {
        // Without escaping, `(a+)+` triggers catastrophic backtracking on input
        // like 'aaaaaaaaaaaaaaaaa!'. With escaping, the source matches literally
        // and the regex compiles to a safe literal.
        const evil = '(a+)+';
        const re = new RegExp(escapeRegex(evil));
        expect(re.test(evil)).toBe(true);
        expect(re.test('aaaaaaaaaaaaaaaaa!')).toBe(false);
    });
});
