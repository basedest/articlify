import { GetServerSideProps } from 'next'
import SmartList from '../../../components/SmartList'
import ArticleService from '../../../lib/server/article/service'

const Articles = ({articles, author, searchQuery, page}) => {
  if (!articles || articles.length == 0)
    return <h1 className='title accented no-margin'>No articles</h1>
  return (
  <>
    <h1 className='title accented'>List of {author}&apos;s articles</h1>
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
    const {author} = context.params
    const {title} = context.query
    const page = context.query.page ? parseInt(context.query.page as string) : 1
    const searchQuery = title ? title as string : ''
    const articles = await ArticleService.get({author, searchQuery}, page)
    return {
        props: {
            articles, author, searchQuery, page
        }
    }
}