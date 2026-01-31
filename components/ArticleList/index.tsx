import { Article } from '~/lib/ArticleTypes';
import ArticleItem from '../ArticleItem';

export interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  if (articles.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        No articles found
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleItem key={article.slug} {...article} />
      ))}
    </div>
  );
};

export default ArticleList;