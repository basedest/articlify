/**
 * Runs once when the Node.js server starts.
 * Runs Phase 0 content-format migration: set content_format = 'editorjs', content_schema_version = 1 on existing articles.
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
  } catch (err) {
    console.error('[migration] content-format failed:', err);
  }
}
