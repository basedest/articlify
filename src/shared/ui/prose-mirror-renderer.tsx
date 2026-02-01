'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PMDoc, PMNode, PMMark } from '~/shared/types/prose-mirror';

const ALLOWED_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

function sanitizeHref(href: unknown): string {
    if (typeof href !== 'string') return '#';
    try {
        const u = new URL(href, 'https://example.com');
        return ALLOWED_LINK_PROTOCOLS.includes(u.protocol) ? href : '#';
    } catch {
        return '#';
    }
}

function renderInlineNodes(nodes: PMNode[] | undefined): React.ReactNode[] {
    if (!nodes?.length) return [];
    return nodes.map((node, i) => {
        if (node.type === 'text') {
            let content: React.ReactNode = node.text ?? '';
            const marks = node.marks ?? [];
            for (const mark of marks) {
                content = wrapWithMark(content, mark);
            }
            return <React.Fragment key={i}>{content}</React.Fragment>;
        }
        if (node.type === 'hardBreak') {
            return <br key={i} />;
        }
        return null;
    });
}

function wrapWithMark(content: React.ReactNode, mark: PMMark): React.ReactNode {
    switch (mark.type) {
        case 'bold':
            return <strong>{content}</strong>;
        case 'italic':
            return <em>{content}</em>;
        case 'underline':
            return <u>{content}</u>;
        case 'highlight':
            return <mark>{content}</mark>;
        case 'code':
            return <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">{content}</code>;
        case 'link': {
            const href = sanitizeHref(mark.attrs?.href);
            return (
                <Link href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    {content}
                </Link>
            );
        }
        default:
            return content;
    }
}

function renderBlock(node: PMNode, key: number): React.ReactNode {
    const content = node.content ?? [];
    switch (node.type) {
        case 'paragraph':
            return (
                <p key={key} className="mb-4 leading-relaxed">
                    {renderInlineNodes(content)}
                </p>
            );
        case 'heading': {
            const level = Math.min(3, Math.max(1, (node.attrs?.level as number) ?? 1));
            const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
            const classes =
                level === 1
                    ? 'mb-6 mt-12 text-3xl font-bold'
                    : level === 2
                      ? 'mb-4 mt-8 text-2xl font-semibold'
                      : 'mb-4 mt-6 text-xl font-semibold';
            return (
                <Tag key={key} className={classes}>
                    {renderInlineNodes(content)}
                </Tag>
            );
        }
        case 'blockquote':
            return (
                <blockquote key={key} className="border-primary mb-6 border-l-4 pl-4 italic">
                    {content.map((child, i) => renderBlock(child, i))}
                </blockquote>
            );
        case 'bulletList':
            return (
                <ul key={key} className="mb-4 list-disc pl-6">
                    {content.map((child, i) => renderBlock(child, i))}
                </ul>
            );
        case 'orderedList':
            return (
                <ol key={key} className="mb-4 list-decimal pl-6">
                    {content.map((child, i) => renderBlock(child, i))}
                </ol>
            );
        case 'listItem':
            return (
                <li key={key} className="mb-2">
                    {content.map((child, i) => renderBlock(child, i))}
                </li>
            );
        case 'taskList':
            return (
                <ul key={key} className="mb-4 list-none space-y-2">
                    {content.map((child, i) => renderBlock(child, i))}
                </ul>
            );
        case 'taskItem': {
            const checked = node.attrs?.checked === true;
            return (
                <li key={key} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0" aria-hidden>
                        {checked ? '☑' : '☐'}
                    </span>
                    <div className={`flex-1 ${checked ? 'text-muted-foreground line-through' : ''}`}>
                        {content.map((child, i) => renderBlock(child, i))}
                    </div>
                </li>
            );
        }
        case 'codeBlock':
            return (
                <pre key={key} className="bg-muted my-6 overflow-x-auto rounded-lg p-4">
                    <code>{content.map((n) => (n.type === 'text' ? n.text : '')).join('')}</code>
                </pre>
            );
        case 'horizontalRule':
            return <hr key={key} className="border-border my-8" />;
        case 'image': {
            const src = (node.attrs?.src as string) ?? '';
            const alt = (node.attrs?.alt as string) ?? '';
            return (
                <span key={key} className="my-4 block">
                    <Image
                        src={src}
                        alt={alt}
                        width={800}
                        height={450}
                        className="max-w-full rounded-lg"
                        unoptimized={src.startsWith('data:')}
                    />
                </span>
            );
        }
        case 'figure':
            return (
                <figure key={key} className="my-6">
                    {content.map((child, i) => renderBlock(child, i))}
                </figure>
            );
        case 'figcaption':
            return (
                <figcaption key={key} className="text-muted-foreground mt-2 text-center text-sm">
                    {renderInlineNodes(content)}
                </figcaption>
            );
        case 'table':
            return (
                <div key={key} className="my-6 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <tbody>{content.map((child, i) => renderBlock(child, i))}</tbody>
                    </table>
                </div>
            );
        case 'tableRow':
            return (
                <tr key={key} className="border-b">
                    {content.map((child, i) => renderBlock(child, i))}
                </tr>
            );
        case 'tableHeader':
            return (
                <th key={key} className="border px-2 py-2 text-left font-semibold">
                    {content.map((child, i) => renderBlock(child, i))}
                </th>
            );
        case 'tableCell':
            return (
                <td key={key} className="border px-2 py-2">
                    {content.map((child, i) => renderBlock(child, i))}
                </td>
            );
        case 'callout': {
            const type = (node.attrs?.type as string) ?? 'warning';
            const title = (node.attrs?.title as string) ?? '';
            const typeClass =
                type === 'warning'
                    ? 'callout-view-warning'
                    : type === 'info'
                      ? 'callout-view-info'
                      : 'callout-view-note';
            return (
                <div key={key} className={`callout-view ${typeClass}`}>
                    {title && <div className="font-semibold">{title}</div>}
                    <div className="mt-1 text-sm">{content.map((child, i) => renderBlock(child, i))}</div>
                </div>
            );
        }
        default:
            return (
                <div key={key} className="my-4">
                    {content.map((child, i) => renderBlock(child, i))}
                </div>
            );
    }
}

export interface ProseMirrorRendererProps {
    /** ProseMirror doc JSON (from editor.getJSON()). */
    doc: PMDoc | null | undefined;
    /** Optional class for the wrapper. */
    className?: string;
}

export function ProseMirrorRenderer({ doc, className = '' }: ProseMirrorRendererProps) {
    if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) {
        return null;
    }

    return (
        <div className={`prose prose-zinc dark:prose-invert max-w-none ${className}`}>
            {doc.content.map((node, i) => renderBlock(node, i))}
        </div>
    );
}
