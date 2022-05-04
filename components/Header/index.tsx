import Link from "next/link"
import { signIn, signOut, useSession } from 'next-auth/react'

const Header:React.FC = () => {
    const { data: session, status } = useSession()
    const loading = status === "loading"
    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <input type="checkbox" name="" id="" />
                <div className="hamburger-lines">
                    <span className="line line1"></span>
                    <span className="line line2"></span>
                    <span className="line line3"></span>
                </div>
                <ul className="menu-items">
                    <li>
                        <Link href='/'>
                            <a>Main</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/category'>
                            <a>Categories</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/editor'>
                            <a>Editor</a>
                        </Link>
                    </li>
                    {!loading && !session && (
                        <li>
                            <Link href='/api/auth/signin'>
                            <a
                                onClick={e => {
                                e.preventDefault()
                                signIn()
                                }}>
                                Sign In
                            </a>
                            </Link>
                        </li>
                    )}
                    {session && (
                        <li>
                            <Link href='/api/auth/signout'>
                            <a
                                onClick={e => {
                                e.preventDefault()
                                signOut()
                                }}>
                                Sign Out
                            </a>
                            </Link>
                        </li>
                    )}
                </ul>
                <h1 className="logo">Articlify</h1>
            </div>
        </nav>
    )
}

export default Header