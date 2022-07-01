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
          <div 
            style={{boxShadow: "inset 0 8px 8px -8px rgb(0 0 0 / 30%), inset 0 -8px 8px -8px rgb(0 0 0 / 30%)"}}
            className="banner text-white bg-green-500 p-10 mb-8 w-screen"
          >
            <div className="mx-auto px-4 text-center">
              <h1
                style={{textShadow: "0px 1px 3px rgb(0 0 0 / 30%)"}}
                className="title font-['Gotham_Bold'] text-7xl tracking-tight drop-shadow-xl"
              >
                Articlify
              </h1>
              <h2 className="mt-2 font-light text-2xl tracking-wide">A place <em>with</em> articles and <em>without</em> cancel-culture.</h2>
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