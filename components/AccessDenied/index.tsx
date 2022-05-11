import Link from "next/link"

export default function AccessDenied({callbackUrl}) {
  return (
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>
          <Link href={`/login/?callbackUrl=${callbackUrl}`}>
              <a>
                sign in
              </a>
          </Link>
          {' '}to view this page
        </p>
      </div>
  )
}