import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { Article } from '../lib/ArticleTypes'
import findArticles from '../lib/server/findArticles'
import renewArticles from '../lib/renewArticles'
import SmartList from '../components/SmartList'

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
          <h1 className='title'>
            Articlify
          </h1>
          <h2>The best digital media platform on the internet</h2>
          <hr />
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
  await renewArticles() 
  
  // собираем параметры запроса 
  const page = context.query.page ? parseInt(context.query.page as string) : 1
  const {title} = context.query
  const searchQuery = title ? title as string : ''
  //ищем статьи в БД по запросу и странице
  let articles = await findArticles({page, title})
  
  return {
    props: { articles, page, searchQuery },
  }
}