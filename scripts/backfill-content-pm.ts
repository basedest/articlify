/**
 * Phase 3 backfill CLI: convert legacy EditorJS content to ProseMirror and write content_pm.
 * Requires MONGODB_URI in env (e.g. run with --env-file=.env).
 *
 * Usage: yarn backfill
 * Or: node --experimental-strip-types --env-file=.env scripts/backfill-content-pm.ts
 *
 * If Node fails on module resolution (e.g. @editorjs/editorjs), install tsx and run:
 *   npx tsx --env-file=.env scripts/backfill-content-pm.ts
 */

import { connectDB } from '../lib/server/connection.ts';
import { runBackfillContentPm } from '../lib/server/migrations/backfill-content-pm.ts';

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is required. Set it in .env or pass --env-file=.env');
    process.exit(1);
  }

  await connectDB();
  const result = await runBackfillContentPm();

  console.log('Backfill summary:');
  console.log(`  processed: ${result.processed}`);
  console.log(`  updated:   ${result.updated}`);
  console.log(`  failed:    ${result.failed}`);

  if (result.errors.length > 0) {
    console.log('\nErrors:');
    for (const e of result.errors) {
      console.log(`  ${e.slugOrId}: ${e.error}`);
    }
  }

  if (result.failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
