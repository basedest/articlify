import React, { useState } from 'react'
import Image from 'next/image'

interface Props {
  callback: Function
  width: number
  height: number
  disabled?: boolean
  preview?: boolean
}

const FileUpload = ({callback, disabled, preview, height, width}: Props) => {
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filepath, setFilepath] = useState<string | null>(null)

  const uploadToServer = async (body) => {
    const response = await fetch("/api/image/upload", {
      method: "POST",
      body,
    })
    if (response.status !== 201) {
      return [await response.json(), null]
    }
    const {filename} = await response.json()
    return [null, filename]
  }

  const upload = (event) => {
    setLoading(true)
    
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]

      setCreateObjectURL(URL.createObjectURL(i))

      const body = new FormData()
      body.append('file', i)
      uploadToServer(body)
      .then(([err, filename]) => {
        setError(err?.error)
        setFilepath(filename)
        callback(filename)
      })
      .catch(err => {
        setError(err.error)
      })
    }
    setLoading(false)
  }
  return (
    <div className='file-upload'>
        {preview && createObjectURL && 
        <Image 
          src={createObjectURL} 
          alt='image' 
          height={height} 
          width={width} 
          layout='responsive'
        />
        }
        <input 
          type="file" 
          name="myImage"
          onChange={upload}
          disabled={disabled ?? false}
        />
        {
          loading && <p className='loading'>loading...</p>
        }
        {
          error && <p className='error'>{error}</p>
        }
        {
          !loading && !error && filepath && 
          <p className='success'>successfuly uploaded</p>
        }
    </div>
  )
}

export default FileUpload