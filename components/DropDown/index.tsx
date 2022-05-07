import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface Props {
    options: {
        label: string
        href: string
    }[]
    label: string
}

const DropDown = ({options, label}: Props) => {
    const ref = useRef(null)
    const handleClick = () => {
        ref.current.classList.toggle('show')
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                ref.current.classList.remove('show')
            }
        }
        document.addEventListener('click', handleClickOutside, true);
        return () => {
        document.removeEventListener('click', handleClickOutside, true);
        }
    })

    return (
        <div ref={ref} className='dropdown'>
        <button className='dropdown__btn' onClick={handleClick}>
            {label}
            <svg className='arrow' viewBox="0 0 1024 1024"><path d="M476.455 806.696L95.291 425.532Q80.67 410.911 80.67 390.239t14.621-34.789 35.293-14.117 34.789 14.117L508.219 698.8l349.4-349.4q14.621-14.117 35.293-14.117t34.789 14.117 14.117 34.789-14.117 34.789L546.537 800.142q-19.159 19.159-38.318 19.159t-31.764-12.605z"></path></svg>
        </button>

        <ul className="dropdown__content">
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