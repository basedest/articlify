import React, { useEffect, useState } from 'react'
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs'
import { tools } from './tools'

type EditorRef = React.Dispatch<React.SetStateAction<EditorJS>>

export const useEditor = 
(
    toolsList: EditorJS.ToolConfig,
    { data, editorRef }: {data: OutputData, editorRef: EditorRef},
    options: EditorConfig  = {}
) => {
  const [editorInstance, setEditor] = useState<EditorJS | null>(null)

  const { data: ignoreData, tools: ignoreTools, holder: ignoreHolder, ...editorOptions } = options
 
  // initialize
  useEffect(() => {
    // create instance
    const editor = new EditorJS({
      /** 
       * Id of Element that should contain the Editor 
       */
      holder: 'editor-js',

      /** 
       * Available Tools list. 
       * Pass Tool's class or Settings object for each Tool you want to use 
       */
      tools: toolsList,

      /**
      * Previously saved data that should be rendered
      */
      data: data || {},

      initialBlock: 'paragraph',

      // Override editor options
      ...editorOptions,
    })

    setEditor(editor)

    // cleanup
    return () => {
      editor.isReady.then(() => {
        editor.destroy()
        setEditor(null)
      })
      .catch(e => console.error('ERROR editor cleanup', e))
    }
  }, [toolsList])

  // set reference
  useEffect(() => {
    if (!editorInstance) {
      return
    }
    // Send instance to the parent
    if (editorRef) {
      editorRef(editorInstance)
    }
  }, [editorInstance, editorRef])

  return { editor: editorInstance }
}

interface EditorContainerProps {
  editorRef: EditorRef, 
  data: OutputData, 
  options: EditorConfig
}

export const EditorContainer: React.FC<EditorContainerProps> 
  = ({ editorRef, children, data, options }) => {
  useEditor(tools, { data, editorRef }, options)

  return (
    <React.Fragment>
      {!children && <div className="w-full" id="editor-js"></div>}
      {children}
    </React.Fragment>
  )
}