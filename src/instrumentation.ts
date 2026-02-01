/**
 * Runs once when the Node.js server starts.
 * Runs rename migration: content_pm -> contentPm, content_format -> contentFormat, content_schema_version -> contentSchemaVersion.
 */

export async function register() {
    if (!process.env.MONGODB_URI) {
        console.log('[migration] Skipping: MONGODB_URI not set');
        return;
    }

    try {
        const { connectDB } = await import('~/lib/server/connection');
        await connectDB();

        const { migrateRenameContentFields } = await import('~/lib/server/migrations/rename-content-fields');
        const result = await migrateRenameContentFields();

        if (result.modified > 0) {
            console.log(
                `[migration] rename-content-fields: updated ${result.modified} article(s) (content_pm -> contentPm, etc.)`,
            );
        } else {
            console.log('[migration] rename-content-fields: no documents to update (already migrated or empty)');
        }
    } catch (err) {
        console.error('[migration] rename-content-fields failed:', err);
    }
}
