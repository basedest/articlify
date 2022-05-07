import Link from "next/link"
import { signIn, signOut, useSession } from 'next-auth/react'
import UserMenu from "../UserMenu"
import DropDown from "../DropDown"

const options = [
    { href: '/art',     label: 'art'     },
    { href: '/games',   label: 'games'   },
    { href: '/it',      label: 'it'      },
    { href: '/movies',  label: 'movies'  },
    { href: '/music',   label: 'music'   },
    { href: '/science', label: 'science' },
    { href: '/sports',  label: 'sports'  },
    { href: '/travel',  label: 'travel'  },
    { href: '/other',   label: 'other'   },
]

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
                        <DropDown label='Categories' options={options} />
                    </li>
                    <li>
                        <Link href='/editor'>
                            <a>Editor</a>
                        </Link>
                    </li>
                    {!loading && !session && (
                        <li>
                            <Link href='/login'>
                            <a>
                                Sign In
                            </a>
                            </Link>
                        </li>
                    )}
                    {session && (
                        <li>
                            <UserMenu />
                        </li>
                    )}
                </ul>
                <h1 className="logo">Articlify</h1>
            </div>
        </nav>
    )
}

export default Header