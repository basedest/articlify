import { Article } from "../../lib/ArticleTypes"
import ArticleItem from "../ArticleItem"
import cl from "./ArticleList.module.scss"

export interface ArticleListProps {
  articles: Article[]
}

const ArticleList:React.FC<ArticleListProps> = ({articles}) => {
  return (
    <div className={cl.articleList + " min-h-[50vh]"}>
        {
          articles.map(article => <ArticleItem key={article.slug} {...article}/>)
        }
    </div>
  )
}

export default ArticleList