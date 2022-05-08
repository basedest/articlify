import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import Link from 'next/link'

const UserMenu = () => {
    const ref = useRef(null)
    const handleClick = () => {
        ref.current.classList.toggle('show')
    }
    const { data: session } = useSession()

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
    <div ref={ref} className='user-menu'>
        <div className="avatar">
            {
            session?.user?.image
            ? <Image src={session.user.image} width={1} height={1} layout='responsive' alt='icon' />
            : <img src='/img/user.svg'/>
            }
        </div>
        <button className='user-menu__btn' onClick={handleClick}>
            <a
            >
                {session.user.name}
            </a>
            <svg className='arrow' viewBox="0 0 1024 1024"><path d="M476.455 806.696L95.291 425.532Q80.67 410.911 80.67 390.239t14.621-34.789 35.293-14.117 34.789 14.117L508.219 698.8l349.4-349.4q14.621-14.117 35.293-14.117t34.789 14.117 14.117 34.789-14.117 34.789L546.537 800.142q-19.159 19.159-38.318 19.159t-31.764-12.605z"></path></svg>
        </button>
        <ul className="user-menu__content">
            <li>
                <Link href='/dashboard'>
                    <a>Profile</a>
                </Link>
            </li>
            <li>
                <a onClick={(e) => { signOut()}}>Sign Out</a>
            </li>
        </ul>
    </div>
    )
}

export default UserMenu