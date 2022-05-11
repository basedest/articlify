import { GetStaticProps } from 'next'
import { ArticleModel, PageModel } from '../../lib/ArticleTypes'
import Image from 'next/image'
import TagsList from '../../components/TagsList'
import { connectDB } from '../../lib/db/connection'
import { categories } from '../../lib/lib'

const ArticlePage = ({article, page}) => {
  if (!article) return null
  const img = article.img ?? `/img/${article.category}.png`
  return (
    <>
      <div className="article__container">
        <div className="article__head">
          <h1>{article.title}</h1>
          <div className="article__authordate">
              <p>{article.author}</p>
              <p>•</p>
              <p>{new Date(article.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="article__category">{article.category}</div>
          <div className="article__description">{article.description}</div>
          <Image className='img' src={img} alt="article image" height="1" width="2" layout='responsive' />
          <TagsList tags={article.tags}/>
        </div>
        <div className="article">
          <article>
            {
              page.data.blocks.map(item => {
                const {id} = item
                switch (item.type) {
                  case 'paragraph':
                    return <p key={id} dangerouslySetInnerHTML={{__html:item.data.text}}></p>
                  case 'header':
                    return item.data.level === 2
                    ? <h2 key={id}>{item.data.text}</h2>
                    : <h3 key={id}>{item.data.text}</h3>
                  case 'list':
                    if (item.data.style === 'ordered') {
                      return (
                      <ol key={id}>
                        {
                          item.data.items.map((li, i) => <li key={i}>{li}</li>)
                        }
                      </ol>
                      )
                    }
                    else {
                      return (
                        <ul key={id}>
                          {
                            item.data.items.map((li, i) => <li key={i}>{li}</li>)
                          }
                        </ul>
                        )
                    }
                  case 'quote':
                    return <blockquote key={id} cite={item.data.caption}>
                        {item.data.text}
                    </blockquote>
                  case 'checklist':
                    return (
                      <ul key={id} className='checklist'>
                        {item.data.items.map((li, i) => <li key={i}>{li.text}</li>)}
                      </ul>
                    )
                  case 'delimiter':
                    return <div key={id} className="article__delimiter"></div>
                }
              })
            }
          </article>
        </div>
      </div>
    </>
  )
}

export default ArticlePage

export const getStaticProps: GetStaticProps = async (context) => {
  await connectDB()
  const {slug, category} = context.params
  if (!categories.includes(category as string)) {
    return {
      notFound: true
    }
  }
  let article = await ArticleModel.findOne({slug})
  
  article = JSON.parse(JSON.stringify(article))
  let page = await PageModel.findOne({slug})
  page = JSON.parse(JSON.stringify(page))
  return {
    props: {
        article, page
    },
    revalidate: 30
  }
}

export async function getStaticPaths() {
  const paths = []

  return {
      paths,
      fallback: true, 
  }
}