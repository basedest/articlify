import { useState } from 'react'
import { getSession, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { User } from '../lib/UserTypes'
import Modal from '../components/Modal'
import Link from 'next/link'
import FileUpload from '../components/FileUpload'
import { useRouter } from 'next/router'

function Dashboard({ data }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const user: User = session.user as User
  const [avatar, setAvatar] = useState(user?.image ?? '/img/user.svg')
  const changeUsername = async () => {
    setModal(true)
  }

  const changeAvatar = (image: string) => {
    fetch(`/api/user/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify({image}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(data => {
      const {image} = data
      setAvatar(image as string)
      session.user.image = image
      router.replace(router.asPath)
    })
    .catch(console.error)
  } 

  return (
    <div className='dashboard'>
      <Modal visible={modal} setVisible={setModal}>
        <div style={{padding: '2rem'}}>This feature will be available in the next updates</div>
      </Modal>
      <div className='avatar'>
          <div className="wrapper">
            <div className="img">
              <Image
                width={1}
                height={1}
                src={avatar}
                alt='avatar'
                layout='responsive'
              />
            </div>
            <FileUpload width={1} height={1} callback={changeAvatar} />
          </div>
          <div>{user.name}</div>
      </div>
      <div className='username'>
        <div>
          <label>username</label>
          <div>{user.name}</div>
        </div>
        <button onClick={changeUsername}>Edit</button>
      </div>
      <div className='email'>
        <label>email</label>
        <div>{user.email}</div>
      </div>
      <div className='regDate'>
        <label>registration date</label>
        <div>{new Date(user.regDate).toLocaleDateString()}</div>
      </div>
      <div className='myArticles'>
        <Link href={`/articles/user/${user.name}`}>
          <a className='colored'>My articles</a>
          </Link>
      </div>
      <div className='signout'>
        <a className='colored' onClick={e => {
            e.preventDefault()
            signOut()
        }}>
            Sign Out
        </a>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${process.env.NEXTAUTH_URL}/dashboard`,
        permanent: false
      }
    }
  }
  
  return {
    props: {
      data: null,
    }
  }
}

export default Dashboard