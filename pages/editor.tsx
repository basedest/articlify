import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useSaveCallback, useLoadData, options, useSetData, useClearDataCallback } from '../components/Editor'
import MyInput from '../components/input/MyInput'
import { Article, ArticleModel, ArticlePage, PageModel } from '../lib/ArticleTypes'
import Select from 'react-select'
import TagsPicker from '../components/TagsPicker'
import { useSession } from "next-auth/react"
import AccessDenied from '../components/access-denied'
import FileUpload from '../components/FileUpload'
import { GetServerSideProps, NextPage } from 'next'
import { connectDB } from '../lib/db/connection'
import { OutputData } from '@editorjs/editorjs'

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
  // load data
  const { data, loading } = edit
  ? {data: props.data, loading: false}
  // eslint-disable-next-line react-hooks/rules-of-hooks
  : useLoadData()
  
  const { data: session, status } = useSession()
  const authLoading = status === "loading"
  
  // set saved data
  useSetData(editor, data)
  
  // clear data callback
  const clearData = useClearDataCallback(editor)
  
  const disabled = editor === null || loading || authLoading
  
  const [article, setArticle] = useState<Article>(props.article)
  
  const [img, setImg] = useState<string | null>(article?.img)
  
  const onSave = useSaveCallback(editor, 
    {...article, 
      img,
      slug: article?.title.toLocaleLowerCase().split(' ').join('-'),
      createdAt: new Date,
      author: article?.author ?? session?.user.name
    },
    edit
    )

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading && authLoading) return null

  // If no session exists, display access denied message
  if (!session) {
    return <AccessDenied callbackUrl={'/editor'} />
  }

  return (
    <div className="container">
      <main>
        <div className="inputs">
          {
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
            options={[
              { value: 'art',     label: 'art'     },
              { value: 'games',   label: 'games'   },
              { value: 'it',      label: 'it'      },
              { value: 'movies',  label: 'movies'  },
              { value: 'music',   label: 'music'   },
              { value: 'science', label: 'science' },
              { value: 'sports',  label: 'sports'  },
              { value: 'travel',  label: 'travel'  },
              { value: 'other',   label: 'other'   },
            ]}
          />
          <TagsPicker 
            defaultValue={ edit && article.tags.map(tag => {return {value: tag, label: tag}})}
            onChange={v => setArticle({...article, tags: v.map((val, _) => val.value)})}
          />
          {
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

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
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
