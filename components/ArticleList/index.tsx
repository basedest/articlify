import { Article } from "../../lib/ArticleTypes"
import ArticleItem from "../ArticleItem"

export interface ListProps {
    articles: Article[]
}

const ArticleList:React.FC<ListProps> = ({articles}) => {
  return (
    <div className="articleList">
        {
          articles.map(article => <ArticleItem key={article.slug} {...article}/>)
        }
    </div>
  )
}

export default ArticleList