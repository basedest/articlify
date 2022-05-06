import React, { useState } from 'react'
import Image from 'next/image'

const FileUpload = ({filenameCB}) => {
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filepath, setFilepath] = useState<string | null>(null)

  const uploadToServer = async (body) => {
    const response = await fetch("/api/image/upload", {
      method: "POST",
      body
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
      //console.log('hehe')
      uploadToServer(body)
      .then(([err, filename]) => {
        //console.log('here!!!')
        setError(err?.error)
        //console.log('hehe: ', filename)
        setFilepath(filename)
        filenameCB(filename)
      })
      .catch(err => {
        //console.log(err)
        setError(err.error)
      })
    }
    setLoading(false)
  }
  const test = () => {
    console.log('loading: ', loading)
    console.log('error: ', error)
    console.log('filepath: ', filepath)
  }
  return (
    <div className='file-upload'>
        {createObjectURL && 
        <Image src={createObjectURL} alt='image' height={1} width={2} layout='responsive' />
        }
        <input type="file" name="myImage" onChange={upload} />
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
        {/* <button onClick={test}>
          test
        </button> */}
    </div>
  )
}

export default FileUpload