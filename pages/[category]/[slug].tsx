import { GetServerSideProps } from 'next'
import mongoose from 'mongoose'
import { ArticleModel, Article } from '../../lib/ArticleTypes'

const Article = ({sample}) => {
  return (
    <div>{sample}</div>
  )
}

export default Article

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {slug} = context.params
  const article = await ArticleModel.findOne({slug}).exec()
  
  return {
    props: {
        sample: ''
    }
  }
}