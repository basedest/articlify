import { useCallback, useState, useEffect } from "react"
import initialData from './data.json'
import { useRouter } from 'next/router'
import { Article } from "../../lib/ArticleTypes"

export const useSaveCallback = (editor, article: Article) => {
  const router = useRouter()
  return useCallback(async () => {
    if (!editor) return
    try {
      const data = await editor.save()
      console.group('EDITOR onSave')
      console.dir(data)
      localStorage.setItem(dataKey, JSON.stringify(data))
      console.info('Saved in localStorage')
      console.groupEnd()

      const response = await fetch('/api/save-article', {
        method: 'POST',
        body: JSON.stringify({article, data}),
        headers: {
            'Content-Type': 'application/json'
          }
      })
      response.status === 201
      ? router.push(`/${article.category}/${article.slug}`)
      : alert("check your inputs. something's just not right...")
    } 
    catch (e) {
      console.error('SAVE RESULT failed', e);
    }
  }, [editor, article, router])
}

// Set editor data after initializing
export const useSetData = (editor, data) => {
  useEffect(() => {
    if (!editor || !data) {
      return
    }
    
    editor.isReady.then(() => {
      // fixing an annoying warning in Chrome `addRange(): The given range isn't in document.`
      setTimeout(() => {
        editor.render(data);
      }, 100)
    })
  }, [editor, data])
}

export const useClearDataCallback = (editor) => {
  return useCallback((ev) => {
    ev.preventDefault()
    if (!editor) {
      return
    }
    editor.isReady.then(() => {
      // fixing an annoying warning in Chrome `addRange(): The given range isn't in document.`
      setTimeout(() => {
        editor.clear();
      }, 100)
    })
  }, [editor])
}

// load saved data
export const useLoadData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // Mimic async data load
  useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => {
      console.group('EDITOR load data')
      const saved = localStorage.getItem(dataKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setData(parsed)
        console.dir(parsed)
      } else {
        console.info('No saved data, using initial')
        console.dir(initialData)
        setData(initialData)
      }
      console.groupEnd()
      setLoading(false)
    }, 200);
    
    return () => {
      setLoading(false)
      clearTimeout(id)
    }
  }, [])
  
  return { data, loading }
};

export const dataKey = 'editorData'