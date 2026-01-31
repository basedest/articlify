import { useCallback, useState, useEffect } from "react"
import initialData from './data.json'
import EditorJS, { OutputData } from '@editorjs/editorjs'

export const useSaveCallback = (editor: EditorJS) => {
  return useCallback(async () => {
    if (!editor) {
      console.error('no editor')
      return
    }
    try {           
      const data = await editor.save()
      console.group('EDITOR onSave')
      console.dir(data)
      localStorage.setItem(dataKey, JSON.stringify(data))
      console.info('Saved in localStorage')
      console.groupEnd()
      return data
    } 
    catch (e) {
      console.error('SAVE RESULT failed', e)
    }
  }, [editor])
}

// Set editor data after initializing
export const useSetData = (editor: EditorJS, data: OutputData) => {
  useEffect(() => {
    if (!editor || !data) {
      return
    }
    
    editor.isReady.then(() => {
      editor.render(data)
    })
  }, [editor, data])
}

export const useClearDataCallback = (editor: EditorJS) => {
  return useCallback((ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault()
    if (!editor) {
      return
    }
    editor.isReady.then(() => {
      // fixing an annoying warning in Chrome `addRange(): The given range isn't in document.`
      setTimeout(() => {
        editor.clear()
      }, 100)
    })
  }, [editor])
}

// load saved data
export const useLoadData = () => {
  const [data, setData] = useState<OutputData | null>(null)
  const [loading, setLoading] = useState(false)
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
    }, 200)
    
    return () => {
      setLoading(false)
      clearTimeout(id)
    }
  }, [])
  
  return { data, loading }
}

export const dataKey = 'editorData'