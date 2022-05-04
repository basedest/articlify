import { signIn } from "next-auth/react"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <main
      style={{
        height: '100vh',
        display: 'grid',
        justifyContent: 'center',
        placeItems: 'center',
      }}
    >
      <div>
        <h1>Access Denied</h1>
        <p>
          <Link href="/api/auth/signin">
              <a
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                You must be signed in to view this page
              </a>
          </Link>
        </p>
      </div>
    </main>
  )
}