import { GetServerSideProps } from 'next'
import SmartList from '../../components/SmartList'
import findArticles from '../../lib/server/findArticles'

const Articles = ({articles, page, searchQuery}) => {
  if (!articles || articles.length == 0)
    return <h1 className='title accented no-margin'>No articles</h1>
  return (
  <>
    <h1 className='title accented'>List of queried articles</h1>
    <SmartList 
      articles={articles}
      page={page}
      searchQuery={searchQuery}
    />
  </>
  )
}

export default Articles

export const getServerSideProps: GetServerSideProps = async (context) => {
    
  const page = context.query.page ? parseInt(context.query.page as string) : 1
  const {title} = context.query
  const searchQuery = title ? title as string : ''

    const articles = await findArticles({...context.query, page}) 
    return {
        props: {
            articles, page, searchQuery
        }
    }
}