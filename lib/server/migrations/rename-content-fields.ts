/**
 * Rename article content fields from snake_case to camelCase for consistency.
 * content_pm -> contentPm, content_format -> contentFormat, content_schema_version -> contentSchemaVersion.
 * Idempotent: only renames fields that exist (MongoDB $rename is a no-op for missing fields).
 */

import { ArticleModel } from '~/lib/ArticleTypes';

export async function migrateRenameContentFields(): Promise<{ modified: number }> {
  const result = await ArticleModel.updateMany(
    {},
    {
      $rename: {
        content_pm: 'contentPm',
        content_format: 'contentFormat',
        content_schema_version: 'contentSchemaVersion',
      },
    }
  );
  return { modified: result.modifiedCount };
}
