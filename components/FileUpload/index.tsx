import { ChangeEvent, Dispatch, FunctionComponent, SetStateAction } from 'react'
import styles from './FileUpload.module.scss'

type FileUploadProps = {
  setImageSrc?: Dispatch<SetStateAction<null | string>>,
  setFile: Dispatch<SetStateAction<null | File>>
}

const FileUpload: FunctionComponent<FileUploadProps> = ({setImageSrc, setFile}) => {

  function handleOnChange(changeEvent: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader()
    const file = changeEvent.target.files[0]

    reader.onload = function(onLoadEvent) {
      if (setImageSrc)
      setImageSrc(onLoadEvent.target.result as string)
    }

    if (file) {
      reader.readAsDataURL(file)
      setFile(file)
    }
  }

  return (
    <input 
      onChange={handleOnChange}
      type="file" 
      className={styles.input}
    />
  )
}

export default FileUpload
