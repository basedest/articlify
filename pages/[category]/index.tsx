import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

const Category = ({category}) => {
  return (
    <div>{category}</div>
  )
}

export default Category

interface IParams extends ParsedUrlQuery {
  category: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { category } = context.params as IParams
  return {
      props: {
          category
      }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
      paths: [
        {params: {category: 'art'}},
        {params: {category: 'it'}},
        {params: {category: 'games'}},
        {params: {category: 'music'}},
        {params: {category: 'science'}},
        {params: {category: 'sports'}},
        {params: {category: 'travel'}},
        {params: {category: 'movies'}},
      ],
      fallback: false
  }
}