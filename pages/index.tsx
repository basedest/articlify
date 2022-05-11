import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import ArticleList from '../components/ArticleList'
import { Article } from '../lib/ArticleTypes'
import MyInput from '../components/input/MyInput'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import findArticles from '../lib/db/findArticles'

//пропсы страницы
interface IProps {
  articles: Article[]
  page: number
  searchQuery: string
}

const Home: NextPage<IProps> = (props: IProps) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [caption, setCaption] = useState('Latest articles')
  
  //устанавливаем запрос для поиска при вводе
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  //устанавливаем строку поиска как параметр запроса
  const handleSearch = async (e) => {
    router.push(`/?title=${searchQuery}`)
  }

  //очищаем ввод
  const clearInput = (e) => {
    setSearchQuery('')
    router.push('/')
    setCaption('Latest articles')
  }

  //устанавливаем надпись в зависимости от состояния списка
  useEffect(() => {
    if (props.articles.length === 0) {
      setCaption('No articles')
    }
    else if (props.searchQuery) {
      setCaption(`Search result [${props.page}]`)
    }
    else {
      setCaption(`Latest articles [${props.page}]`)
    }
  }, [props.articles, props.searchQuery, props.page])

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
          <div className="searchbar">
            <MyInput
                  value={searchQuery}
                  onChange={handleChange}
                  placeholder="Search by title..."
              />
            <button className='search' onClick={handleSearch}>Search</button>
            <button className='clear' onClick={clearInput}>Clear</button>
          </div>
          <h2 className='accented'>{caption}</h2>
          <ArticleList articles={props.articles} />
          <div className='navigation'>
            <button
              onClick={() => router.push(`/?title=${searchQuery}&page=${props.page - 1}`)}
              disabled={props.page <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              onClick={() => router.push(`/?title=${searchQuery}&page=${props.page + 1}`)}
              disabled={props.articles.length < 5}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
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
  let articles = await findArticles({page, title})
  //фиксим сериализацию (ну вот приходится так)
  articles = JSON.parse(JSON.stringify(articles))  
  return {
    props: { articles, page, searchQuery },
  }
}