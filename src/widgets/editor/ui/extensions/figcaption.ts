import { Node } from '@tiptap/core';

/**
 * Figcaption node: holds inline content (bold, link, etc.) for image captions.
 */
export const Figcaption = Node.create({
    name: 'figcaption',

    group: 'block',
    content: 'inline*',

    parseHTML() {
        return [{ tag: 'figcaption' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['figcaption', HTMLAttributes, 0];
    },
});
