/**
 * Phase 0 data migration: set content_format and content_schema_version on existing articles.
 * All documents with legacy EditorJS content get content_format = 'editorjs', content_schema_version = 1.
 * Does not overwrite documents that already have content_format = 'pm'.
 */

import { ArticleModel } from '~/lib/ArticleTypes';

export async function migrateContentFormat(): Promise<{ matched: number; modified: number }> {
  const result = await ArticleModel.updateMany(
    {
      $or: [
        { content_format: { $exists: false } },
        { content_format: null },
        { content_format: '' },
      ],
    },
    {
      $set: {
        content_format: 'editorjs',
        content_schema_version: 1,
      },
    }
  );

  return { matched: result.matchedCount, modified: result.modifiedCount };
}
