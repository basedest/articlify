import Link from "next/link"

export default function AccessDenied() {
  return (
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>
          <Link href="login">
              <a>
                sign in
              </a>
          </Link>
          {' '}to view this page
        </p>
      </div>
  )
}