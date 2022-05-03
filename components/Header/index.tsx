import Link from "next/link"

const Header:React.FC = () => {

  return (
        <header>
            <a href="#" className="logo">Articlify</a>
            <ul>
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
                <li>
                    <Link href='/about'>
                        <a>About</a>
                    </Link>
                </li>
            </ul>
        </header>
  )
}

export default Header