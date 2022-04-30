import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useSaveCallback, useLoadData, options, useSetData, useClearDataCallback } from '../components/Editor'
import MyInput from '../components/input/MyInput'
import { Article } from '../lib/ArticleTypes'
import Select from 'react-select'
import TagsPicker from '../components/TagsPicker'

const Editor: any = dynamic(
  () => import('../components/Editor/editor').then(mod => mod.EditorContainer),
  { ssr: false }
)

export default function EditorPage() {
  const [editor, setEditor] = useState(null)
  
  // load data
  const { data, loading } = useLoadData()
  
  // set saved data
  useSetData(editor, data)
  
  // clear data callback
  const clearData = useClearDataCallback(editor)
  
  const disabled = editor === null || loading
  
  const [article, setArticle] = useState<Article>()

  const onSave = useSaveCallback(editor, article)

  return (
    <div className="container">

      <main>
        <div className="inputs">
          <MyInput 
            value={article?.title}
            onChange={e => setArticle({...article, title: e.target.value})}
            type="text" 
            placeholder="Название..."
          />
          <textarea
            className='myInput' 
            style={{
                marginBottom: -4,
                marginTop: -1,
                font: "inherit",
            }}
            name="desc"
            placeholder="Описание..."
            onChange={e => setArticle({...article, description: e.target.value})}
          >
          </textarea>
          <MyInput 
            value={article?.author}
            onChange={e => setArticle({...article, author: e.target.value})}
            type="text"
            placeholder="Автор..."
          />
          
          <Select
            placeholder={'Выберите категорию'}
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
            ]}
          />

          <TagsPicker 
            onChange={v => setArticle({...article, tags: v.map((val, _) => val.value)})}
          />
        </div>
        <div className="editorContainer">
          <Editor reInit editorRef={setEditor} options={options} data={data} />
        </div>
        <button disabled={disabled} type="button" onClick={onSave}>Сохранить статью</button>{' '}
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

        button {
          cursor: pointer;
          color: #fff !important;
          text-transform: uppercase;
          text-decoration: none;
          background: #267dcc;
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
        }
      `}</style>

    </div>
  )
}
