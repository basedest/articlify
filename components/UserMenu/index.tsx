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
                session?.user.image
            ?   <Image src={session.user.image} width={1} height={1} layout='responsive' alt='icon' />
            :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
            }
        </div>
        <button className='user-menu__btn' onClick={handleClick}>
            <a
            >
                {session.user?.name}
            </a>
            <svg className='arrow' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
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