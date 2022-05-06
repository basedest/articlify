import { OutputBlockData } from '@editorjs/editorjs';
import { Schema, model, models } from 'mongoose';

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
    img: String,
    tags: [String]
})

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