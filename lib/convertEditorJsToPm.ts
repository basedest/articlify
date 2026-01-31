/**
 * Phase 2: EditorJS → ProseMirror conversion module.
 * Converts EditorJS block JSON to Tiptap/PM doc JSON for migration and rendering.
 */

import type { PMDoc, PMNode, PMMark } from './ProseMirrorTypes';

// --- Types -------------------------------------------------------------------

export interface EditorJsBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface EditorJsDoc {
  time?: number;
  blocks?: EditorJsBlock[];
}

// --- Link safety --------------------------------------------------------------

const ALLOWED_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

function sanitizeHref(href: unknown): string | null {
  if (typeof href !== 'string' || !href.trim()) return null;
  try {
    const u = new URL(href.trim(), 'https://example.com');
    return ALLOWED_LINK_PROTOCOLS.includes(u.protocol) ? href.trim() : null;
  } catch {
    return null;
  }
}

// --- HTML sanitization -------------------------------------------------------

const ALLOWED_TAGS = new Set(['a', 'b', 'strong', 'i', 'em', 'u', 'mark', 'code', 'br']);
const TAG_OR_ENTITY = /<(\/?)(\w+)([^>]*)>|&nbsp;|&amp;|&lt;|&gt;|&quot;|&#?\w+;/g;

function sanitizeHtml(html: string): string {
  const normalized = html.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  let out = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const tagStack: string[] = [];

  const regex = new RegExp(TAG_OR_ENTITY.source, 'gi');
  while ((match = regex.exec(normalized)) !== null) {
    if (match[0].toLowerCase() === '&nbsp;') {
      out += normalized.slice(lastIndex, match.index) + ' ';
      lastIndex = regex.lastIndex;
      continue;
    }
    if (match[0].startsWith('&')) {
      // Other entities: leave as-is or decode; skip for simplicity
      lastIndex = regex.lastIndex;
      continue;
    }
    const closing = match[1] === '/';
    const tagName = match[2].toLowerCase();
    const attrs = match[3];

    if (!ALLOWED_TAGS.has(tagName)) {
      out += normalized.slice(lastIndex, match.index);
      lastIndex = regex.lastIndex;
      continue;
    }

    if (tagName === 'br') {
      out += normalized.slice(lastIndex, match.index);
      out += closing ? '' : '<br>';
      lastIndex = regex.lastIndex;
      continue;
    }

    if (closing) {
      out += normalized.slice(lastIndex, match.index);
      const expected = tagStack.pop();
      if (expected === tagName) {
        out += `</${tagName}>`;
      }
      lastIndex = regex.lastIndex;
      continue;
    }

    if (tagName === 'a') {
      const hrefMatch = /href\s*=\s*["']([^"']*)["']/i.exec(attrs);
      const href = hrefMatch ? sanitizeHref(hrefMatch[1]) : null;
      if (href) {
        out += normalized.slice(lastIndex, match.index) + `<a href="${href.replace(/"/g, '&quot;')}">`;
        tagStack.push('a');
      }
      lastIndex = regex.lastIndex;
      continue;
    } else {
      out += normalized.slice(lastIndex, match.index) + match[0];
      tagStack.push(tagName);
    }
    lastIndex = regex.lastIndex;
  }
  out += normalized.slice(lastIndex);
  return out;
}

// --- Plain text (strip HTML) for alt/title -----------------------------------

function plainText(html: string): string {
  return sanitizeHtml(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// --- Inline HTML → PM content (manual parse) ---------------------------------

const MARK_TAG_MAP: Record<string, string> = {
  b: 'bold',
  strong: 'bold',
  i: 'italic',
  em: 'italic',
  u: 'underline',
  mark: 'highlight',
  code: 'code',
};

function parseTagOpen(tagName: string, attrs: string): PMMark | null {
  const lower = tagName.toLowerCase();
  if (lower === 'a') {
    const hrefMatch = /href\s*=\s*["']([^"']*)["']/i.exec(attrs);
    const href = hrefMatch ? sanitizeHref(hrefMatch[1]) : null;
    if (href) return { type: 'link', attrs: { href } };
    return null;
  }
  const name = MARK_TAG_MAP[lower];
  return name ? { type: name } : null;
}

function inlineFromHtml(html: string): PMNode[] {
  const sanitized = sanitizeHtml(html);
  if (!sanitized.trim()) return [];

  const nodes: PMNode[] = [];
  const markStack: PMMark[] = [];
  const tagRegex = /<(\/?)(\w+)([^>]*)>|<br\s*\/?>|([^<]+)/gi;
  let textBuffer = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  function flushText() {
    const t = textBuffer.replace(/\s+/g, ' ').trim();
    if (t) {
      nodes.push({
        type: 'text',
        text: t,
        ...(markStack.length > 0 && { marks: [...markStack] }),
      });
    }
    textBuffer = '';
  }

  while ((match = tagRegex.exec(sanitized)) !== null) {
    if (match[4] !== undefined) {
      textBuffer += match[4];
      lastIndex = tagRegex.lastIndex;
      continue;
    }
    if (match[0].toLowerCase().startsWith('<br')) {
      flushText();
      nodes.push({ type: 'hardBreak' });
      lastIndex = tagRegex.lastIndex;
      continue;
    }
    const closing = match[1] === '/';
    const tagName = match[2].toLowerCase();
    const attrs = match[3];

    if (closing) {
      const markType = MARK_TAG_MAP[tagName] ?? (tagName === 'a' ? 'link' : null);
      if (markType) {
        flushText();
        const idx = markStack.map((m) => m.type).lastIndexOf(markType);
        if (idx !== -1) markStack.splice(idx, 1);
      }
      lastIndex = tagRegex.lastIndex;
      continue;
    }

    if (tagName === 'a') {
      const m = parseTagOpen('a', attrs);
      if (m) {
        flushText();
        markStack.push(m);
      }
    } else {
      const m = parseTagOpen(tagName, attrs);
      if (m) {
        flushText();
        markStack.push(m);
      }
    }
    lastIndex = tagRegex.lastIndex;
  }
  flushText();

  return nodes;
}

// --- Block conversion --------------------------------------------------------

function quoteTextToParagraphs(html: string): PMNode[] {
  const chunks = html.split(/(?:<br\s*\/?>){2,}/gi).map((s) => s.trim()).filter(Boolean);
  if (chunks.length === 0) return [{ type: 'paragraph' }];
  return chunks.map((chunk) => ({
    type: 'paragraph',
    content: inlineFromHtml(chunk),
  })) as PMNode[];
}

function convertBlock(block: EditorJsBlock): PMNode[] {
  const { type, data } = block;

  switch (type) {
    case 'paragraph': {
      const text = typeof data.text === 'string' ? data.text : '';
      const content = inlineFromHtml(text);
      return [{ type: 'paragraph', ...(content.length > 0 && { content }) }];
    }
    case 'header': {
      const text = typeof data.text === 'string' ? data.text : '';
      const level = Math.min(3, Math.max(1, Number(data.level) || 1));
      return [{ type: 'heading', attrs: { level }, content: inlineFromHtml(text) }];
    }
    case 'list': {
      const items = Array.isArray(data.items) ? (data.items as string[]) : [];
      const ordered = data.style === 'ordered';
      const listType = ordered ? 'orderedList' : 'bulletList';
      const listItems: PMNode[] = items.map((item) => ({
        type: 'listItem',
        content: [{ type: 'paragraph', content: inlineFromHtml(item) }],
      })) as PMNode[];
      return [{ type: listType, content: listItems }];
    }
    case 'quote': {
      const text = typeof data.text === 'string' ? data.text : '';
      const caption = typeof data.caption === 'string' ? data.caption : '';
      const paragraphs: PMNode[] = quoteTextToParagraphs(text);
      if (caption.trim()) {
        paragraphs.push({
          type: 'paragraph',
          content: [{ type: 'text', text: `— ${plainText(caption)}`, marks: [{ type: 'italic' }] }],
        } as PMNode);
      }
      return [{ type: 'blockquote', content: paragraphs }];
    }
    case 'checklist': {
      const items = Array.isArray(data.items) ? (data.items as Array<{ text: string; checked: boolean }>) : [];
      const taskItems: PMNode[] = items.map((item) => ({
        type: 'taskItem',
        attrs: { checked: Boolean(item.checked) },
        content: [{ type: 'paragraph', content: inlineFromHtml(typeof item.text === 'string' ? item.text : '') }],
      })) as PMNode[];
      return [{ type: 'taskList', content: taskItems }];
    }
    case 'delimiter':
      return [{ type: 'horizontalRule' }];
    case 'code': {
      const code = typeof data.code === 'string' ? data.code : '';
      return [{ type: 'codeBlock', content: [{ type: 'text', text: code }] }];
    }
    case 'table': {
      const rows = Array.isArray(data.content) ? (data.content as string[][]) : [];
      const tableRows: PMNode[] = rows.map((row) => {
        const cells: PMNode[] = (Array.isArray(row) ? row : []).map((cell) => ({
          type: 'tableCell',
          content: [{ type: 'paragraph', content: inlineFromHtml(typeof cell === 'string' ? cell : '') }],
        })) as PMNode[];
        return { type: 'tableRow', content: cells };
      }) as PMNode[];
      return [{ type: 'table', content: tableRows }];
    }
    case 'image':
    case 'simpleImage': {
      const d = data as { url?: string; file?: { url?: string }; caption?: string };
      const src = typeof d.url === 'string' ? d.url : (d.file?.url ?? '');
      const caption = typeof d.caption === 'string' ? d.caption : '';
      const alt = plainText(caption);
      const figureContent: PMNode[] = [{ type: 'image', attrs: { src, alt } } as PMNode];
      if (caption.trim()) {
        figureContent.push({ type: 'figcaption', content: inlineFromHtml(caption) } as PMNode);
      }
      return [{ type: 'figure', content: figureContent }];
    }
    case 'warning': {
      const title = typeof data.title === 'string' ? plainText(data.title) : '';
      const message = typeof data.message === 'string' ? data.message : '';
      const paragraphs = quoteTextToParagraphs(message);
      return [
        {
          type: 'callout',
          attrs: { type: 'warning', title },
          content: paragraphs,
        },
      ] as PMNode[];
    }
    default:
      return [
        {
          type: 'codeBlock',
          content: [{ type: 'text', text: JSON.stringify(block) }],
        },
      ];
  }
}

// --- Main entry --------------------------------------------------------------

/**
 * Converts an EditorJS document to a ProseMirror doc JSON.
 * Compatible with ProseMirrorRenderer and Tiptap.
 */
export function convertEditorJsToPm(editorJsData: EditorJsDoc): PMDoc {
  const blocks = Array.isArray(editorJsData?.blocks) ? editorJsData.blocks : [];
  const content: PMNode[] = [];
  for (const block of blocks) {
    content.push(...convertBlock(block));
  }
  if (content.length === 0) {
    content.push({ type: 'paragraph' });
  }
  return { type: 'doc', content };
}

export { inlineFromHtml, convertBlock };
export type { PMDoc, PMNode, PMMark };
