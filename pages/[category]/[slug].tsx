import { GetStaticProps } from 'next'
import { Article } from '../../lib/ArticleTypes'
import Image from 'next/image'
import TagsList from '../../components/TagsList'
import ArticleService from '../../lib/server/article/service'
import Link from 'next/link'

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
      <div className="flex items-center justify-center flex-col max-w-5xl w-full bg-white dark:bg-gray-900">
        <div className="w-full">
          <Image src={img} alt="article image" height="1" width="2" layout='responsive' />
        </div>
        <section className="article__head">
          <div className="article__authordate">
              <Link href={`/articles/user/${article.author}`}>
                <a className='colored'>@{article.author}</a>
              </Link>
              <p>•</p>
              <p>{new Date(article.createdAt).toLocaleDateString()}</p>
          </div>
          <h1>{article.title}</h1>
          <div className="mb-8">{article.description}</div>
        </section>
        <hr className='w-[90%]' />
        <article className="article px-4 py-8 md:px-16">
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
                  ? <h2 className="mt-12 text-3xl" key={id}>{item.data.text}</h2>
                  : <h3 className="mt-8 text-2xl self-start" key={id}>{item.data.text}</h3>
                case 'list':
                  if (item.data.style === 'ordered') {
                    return (
                    <ol key={id}>
                      {
                        item.data.items.map((li:any, i:number) => <li key={i} dangerouslySetInnerHTML={{__html:li}}></li>)
                      }
                    </ol>
                    )
                  }
                  else {
                    return (
                      <ul key={id}>
                        {
                          item.data.items.map((li:any, i:number) => <li key={i} dangerouslySetInnerHTML={{__html:li}}></li>)
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
                    <ul key={id} className='list-none'>
                      {item.data.items.map((li:any, i:number) => (
                      <li 
                        className='flex align-baseline'
                        data-checked={li.checked}
                        key={i}
                      >
                      {
                      li.checked
                      ?<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-[5px] mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                       </svg>
                      :<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-[5px] mr-1" version="1.1">
                        <circle cx="8" cy="9" r="5.5" stroke="currentColor" strokeWidth="2" fill="none" clipRule="evenodd" />
                      </svg> 
                      }
                      <span dangerouslySetInnerHTML={{__html:li.text}}></span>
                        </li>))}
                    </ul>
                  )
                case 'delimiter':
                  return <div key={id} className="article__delimiter"></div>
                case 'simpleImage':
                  return ( 
                    <figure key={id} className="flex flex-col text-center w-full">
                      <img className="w-full" src={item.data.url}/>
                      <figcaption className="text-base font-light text-stone-600 dark:text-gray-500">{item.data.caption}</figcaption>
                    </figure>
                  )
              }
            })
          }
        </article>
        <section className="flex place-self-start flex-col gap-8 px-4 py-16 md:px-16">
          <TagsList tags={article.tags}/>
          <p className='text-stone-500 dark:text-gray-400'>Last updated: {
            article.editedAt 
            ? new Date(article.editedAt).toLocaleString()
            : new Date(article.createdAt).toLocaleString()
          }</p>
          <Link href={`/${article.category}`}>
            <a className='colored'>Browse {article.category} category</a>
          </Link>
          <Link href="/">
            <a className="flex bg-green-600 rounded-xl py-2 items-center text-lg justify-center hover:bg-green-700 dark:hover:bg-green-500 text-white hover:text-white dark:hover:text-white">
              <svg className="h-full w-9" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to all articles
            </a>
          </Link>
        </section>
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