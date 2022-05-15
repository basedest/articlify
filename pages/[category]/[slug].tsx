import { GetStaticProps } from 'next'
import { Article, ArticleModel } from '../../lib/ArticleTypes'
import Image from 'next/image'
import TagsList from '../../components/TagsList'
import { connectDB } from '../../lib/server/connection'
import findArticles from '../../lib/server/findArticles'

interface PageProps {
  article: Article
}

//страница статьи
const ArticlePage = ({article}: PageProps) => {
  if (!article) return null
  //если картинки нет, отображаем заглушку по категории
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
              //разбираем каждый блок на HTML-документы
              article.content.blocks.map(item => {
                const {id} = item
                switch (item.type) {
                  case 'paragraph':
                    //в параграфах могут содержаться inline-теги, поэтому устанавливаем данные через dangerouslySetInnerHTML
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

//статически генерируем страницу
export const getStaticProps: GetStaticProps = async (context) => {
  await connectDB()
  const {slug} = context.params
  let article = await ArticleModel.findOne({slug}) as Article
  if (!article) {
    return {
      notFound: true
    }
  }
  article = JSON.parse(JSON.stringify(article))
  return {
    props: {
        article
    },
    //ревалидация страницы раз в 30 секунд
    revalidate: 30 
  }
}

//страницы по умолчанию
export async function getStaticPaths() {
  
  const articles = await findArticles({})
  
  const paths = articles.map(article => {
    const {category, slug} = article
    return {
      params: {
        category,
        slug
      }
    }
  })

  return {
      paths,
      fallback: true,
  }
}