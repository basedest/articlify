import Link from "next/link"
import { useEffect, useRef } from "react"

interface Props {
    options: {
        label: string
        href: string
    }[]
    label: string
}

const DropDown: React.FC<Props> = ({options, label}) => {
    const ref = useRef<HTMLDivElement>(null)
    const handleClick = () => {
        ref?.current?.classList.toggle('show')
    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                ref.current.classList.remove('show')
            }
        }
        document.addEventListener('click', handleClickOutside, true)
        return () => {
        document.removeEventListener('click', handleClickOutside, true)
        }
    })

    return (
        <div ref={ref} className='dropdown'>
        <button className='dropdown__btn' onClick={handleClick}>
            {label}
            <svg className='arrow' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <ul className="dropdown__content bg-white dark:bg-neutral-900">
            {
                options.map((option, _) => (
                    <li key={option.label}>
                        <Link href={option.href}>
                            <a>{option.label}</a>
                        </Link>
                    </li>
                ))
            }
        </ul>
    </div>
    )
}

export default DropDown