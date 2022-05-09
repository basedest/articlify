import Link from 'next/link'
import React, { Key } from 'react'

type Props = {
  tags: Array<String>
}

const TagsList = ({tags}: Props) => {
  return (
    <div className="tags">
        {tags?.map((tag, _) => (
          <div key={tag as Key} className="tags__item">
            <Link href={`/articles/?tags=${tag}`}>
              <a>{tag}</a>
            </Link>
          </div>)
        )}
    </div>
  )
}

export default TagsList