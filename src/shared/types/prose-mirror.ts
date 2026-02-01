/**
 * ProseMirror / Tiptap JSON document types for type-safe rendering.
 */

export interface PMDoc {
    type: 'doc';
    content?: PMNode[];
}

export interface PMNode {
    type: string;
    content?: PMNode[];
    attrs?: Record<string, unknown>;
    text?: string;
    marks?: PMMark[];
}

export interface PMMark {
    type: string;
    attrs?: Record<string, unknown>;
}

export function isPMDoc(node: unknown): node is PMDoc {
    return typeof node === 'object' && node !== null && (node as PMDoc).type === 'doc';
}

export function isPMNode(node: unknown): node is PMNode {
    return typeof node === 'object' && node !== null && 'type' in (node as PMNode);
}
