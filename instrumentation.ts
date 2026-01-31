/**
 * Runs once when the Node.js server starts.
 * Runs Phase 0 content-format migration: set content_format = 'editorjs', content_schema_version = 1 on existing articles.
 * Runs Phase 3 backfill: convert legacy EditorJS content to ProseMirror and write content_pm.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || !process.env.MONGODB_URI) {
    return;
  }

  try {
    const { connectDB } = await import('~/lib/server/connection');
    await connectDB();

    const { migrateContentFormat } = await import(
      '~/lib/server/migrations/content-format'
    );
    const result = await migrateContentFormat();

    if (result.modified > 0) {
      console.log(
        `[migration] content-format: updated ${result.modified} article(s) (content_format=editorjs, content_schema_version=1)`
      );
    }

    const { runBackfillContentPm } = await import(
      '~/lib/server/migrations/backfill-content-pm'
    );
    const backfillResult = await runBackfillContentPm();

    if (backfillResult.processed > 0) {
      console.log(
        `[migration] backfill-content-pm: processed ${backfillResult.processed}, updated ${backfillResult.updated}, failed ${backfillResult.failed}`
      );
      if (backfillResult.errors.length > 0) {
        for (const e of backfillResult.errors) {
          console.error(`[migration] backfill-content-pm error ${e.slugOrId}: ${e.error}`);
        }
      }
    }
  } catch (err) {
    console.error('[migration] startup migration failed:', err);
  }
}
