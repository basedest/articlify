import Link from 'next/link'
import React, { Key } from 'react'

const TagsList: React.FC<{tags?: string[]}> = ({tags}) => {
  return (
    <div className="flex flex-1 items-center flex-wrap m-[6px_0_0_-3px] gap-2">
        {tags?.map((tag, _) => (
            <Link key={tag as Key} href={`/articles/?tags=${tag}`}>
              <a className="inline-block rounded-full px-3 pt-1 pb-1.5 
              border border-solid border-green-600 text-sm
              hover:bg-green-600 hover:text-white dark:hover:text-white"
              >{tag}</a>
            </Link>
        ))}
    </div>
  )
}

export default TagsList