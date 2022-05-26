import Link from 'next/link'
import React, { Key } from 'react'
import cl from "./TagsList.module.scss"

const TagsList: React.FC<{tags?: string[]}> = ({tags}) => {
  return (
    <div className={cl.tags}>
        {tags?.map((tag, _) => (
            <Link key={tag as Key} href={`/articles/?tags=${tag}`}>
              <a className={cl.tags__item}>{tag}</a>
            </Link>
        ))}
    </div>
  )
}

export default TagsList