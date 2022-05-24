import Header from '@editorjs/header'
//@ts-ignore
import List from '@editorjs/list'
//@ts-ignore
import Paragraph from '@editorjs/paragraph'
//@ts-ignore
import LinkTool from '@editorjs/link'
//@ts-ignore
import Underline from '@editorjs/underline'
//@ts-ignore
import Quote from '@editorjs/quote'
//@ts-ignore
import Marker from '@editorjs/marker'
//@ts-ignore
import CheckList from '@editorjs/checklist'
//@ts-ignore
import Delimiter from '@editorjs/delimiter'
//@ts-ignore
import InlineCode from '@editorjs/inline-code'
//@ts-ignore
import SimpleImage from '@editorjs/simple-image'

export const tools = {
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a header',
      levels: [2, 3],
      defaultLevel: 3
    },
    inlineToolbar: ['link'],
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  underline: {
    class: Underline,
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true
  },
  linkTool: LinkTool,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage
}
