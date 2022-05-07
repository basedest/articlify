import { useState, useEffect } from 'react'
import { getSession, signOut, useSession } from 'next-auth/react'

function Dashboard({ data }) {
  const { data: session } = useSession()

  return <div style={{
    textAlign: 'center'
  }}>
    <h1>You signed in as {session.user.name}</h1>
    <h2>
      <a onClick={e => {
        e.preventDefault()
        signOut()
      }}>Sign Out</a>
    </h2>
  </div>
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
      data: 'List of 100 personalized blogs',
      session
    }
  }
}

export default Dashboard