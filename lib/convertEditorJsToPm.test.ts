/**
 * Unit tests for EditorJS → ProseMirror converter (Phase 2).
 * Run with: node --test lib/convertEditorJsToPm.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  inlineFromHtml,
  convertEditorJsToPm,
  convertBlock,
  type EditorJsDoc,
  type EditorJsBlock,
} from './convertEditorJsToPm.ts';

function hasMarks(node: { marks?: unknown[] }, ...types: string[]) {
  const marks = node.marks ?? [];
  for (const t of types) {
    if (!marks.some((m: { type?: string }) => m.type === t)) return false;
  }
  return true;
}

describe('inlineFromHtml', () => {
  it('returns empty array for empty string', () => {
    assert.deepStrictEqual(inlineFromHtml(''), []);
    assert.deepStrictEqual(inlineFromHtml('   '), []);
  });

  it('parses plain text', () => {
    assert.deepStrictEqual(inlineFromHtml('hello'), [{ type: 'text', text: 'hello' }]);
  });

  it('parses bold', () => {
    assert.deepStrictEqual(inlineFromHtml('<b>bold</b>'), [
      { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
    ]);
  });

  it('parses link with safe href', () => {
    const out = inlineFromHtml('<a href="https://example.com">link</a>');
    assert.strictEqual(out.length, 1);
    assert.strictEqual(out[0].type, 'text');
    assert.strictEqual((out[0] as { text?: string }).text, 'link');
    assert.ok(hasMarks(out[0] as { marks?: unknown[] }, 'link'));
    const linkMark = (out[0] as { marks?: { type: string; attrs?: { href?: string } }[] }).marks?.find(
      (m) => m.type === 'link'
    );
    assert.strictEqual(linkMark?.attrs?.href, 'https://example.com');
  });

  it('strips link with javascript href', () => {
    const out = inlineFromHtml('<a href="javascript:alert(1)">x</a>');
    assert.deepStrictEqual(out, [{ type: 'text', text: 'x' }]);
  });

  it('parses hardBreak from br', () => {
    const out = inlineFromHtml('a<br>b');
    assert.deepStrictEqual(out, [
      { type: 'text', text: 'a' },
      { type: 'hardBreak' },
      { type: 'text', text: 'b' },
    ]);
  });

  it('normalizes nbsp to space', () => {
    const out = inlineFromHtml('a&nbsp;b');
    assert.deepStrictEqual(out, [{ type: 'text', text: 'a b' }]);
  });

  it('parses nested marks', () => {
    const out = inlineFromHtml('<b><i>bi</i></b>');
    assert.strictEqual(out.length, 1);
    assert.ok(hasMarks(out[0] as { marks?: unknown[] }, 'bold'));
    assert.ok(hasMarks(out[0] as { marks?: unknown[] }, 'italic'));
  });

  it('parses code mark', () => {
    assert.deepStrictEqual(inlineFromHtml('<code>x</code>'), [
      { type: 'text', text: 'x', marks: [{ type: 'code' }] },
    ]);
  });
});

describe('convertBlock', () => {
  it('converts paragraph', () => {
    const out = convertBlock({ type: 'paragraph', data: { text: 'hello' } });
    assert.strictEqual(out.length, 1);
    assert.strictEqual(out[0].type, 'paragraph');
    assert.deepStrictEqual(out[0].content, [{ type: 'text', text: 'hello' }]);
  });

  it('converts header', () => {
    const out = convertBlock({ type: 'header', data: { text: 'Title', level: 2 } });
    assert.strictEqual(out.length, 1);
    assert.strictEqual(out[0].type, 'heading');
    assert.deepStrictEqual(out[0].attrs, { level: 2 });
    assert.deepStrictEqual(out[0].content, [{ type: 'text', text: 'Title' }]);
  });

  it('converts delimiter to horizontalRule', () => {
    const out = convertBlock({ type: 'delimiter', data: {} });
    assert.deepStrictEqual(out, [{ type: 'horizontalRule' }]);
  });

  it('converts code block', () => {
    const out = convertBlock({ type: 'code', data: { code: 'const x = 1;' } });
    assert.deepStrictEqual(out, [{ type: 'codeBlock', content: [{ type: 'text', text: 'const x = 1;' }] }]);
  });

  it('converts checklist to taskList', () => {
    const out = convertBlock({
      type: 'checklist',
      data: {
        items: [
          { text: 'one', checked: false },
          { text: 'two', checked: true },
        ],
      },
    });
    assert.strictEqual(out.length, 1);
    assert.strictEqual(out[0].type, 'taskList');
    const items = (out[0].content ?? []) as { type: string; attrs?: { checked?: boolean } }[];
    assert.strictEqual(items.length, 2);
    assert.strictEqual(items[0].type, 'taskItem');
    assert.strictEqual(items[0].attrs?.checked, false);
    assert.strictEqual(items[1].type, 'taskItem');
    assert.strictEqual(items[1].attrs?.checked, true);
  });

  it('converts unknown block to codeBlock with JSON', () => {
    const block: EditorJsBlock = { type: 'embed', data: { url: 'https://x.com' } };
    const out = convertBlock(block);
    assert.strictEqual(out.length, 1);
    assert.strictEqual(out[0].type, 'codeBlock');
    const text = (out[0].content as { type: string; text: string }[])?.[0]?.text;
    assert.ok(text?.includes('embed'));
    assert.deepStrictEqual(JSON.parse(text!), block);
  });
});

describe('convertEditorJsToPm', () => {
  it('returns doc with empty paragraph when no blocks', () => {
    const out = convertEditorJsToPm({});
    assert.deepStrictEqual(out, { type: 'doc', content: [{ type: 'paragraph' }] });
  });

  it('returns doc with empty paragraph when blocks is empty array', () => {
    const out = convertEditorJsToPm({ blocks: [] });
    assert.deepStrictEqual(out, { type: 'doc', content: [{ type: 'paragraph' }] });
  });

  it('converts single paragraph block', () => {
    const out = convertEditorJsToPm({
      blocks: [{ type: 'paragraph', data: { text: 'Hi' } }],
    });
    assert.strictEqual(out.type, 'doc');
    assert.strictEqual(out.content!.length, 1);
    assert.strictEqual(out.content![0].type, 'paragraph');
    assert.deepStrictEqual(out.content![0].content, [{ type: 'text', text: 'Hi' }]);
  });

  it('converts multiple blocks', () => {
    const out = convertEditorJsToPm({
      blocks: [
        { type: 'paragraph', data: { text: 'A' } },
        { type: 'delimiter', data: {} },
        { type: 'paragraph', data: { text: 'B' } },
      ],
    });
    assert.strictEqual(out.content!.length, 3);
    assert.strictEqual(out.content![0].type, 'paragraph');
    assert.deepStrictEqual(out.content![1], { type: 'horizontalRule' });
    assert.strictEqual(out.content![2].type, 'paragraph');
  });

  it('converts list block to bulletList with listItems', () => {
    const out = convertEditorJsToPm({
      blocks: [{ type: 'list', data: { style: 'unordered', items: ['a', 'b'] } }],
    });
    assert.strictEqual(out.content!.length, 1);
    assert.strictEqual(out.content![0].type, 'bulletList');
    const items = (out.content![0].content ?? []) as { type: string }[];
    assert.strictEqual(items.length, 2);
    assert.strictEqual(items[0].type, 'listItem');
  });
});
