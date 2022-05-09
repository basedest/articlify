import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import ArticleList from '../components/ArticleList'
import { ArticleModel } from '../lib/ArticleTypes'
import { connectDB } from '../lib/connection'
import { getSession, signOut } from 'next-auth/react'
import { version } from '../lib/lib'

const Home: NextPage<any, any> = ({articles, version}) => {
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
          <h2 className='accented'>Latest articles</h2>
          <ArticleList articles={articles} />
      </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => { 
  const session = getSession(context)
  //sign out of broken (no user) sessions 
  if (session && !(await session)?.user) {
    console.log('BROKEN SESSION')
    signOut()
  }
  await connectDB()
  let articles = await ArticleModel.find().sort({createdAt:-1})
  articles = JSON.parse(JSON.stringify(articles))
  return {
    props: { articles, version },
  }
}