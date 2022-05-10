import { Article } from "../../lib/ArticleTypes"
import ArticleItem from "../ArticleItem"

export interface ArticleListProps {
  articles: Article[]
}

const ArticleList:React.FC<ArticleListProps> = ({articles}) => {
  return (
    <div className="articleList">
        {
          articles.map(article => <ArticleItem key={article.slug} {...article}/>)
        }
    </div>
  )
}

export default ArticleList