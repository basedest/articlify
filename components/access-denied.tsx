import { signIn } from "next-auth/react"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <main
      style={{
        height: '95vh',
        display: 'grid',
        justifyContent: 'center',
        placeItems: 'center',
      }}
    >
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>
          <Link href="/api/auth/signin">
              <a
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                sign in
              </a>
          </Link>
          {' '}to view this page
        </p>
      </div>
    </main>
  )
}