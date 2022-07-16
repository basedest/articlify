import Link from "next/link"

export default function AccessDenied({callbackUrl}: {callbackUrl: string}) {
  return (
      <div className="text-center">
        <h1>Access Denied</h1>
        <p>
          <Link href={`/login/?callbackUrl=${callbackUrl}`}>
              <a className="text-green-600 dark:text-green-500 hover:underline">
                sign in
              </a>
          </Link>
          {' '}to view this page
        </p>
      </div>
  )
}