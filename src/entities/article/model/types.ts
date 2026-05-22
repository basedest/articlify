import { Schema, model, models, Types } from 'mongoose';

/** Legacy content field (kept for DB rollback; all articles now use contentPm). */
export type LegacyContent = {
    time?: number;
    blocks?: Array<{ id?: string; type: string; data: Record<string, unknown> }>;
};

export interface Article {
    slug: string;
    title: string;
    description: string;
    category: string;
    /** Display name of the author (used in URLs and UI). */
    author: string;
    /** Stable user id used for ownership/auth checks. Optional for legacy docs created before this field existed. */
    authorId?: string;
    createdAt: Date;
    editedAt?: Date;
    img?: string;
    tags?: Array<string>;
    /** ProseMirror (Tiptap) doc JSON */
    contentPm?: Record<string, unknown> | null;
    /** Which field to use for rendering/saving. */
    contentFormat?: 'editorjs' | 'pm';
    /** Schema version for PM docs (start at 1). */
    contentSchemaVersion?: number;
    _id?: Types.ObjectId;
}

const ArticleSchema = new Schema<Article>({
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    author: { type: String, required: true, index: true },
    authorId: { type: String, required: false, index: true },
    createdAt: { type: Date, required: true, index: true },
    img: String,
    tags: { type: [String], index: true },
    contentPm: { type: Schema.Types.Mixed, required: false },
    contentFormat: { type: String, enum: ['editorjs', 'pm'], required: false },
    contentSchemaVersion: { type: Number, required: false },
    editedAt: Date,
});

export const ArticleModel = models.Article || model<Article>('Article', ArticleSchema);
