import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useSaveCallback, useLoadData, options, useSetData } from '../components/Editor'
import MyInput from '../components/input/MyInput'
import { Article, ArticleModel, ArticlePage, PageModel } from '../lib/ArticleTypes'
import Select from 'react-select'
import TagsPicker from '../components/TagsPicker'
import { useSession } from "next-auth/react"
import AccessDenied from '../components/AccessDenied'
import FileUpload from '../components/FileUpload'
import { GetServerSideProps, NextPage } from 'next'
import { connectDB } from '../lib/db/connection'
import { OutputData } from '@editorjs/editorjs'
import { categories } from '../lib/lib'

interface PageProps {
  article?: Article
  data?: OutputData
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const slug = context.query.edit as string
  if (slug) {
    await connectDB()
    const article = JSON.parse(JSON.stringify(
      (await ArticleModel.findOne({slug}))
    )) as Article
    const {data} = await PageModel.findOne({slug}) as ArticlePage
    return {
      props: {
        article, data
      }
    }
  } 
  return {
    props: {}
  } 
}

const Editor: any = dynamic(
  () => import('../components/Editor/editor').then(mod => mod.EditorContainer),
  { ssr: false }
)

const EditorPage: NextPage<PageProps> = (props) => {
  const [editor, setEditor] = useState(null)
  const edit = props.article ? true : false
  
  //Загрузить данные либо из пропсов при редактировании
  // либо из localStorage, в обратном случае
  const { data, loading } = edit
  ? {data: props.data, loading: false}
  /*
    следующий комментарий нужен для того, чтобы не возникало предупреждение
    о том, что нельзя использовать хуки в условных операторах.
    Я же считаю, что можно, если осторожно
  */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  : useLoadData()
  
  const { data: session, status } = useSession()
  const authLoading = status === "loading"
  
  // установить загруженные [выше] данные
  useSetData(editor, data)
  
  // выключаем кнопку сохранения если идёт загрузка
  const disabled = editor === null || loading || authLoading
  
  // устанавливаем данные о статье в начальное значение
  const [article, setArticle] = useState<Article>(props.article)
  
  //картинка статьи
  const [img, setImg] = useState<string | null>(article?.img)
  
  //сохранение статьи при нажатии кнопки
  const onSave = useSaveCallback(editor, 
    {...article, 
      img,
      //формируем ссылку на статью по названию
      slug: article?.title.toLocaleLowerCase().split(' ').join('-'),
      createdAt: new Date,
      author: article?.author ?? session?.user.name
    },
    edit
    )

  // ничего не выводим пока не закончится загрузка
  if (typeof window !== "undefined" && loading && authLoading) return null

  // если пользователь не авторизован, выводим компонент AccessDenied
  if (!session) {
    return <AccessDenied callbackUrl={'/editor'} />
  }

  return (
    <div className="container">
      <main>
        <div className="inputs">
          {
            // при редактировании название статьи изменить нельзя, но отобразить надо
            edit
            ? <h1>{article.title}</h1>
            : <MyInput 
                value={article?.title}
                onChange={e => setArticle({...article, title: e.target.value})}
                type="text" 
                placeholder="Title..."
                disabled={edit}
              />
          }
          <textarea
            value={article?.description}
            className='myInput' 
            style={{
                marginBottom: -1,
                marginTop: -1,
                font: "inherit",
            }}
            placeholder="Description..."
            onChange={e => setArticle({...article, description: e.target.value})}
          >
          </textarea>
          <Select
            defaultValue={ edit && {value: article.category, label: article.category}}
            placeholder={'Category...'}
            onChange={selected => setArticle({...article, category: selected.value})}
            options={categories.map(item => {return {value: item, label: item}})}
          />
          <TagsPicker 
            defaultValue={ edit && article.tags.map(tag => {return {value: tag, label: tag}})}
            onChange={v => setArticle({...article, tags: v.map((val, _) => val.value)})}
          />
          {
            // при редактировании не разрешаем изменять картинку
            !edit &&
            <div className="image">
              Select an image:<span className='hint'>(image will be converted to 2x1 ratio)</span>
              <FileUpload width={2} height={1} callback={setImg} disabled={edit} preview />
            </div>
          }
        </div>
        <div className="editorContainer">
          <Editor reInit editorRef={setEditor} options={options} data={data} />
        </div>
        <button disabled={disabled} type="button" onClick={onSave}>save article</button>{' '}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 1000px;
          width: 90vw;
        }

        .editorContainer {
          width: 100%;
          margin-bottom: 10px;
          z-index: 0;
        }

        h1 {
          margin-bottom: 10px;
          font-size: 38px;
        }

        .hint {
          font-size: 0.8em;
          color: #777;
          margin-left: 1em;
        }

        button {
          cursor: pointer;
          color: #fff !important;
          text-transform: uppercase;
          text-decoration: none;
          background: #27e;
          padding: 20px;
          border-radius: 5px;
          display: inline-block;
          border: none;
          transition: all 0.4s ease 0s;
        }

        button:hover, button:disabled {
          background: #434343;
          letter-spacing: 1px;
          -webkit-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
          -moz-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
          box-shadow: 5px 40px -10px rgba(0,0,0,0.57);
          transition: all 0.4s ease 0s;
        }

        .inputs {
          margin-bottom: 1rem;
          width: 100%;
        }
      `}</style>

    </div>
  )
}

export default EditorPage
