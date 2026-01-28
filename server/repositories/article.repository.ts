import { ArticleModel, type Article } from '@/lib/ArticleTypes';
import { connectDB } from '@/lib/server/connection';
import { Types } from 'mongoose';

export interface ArticleQuery {
  category?: string;
  tags?: string[];
  title?: string;
  author?: string;
  page?: number;
  pagesize?: number;
}

export class ArticleRepository {
  async findAll(query: ArticleQuery = {}) {
    await connectDB();

    const { category, tags, title, author, page = 1, pagesize = 10 } = query;

    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (tags && tags.length > 0) {
      filter.tags = { $all: tags };
    }

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (author) {
      filter.author = author;
    }

    const skip = (page - 1) * pagesize;

    const [articles, total] = await Promise.all([
      ArticleModel.find(filter)
        .select('-content')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pagesize)
        .lean(),
      ArticleModel.countDocuments(filter),
    ]);

    return {
      articles: JSON.parse(JSON.stringify(articles)) as Article[],
      total,
      page,
      pagesize,
      totalPages: Math.ceil(total / pagesize),
    };
  }

  async findBySlug(slug: string) {
    await connectDB();
    const article = await ArticleModel.findOne({ slug }).lean();
    return article ? (JSON.parse(JSON.stringify(article)) as Article) : null;
  }

  async findById(id: string) {
    await connectDB();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const article = await ArticleModel.findById(id).lean();
    return article ? (JSON.parse(JSON.stringify(article)) as Article) : null;
  }

  async create(article: Omit<Article, '_id'>) {
    await connectDB();
    const newArticle = await ArticleModel.create(article);
    return JSON.parse(JSON.stringify(newArticle)) as Article;
  }

  async updateBySlug(slug: string, update: Partial<Article>) {
    await connectDB();
    const article = await ArticleModel.findOneAndUpdate(
      { slug },
      { ...update, editedAt: new Date() },
      { new: true }
    ).lean();
    return article ? (JSON.parse(JSON.stringify(article)) as Article) : null;
  }

  async deleteBySlug(slug: string) {
    await connectDB();
    const result = await ArticleModel.deleteOne({ slug });
    return result.deletedCount > 0;
  }

  async getAllSlugs() {
    await connectDB();
    const articles = await ArticleModel.find({}).select('slug category').lean();
    return JSON.parse(JSON.stringify(articles)) as Array<{
      slug: string;
      category: string;
    }>;
  }
}

export const articleRepository = new ArticleRepository();
