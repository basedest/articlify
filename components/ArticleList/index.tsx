import { Article } from "../../lib/ArticleTypes"
import ArticleItem from "../ArticleItem"


export interface ListProps {
    articles: Article[]
}

const ArticleList = ({articles}: ListProps) => {
  return (
    <div style={{
        display: 'flex',
        placeItems: 'center',
        flexDirection: 'column',
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
        gap: '5em',
    }}>
        {
            articles.map(article => <ArticleItem key={article.slug} {...article}/>)
        }
    </div>
  )
}

export default ArticleList