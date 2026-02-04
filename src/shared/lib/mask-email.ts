/**
 * Masks an email for display (e.g. "mail@example.com" → "m***@example.com").
 * Keeps the first character and the full domain.
 */
export function maskEmail(email: string): string {
    const at = email.indexOf('@');
    if (at <= 0) return '***';
    const local = email.slice(0, at);
    const domain = email.slice(at);
    const first = local[0] ?? '';
    return `${first}***${domain}`;
}
