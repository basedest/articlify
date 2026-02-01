import { Node } from '@tiptap/core';

export type CalloutType = 'warning' | 'info' | 'note';

/**
 * Callout node for warning/info/note blocks (e.g. EditorJS warning).
 * attrs: type, title. content: block+ (paragraphs).
 */
export const Callout = Node.create({
    name: 'callout',

    group: 'block',
    content: 'block+',

    addAttributes() {
        return {
            type: {
                default: 'warning',
                parseHTML: (el) => (el.getAttribute('data-type') as CalloutType) || 'warning',
                renderHTML: (attrs) => ({ 'data-type': attrs.type }),
            },
            title: {
                default: '',
                parseHTML: (el) => el.getAttribute('data-title') ?? '',
                renderHTML: (attrs) => (attrs.title ? { 'data-title': attrs.title } : {}),
            },
        };
    },

    parseHTML() {
        return [{ tag: '[data-callout]' }];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'div',
            {
                ...HTMLAttributes,
                'data-callout': '',
                'data-type': node.attrs.type,
                'data-title': node.attrs.title || '',
            },
            0,
        ];
    },
});
