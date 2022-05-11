import { useEffect, useState } from 'react'
import { getSession, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { User } from '../lib/UserTypes'
import Modal from '../components/Modal'
import Link from 'next/link'
import FileUpload from '../components/FileUpload'
import { useRouter } from 'next/router'

//Меню пользователя
export default function Dashboard() {
  const {data: session, status} = useSession()
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  
  //устанавливаем значение user после загрузки сессии
  useEffect(() => {
    if (status === 'authenticated') {
      setUser(session.user as User)
    }
  }, [status, session])
  //выводим модальное окно при нажатии кнопки Edit
  const changeUsername = async () => {
    setModal(true)
  }

  //изменение аватарки
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
      session.user.image = image
      setAvatar(image)
      router.replace(router.asPath)
    })
    .catch(console.error)
  } 
  //пока загружается сессия, ничего не выводим
  if (status === 'loading' || !user) return null
  return (
    <div className='dashboard'>
      {
      //модальное окно с сообщением о том,
      //что возножность изменения имени появится когда-нибудь, но не сейчас
      }
      <Modal visible={modal} setVisible={setModal}>
        <div style={{padding: '2rem'}}>
          This feature will be available in the next updates
        </div>
      </Modal>
      <div className='avatar'>
          <div className="wrapper">
            <div className="img">
              {
                //если есть аватарка, то показываем её, иначе - иконку 
                avatar
                ? <Image
                    width={1}
                    height={1}
                    src={avatar}
                    alt='avatar'
                    layout='responsive'
                  />
                : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
              }
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
  //если нет сессии, перенаправляем на логин
  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${process.env.NEXTAUTH_URL}/dashboard`,
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}