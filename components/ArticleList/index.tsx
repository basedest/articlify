import { Article } from "../../lib/ArticleTypes"
import ArticleItem from "../ArticleItem"

export interface ListProps {
    articles: Article[]
}

const ArticleList:React.FC<ListProps> = ({articles}) => {
  return (
    <div style={{
        display: 'flex',
        placeItems: 'center',
        flexDirection: 'column',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        gap: '2rem',
    }}>
        {
            articles.map(article => <ArticleItem key={article.slug} {...article}/>)
        }
    </div>
  )
}

export default ArticleList