import type { Article } from '~/entities/article/model/types';
import { ArticleItem } from '~/entities/article/ui/article-item';

export interface ArticleListProps {
    articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
    if (articles.length === 0) {
        return (
            <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center">No articles found</div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
                <ArticleItem key={article.slug} {...article} />
            ))}
        </div>
    );
}
