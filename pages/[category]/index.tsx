import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import findArticles from '../../lib/server/findArticles'
import { categories } from '../../lib/lib'
import SmartList from '../../components/SmartList'

const Category = ({articles, category, page, searchQuery}) => {
  return (
  <>
    <h1 className='title accented'>{category}</h1>
    <SmartList 
      articles={articles}
      page={page}
      searchQuery={searchQuery}
    />
  </>
  )
}

export default Category

interface IParams extends ParsedUrlQuery {
  category: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category } = context.params as IParams
  if (!categories.includes(category)) {
    return {
      notFound: true
    }
  }

  const page = context.query.page ? parseInt(context.query.page as string) : 1
  const {title} = context.query
  const searchQuery = title ? title as string : ''

  let articles = await findArticles({category, page, title})
  articles = JSON.parse(JSON.stringify(articles))
  return {
      props: {
          articles, page, searchQuery, category
      }
  }
}

