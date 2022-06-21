import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { Article } from '../lib/ArticleTypes'
import SmartList from '../components/SmartList'
import ArticleService from '../lib/server/article/service'

//пропсы страницы
interface IProps {
  articles: Article[]
  page: number
  searchQuery: string
}

const Home: NextPage<IProps> = (props: IProps) => {
 
  return (
      <>
        <Head>
          <title>Articlify</title>
          <meta name="description" content="Course Project" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <div className="banner">
            <div className="container">
              <h1 className="title">
                Articlify
              </h1>
              <h2>A place with articles and without cancel-culture.</h2>
            </div>
          </div>
          <SmartList 
            articles={props.articles}
            searchQuery={props.searchQuery}
            page={props.page}
          />
      </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<IProps> = async (context) => { 
  // собираем параметры запроса 
  const page = context.query.page ? parseInt(context.query.page as string) : 1
  const {title} = context.query
  const searchQuery = title ? title as string : ''
  //ищем статьи в БД по запросу и странице
  const articles = await ArticleService.get({title}, page)
  
  return {
    props: { articles, page, searchQuery },
  }
}