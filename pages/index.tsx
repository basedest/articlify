import mongoose from 'mongoose'
import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ArticleList from '../components/ArticleList'
import { ArticleModel } from '../lib/ArticleTypes'

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
          <ArticleList articles={articles} />
      </>
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