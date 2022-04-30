import mongoose from 'mongoose'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import ArticleList from '../components/ArticleList'
import { ArticleModel } from '../lib/ArticleTypes'

const Home: NextPage<any, any> = ({articles, version}) => {
  return (
    <div className='container'>
      <Head>
        <title>Articlify</title>
        <meta name="description" content="Course Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='main'>
        <h1 className='title'>
          Articlify {version}
        </h1>
        <h2>Место для ваших статей</h2>
        <hr />
        <ArticleList articles={articles} />
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  await mongoose.connect(process.env.MONGODB_URI)
  let articles = await ArticleModel.find().exec()
  articles = JSON.parse(JSON.stringify(articles))
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
  const response = await fetch(`${baseUrl}/api/get-app-version`)
  const {version} = await response.json()
  return {
    props: { articles, version },
  }
}