import { GetServerSideProps } from 'next'
import ArticleList from '../../components/ArticleList'
import findArticles from '../../lib/db/findArticles'

const Articles = ({articles}) => {
  if (!articles || articles.length == 0)
    return <h1 className='title accented no-margin'>No articles</h1>
  return (
  <>
    <h1 className='title accented'>List of queried articles</h1>
    <ArticleList articles={articles} />
  </>
  )
}

export default Articles

export const getServerSideProps: GetServerSideProps = async (context) => {
    
    const articles = await findArticles(context.query) 
    return {
        props: {
            articles
        }
    }
}