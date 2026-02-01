'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent, type Content } from '@tiptap/react';
import { getTiptapExtensions } from './getExtensions';
import { TiptapToolbar } from './TiptapToolbar';

export type ProseMirrorJSON = Record<string, unknown>;

/** Ref type for Tiptap editor (has getJSON()). */
export type TiptapEditorRef = ReturnType<typeof useEditor>;

export interface TiptapEditorProps {
  /** Initial content (ProseMirror JSON). Use empty doc or undefined for blank. */
  content?: ProseMirrorJSON | null;
  /** Called when content changes (optional, for auto-save or local storage). */
  onUpdate?: (json: ProseMirrorJSON) => void;
  /** Placeholder when empty. */
  placeholder?: string;
  /** Editor instance ref for parent (e.g. to call getJSON() on save). */
  editorRef?: React.MutableRefObject<TiptapEditorRef | null>;
  /** Disable editing. */
  editable?: boolean;
  /** Optional class for the editor wrapper. */
  className?: string;
  /** Called when editor instance is ready. */
  onReady?: () => void;
}

const emptyDoc: ProseMirrorJSON = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export function TiptapEditor({
  content,
  onUpdate,
  placeholder = 'Start writing...',
  editorRef,
  editable = true,
  className = '',
  onReady,
}: TiptapEditorProps) {
  const initialContent: Content =
    content && typeof content === 'object' && content.type === 'doc'
      ? (content as Content)
      : emptyDoc;

  const editor = useEditor({
    extensions: getTiptapExtensions(),
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class:
          'tiptap ProseMirror min-h-[200px] max-w-none px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON());
    },
  });

  // Expose editor to parent (call editorRef.current?.getJSON() on save)
  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor;
    }
    if (editor) {
      onReady?.();
    }
    return () => {
      if (editorRef) editorRef.current = null;
    };
  }, [editor, editorRef, onReady]);

  // Sync content when prop changes (e.g. loading existing article) (e.g. loading existing article)
  useEffect(() => {
    if (!editor || content === undefined) return;
    const current = editor.getJSON();
    if (
      content &&
      typeof content === 'object' &&
      content.type === 'doc' &&
      JSON.stringify(current) !== JSON.stringify(content)
    ) {
      editor.commands.setContent(content as Content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className={`rounded-lg border border-input bg-background ${className}`}>
        <div className="animate-pulse h-[200px] flex items-center justify-center text-muted-foreground">
          Loading editor…
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-input bg-background overflow-hidden ${className}`}
    >
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
