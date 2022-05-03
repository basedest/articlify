import React, { Key } from 'react'

type Props = {
  tags: Array<String>
}

const TagsList = ({tags}: Props) => {
  return (
    <div className="tags">
        {tags?.map((tag, _) => (
          <div key={tag as Key} className="tags__item">
            {tag}
          </div>)
        )}
    </div>
  )
}

export default TagsList