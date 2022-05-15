import { useState } from 'react'
import styles from './ImageUpload.module.scss'


const ImageUpload = ({formRef, setUploadData}) => {
    const [imageSrc, setImageSrc] = useState()
    const [error, setError] = useState(null)

    function handleOnChange(changeEvent) {
      const reader = new FileReader()
  
      reader.onload = function(onLoadEvent) {
        setImageSrc(onLoadEvent.target.result as any)
        setUploadData(undefined)
      }
  
      reader.readAsDataURL(changeEvent.target.files[0])
    }
  
    function handleOnSubmit(event) {
      event.preventDefault()
      if (!imageSrc) {
          return
      }
      const form = event.currentTarget
      const fileInput = Array.from(form.elements).find(({name}) => name === 'file') as any
      const formData = new FormData()
      for (const file of fileInput.files) {
        formData.append('file', file)
      }
      formData.append('upload_preset', 'articlify')
      fetch('https://api.cloudinary.com/v1_1/basedest/image/upload/', {
        method: 'POST',
        body: formData
      })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
            setError(data.error.message)
        }
        setImageSrc(data.sequre_url)
        setUploadData(data)
      })
      
    }
  
    return (
          <form ref={formRef} className={styles.form} method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
            <p>
              <input 
                type="file" 
                name="file"
              />
            </p>
            
            <img src={imageSrc} />
            {
            error && <span>{error}</span>
            }
          </form>
    )
}

export default ImageUpload