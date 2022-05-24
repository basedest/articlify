import { GetStaticProps, GetStaticPropsContext } from 'next'
import { Article } from '../../lib/ArticleTypes'
import Image from 'next/image'
import TagsList from '../../components/TagsList'
import ArticleService from '../../lib/server/article/service'

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
        <div className="img">
          <Image src={img} alt="article image" height="1" width="2" layout='responsive' />
        </div>
        <section className="article__head">
          <div className="flex-wrap">
            <div className="article__category">{article.category}</div>
            <TagsList tags={article.tags}/>
          </div>
          <div className="article__authordate">
              <p>@{article.author}</p>
              <p>•</p>
              <p>{new Date(article.createdAt).toLocaleDateString()}</p>
              {
                article.editedAt &&
                <p className='upd'>(upd. {new Date(article.editedAt).toLocaleDateString()})</p>
              }
          </div>
          <h1>{article.title}</h1>
          <div className="article__description">{article.description}</div>
        </section>
        <hr />
        <article className="article">
          {
            //разбираем каждый блок на HTML-документы
            article?.content?.blocks.map(item => {
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
                        item.data.items.map((li:any, i:number) => <li key={i}>{li}</li>)
                      }
                    </ol>
                    )
                  }
                  else {
                    return (
                      <ul key={id}>
                        {
                          item.data.items.map((li:any, i:number) => <li key={i}>{li}</li>)
                        }
                      </ul>
                      )
                  }
                case 'quote':
                  return <blockquote 
                          key={id} 
                          cite={item.data.caption}
                          dangerouslySetInnerHTML={{__html:item.data.text}}
                          >
                  </blockquote>
                case 'checklist':
                  return (
                    <ul key={id} className='checklist'>
                      {item.data.items.map((li:any, i:number) => <li data-checked={li.checked} key={i}>
                      {
                      li.checked
                      ?<svg xmlns="http://www.w3.org/2000/svg" className='check' viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                       </svg>
                      :<svg xmlns="http://www.w3.org/2000/svg" className='check' version="1.1">
                        <circle cx="8" cy="9" r="5.5" stroke="black" strokeWidth="2" fill="none" clipRule="evenodd" />
                      </svg> 
                      }
                        {li.text}
                        </li>)}
                    </ul>
                  )
                case 'delimiter':
                  return <div key={id} className="article__delimiter"></div>
                case 'simpleImage':
                  return ( 
                    <figure key={id} className="image-block">
                      <img src={item.data.url}/>
                      <figcaption>{item.data.caption}</figcaption>
                    </figure>
                  )
              }
            })
          }
        </article>
      </div>
    </>
  )
}

export default ArticlePage

//статически генерируем страницу
export const getStaticProps: GetStaticProps<{article:Article}, {slug:string}> = async context => {
  const {slug} = context.params as {slug:string}
  const article = await ArticleService.getBySlug(slug as string)
  if (!article) {
    return {
      notFound: true
    }
  }
  
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
  const articles = await ArticleService.getAll()
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