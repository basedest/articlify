import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import ArticleList from '../components/ArticleList'
import { Article, ArticleModel } from '../lib/ArticleTypes'
import { connectDB } from '../lib/connection'
import { version } from '../lib/lib'
import MyInput from '../components/input/MyInput'
import { useState } from 'react'

interface IProps {
  articles: Article[],
  version: string
}

const Home: NextPage<any, any> = (props: IProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState(props.articles)
  const [caption, setCaption] = useState('Latest articles')
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  const handleSearch = async (e) => {
    const response = await (await fetch(`api/articles/?title=${searchQuery}`)).json()
    response.length === 0
    ? setCaption('No match')
    : setCaption('Search result')
    setArticles(response)
  }
  const clearInput = (e) => {
    setSearchQuery('')
    setArticles(props.articles)
    setCaption('Latest articles')
  }
  return (
      <>
        <Head>
          <title>Articlify</title>
          <meta name="description" content="Course Project" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <h1 className='title'>
            Articlify {version}
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
          <ArticleList articles={articles} />
      </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<IProps> = async (context) => { 
  await connectDB()
  let articles = await ArticleModel.find().sort({createdAt:-1})
  articles = JSON.parse(JSON.stringify(articles))
  return {
    props: { articles, version },
  }
}