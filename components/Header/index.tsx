import Link from "next/link"
import { useSession } from 'next-auth/react'
import UserMenu from "../UserMenu"
import DropDown from "../DropDown"
import { categories } from "../../lib/lib"

const options = categories.map(item => {
    return {
        href: `/${item}`,
        label: item
    }
})

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
                <h1 className="logo">
                    <Link href='/'>
                        <a>Articlify</a>
                    </Link>
                </h1>
            </div>
        </nav>
    )
}

export default Header