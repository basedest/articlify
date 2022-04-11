import mongoose from 'mongoose'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import ArticleList, {ListProps} from '../components/ArticleList'
import { ArticleModel } from '../lib/ArticleTypes'

const Home: NextPage<any, any> = ({articles}: ListProps) => {
  return (
    <div className='container'>
      <Head>
        <title>Articlify</title>
        <meta name="description" content="Course Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='main'>
        <h1 className='title'>
          Articlify
        </h1>
        <h2>Место для ваших статей</h2>
        <hr />
        <ArticleList articles={articles} />
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  let articles = await ArticleModel.find().exec()
  articles = JSON.parse(JSON.stringify(articles))
  
  return {
    props: { articles },
  }
}