import { OutputBlockData } from '@editorjs/editorjs';
import { Schema, model, models } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface Article {
    slug: string
    title: string
    description: string
    category: string
    author: string
    createdAt: Date
    img?: string
    tags?: Array<string>
}

// 2. Create a Schema corresponding to the document interface.
const ArticleSchema = new Schema<Article>({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    tags: [String]
})

// 3. Create a Model.
export const ArticleModel = models.Article || model<Article>('Article', ArticleSchema)

//------------------------------------------------------------------------------------

export interface ArticlePage {
    slug: string
    data: OutputBlockData[]
}

const PageSchema = new Schema<ArticlePage>({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    data: Object,
})

export const PageModel = models.Page || model<ArticlePage>('Page', PageSchema)