/**
 * Phase 3 backfill migration: convert legacy EditorJS content to ProseMirror and write content_pm.
 * Queries articles where content_pm is null/missing and content.blocks exists; converts each, validates, updates.
 */

import { ArticleModel } from '../../ArticleTypes.ts';
import { convertEditorJsToPm, type EditorJsDoc } from '../../convertEditorJsToPm.ts';
import { isPMDoc } from '../../ProseMirrorTypes.ts';

export interface BackfillError {
  slugOrId: string;
  error: string;
  blockType?: string;
}

export interface BackfillResult {
  processed: number;
  updated: number;
  failed: number;
  errors: BackfillError[];
}

/**
 * Find articles with EditorJS content but no content_pm; convert each to PM, validate, and update.
 * Caller must ensure DB is connected (e.g. connectDB()) before calling.
 */
export async function runBackfillContentPm(): Promise<BackfillResult> {
  const out: BackfillResult = {
    processed: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  const docs = await ArticleModel.find({
    $or: [{ content_pm: null }, { content_pm: { $exists: false } }],
    content: { $exists: true },
    'content.blocks': { $exists: true, $ne: [] },
  })
    .lean()
    .exec();

  out.processed = docs.length;

  for (const doc of docs) {
    const slugOrId = doc.slug ?? doc._id?.toString() ?? '?';
    try {
      const content = doc.content as EditorJsDoc | undefined;
      if (!content || !Array.isArray(content.blocks)) {
        throw new Error('Missing or invalid content.blocks');
      }
      const pmDoc = convertEditorJsToPm(content);
      if (!isPMDoc(pmDoc)) {
        throw new Error('Converter did not return a valid PM doc (type !== "doc")');
      }
      if (!Array.isArray(pmDoc.content)) {
        throw new Error('PM doc content is not an array');
      }
      await ArticleModel.updateOne(
        { _id: doc._id },
        {
          $set: {
            content_pm: pmDoc as unknown as Record<string, unknown>,
            content_format: 'pm',
            content_schema_version: 1,
            editedAt: new Date(),
          },
        }
      );
      out.updated++;
    } catch (err) {
      out.failed++;
      out.errors.push({
        slugOrId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return out;
}
