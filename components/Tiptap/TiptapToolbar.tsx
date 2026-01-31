'use client';

import React from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '~/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Minus,
  Image as ImageIcon,
  Table,
  CheckSquare,
  AlertTriangle,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  type LucideIcon,
} from 'lucide-react';

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  icon: Icon,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
      disabled={disabled}
      title={title}
      data-active={active}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export function TiptapToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url !== null) {
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    }
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/30 px-2 py-1">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
        icon={Bold}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
        icon={Italic}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline"
        icon={UnderlineIcon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive('highlight')}
        title="Highlight"
        icon={Highlighter}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        title="Inline code"
        icon={Code}
      />
      <ToolbarButton
        onClick={setLink}
        active={editor.isActive('link')}
        title="Link"
        icon={LinkIcon}
      />
      <span className="mx-1 h-5 w-px bg-border" aria-hidden />
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive('paragraph')}
        title="Paragraph"
        icon={Pilcrow}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
        icon={Heading1}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
        icon={Heading2}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
        icon={Heading3}
      />
      <span className="mx-1 h-5 w-px bg-border" aria-hidden />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet list"
        icon={List}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Ordered list"
        icon={ListOrdered}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive('taskList')}
        title="Task list"
        icon={CheckSquare}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Quote"
        icon={Quote}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal rule"
        icon={Minus}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="Code block"
        icon={Code}
      />
      <ToolbarButton onClick={addImage} title="Image" icon={ImageIcon} />
      <ToolbarButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="Table"
        icon={Table}
      />
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().insertContent({ type: 'callout', attrs: { type: 'warning', title: 'Warning' }, content: [{ type: 'paragraph', content: [] }] }).run()
        }
        title="Callout (warning)"
        icon={AlertTriangle}
      />
    </div>
  );
}
