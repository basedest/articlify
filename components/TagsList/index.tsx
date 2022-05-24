import Link from 'next/link'
import React, { Key } from 'react'
import cl from "./TagsList.module.scss"

const TagsList: React.FC<{tags?: string[]}> = ({tags}) => {
  return (
    <div className={cl.tags}>
        {tags?.map((tag, _) => (
          <div key={tag as Key} className={cl.tags__item} >
            <Link href={`/articles/?tags=${tag}`}>
              <a>{tag}</a>
            </Link>
          </div>)
        )}
    </div>
  )
}

export default TagsList