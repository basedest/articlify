import { useState, useEffect } from 'react'
import { getSession, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { User } from '../lib/UserTypes'
import Modal from '../components/Modal'
import Link from 'next/link'


function Dashboard({ data }) {
  const { data: session } = useSession()
  const [modal, setModal] = useState(false)
  const user: User = session.user as User
  const changeUsername = async () => {
    setModal(true)
  }

  return (
    <div className='dashboard'>
      <Modal visible={modal} setVisible={setModal}>
        <div style={{padding: '2rem'}}>This feature will be available in the next updates</div>
      </Modal>
      <div className='avatar'>
          <div className="img">
            <Image
              width={1}
              height={1}
              src={user.image ? user.image : '/img/user.svg'}
              alt='avatar'
              layout='responsive'
            />
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
      session
    }
  }
}

export default Dashboard