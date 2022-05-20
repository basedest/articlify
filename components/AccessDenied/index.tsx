import Link from "next/link"
import cl from "./AccessDenied.module.scss"

export default function AccessDenied({callbackUrl}) {
  return (
      <div className={cl.access_denied}>
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