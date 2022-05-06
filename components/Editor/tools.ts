import Header from '@editorjs/header'
import List from '@editorjs/list'
import Paragraph from '@editorjs/paragraph'
import LinkTool from '@editorjs/link'
import Underline from '@editorjs/underline'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
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
