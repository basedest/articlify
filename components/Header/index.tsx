import Link from "next/link"

const Header = () => {

  return (
        <header>
            <a href="#" className="logo">Articlify</a>
            <ul>
                <li>
                    <Link href='/'>
                        <a>Главная</a>
                    </Link>
                </li>
                <li>
                    <Link href='/category'>
                        <a>Категории</a>
                    </Link>
                </li>
                <li>
                    <Link href='/editor'>
                        <a>Редактор</a>
                    </Link>
                </li>
                <li>
                    <Link href='/about'>
                        <a>О нас</a>
                    </Link>
                </li>
            </ul>
        </header>
  )
}

export default Header