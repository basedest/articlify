/**
 * Escape a string so it can be safely used inside a RegExp literal source.
 * Use this when accepting user-controlled input into a regex (e.g. case-insensitive
 * substring search in a database query).
 */
export function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
