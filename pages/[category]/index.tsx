import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import ArticleList from '../../components/ArticleList'
import { ArticleModel } from '../../lib/ArticleTypes'
import { connectDB } from '../../lib/connection'
import { categories } from '../../lib/lib'

const Category = ({articles, category}) => {
  return (
  <>
    <h1 className='accented'>{category}</h1>
    <ArticleList articles={articles} />
  </>
  )
}

export default Category

interface IParams extends ParsedUrlQuery {
  category: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category } = context.params as IParams
  // if (!categories.includes(category)) {
  //   return {
  //     notFound: true
  //   }
  // }
  await connectDB()
  let articles = await ArticleModel.find({category}).exec()
  articles = JSON.parse(JSON.stringify(articles))
  return {
      props: {
          articles, category
      }
  }
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//       paths: [
//         {params: {category: 'art'}},
//         {params: {category: 'it'}},
//         {params: {category: 'games'}},
//         {params: {category: 'music'}},
//         {params: {category: 'science'}},
//         {params: {category: 'sports'}},
//         {params: {category: 'travel'}},
//         {params: {category: 'movies'}},
//       ],
//       fallback: false
//   }
// }