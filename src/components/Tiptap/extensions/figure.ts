import { Node } from '@tiptap/core';

/**
 * Figure node: wraps one image and an optional figcaption.
 * Structure: figure(image, figcaption?)
 * Register Image and Figcaption extensions in the editor when using Figure.
 */
export const Figure = Node.create({
  name: 'figure',

  group: 'block',
  content: 'image figcaption?',

  parseHTML() {
    return [{ tag: 'figure' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', HTMLAttributes, 0];
  },
});
