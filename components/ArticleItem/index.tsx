import Image from "next/image"
import Link from "next/link"
import { Article } from "../../lib/ArticleTypes"
import TagsList from "../TagsList"

const ArticleItem:React.FC<Article> = props => {
    const img = props.img ?? `/img/${props.category}.png`
    return (
        <div className='articleList'>
            <article className='articleItem'>
                <Image
                    alt='Image for article'
                    className='articleItem__pic'
                    width={2} height={1}
                    layout='responsive'
                    priority={true}
                    src={`${img}`}
                />
                <div className='articleItem__info'>
                    <Link href={`/${props.category}/${props.slug}`}>
                        <a className='articleItem__title'>{props.title}</a>
                    </Link>
                    <p className='articleItem__text'>
                        {props.description}
                    </p>
                    <div className='articleItem__etc'>
                        <p>{props.author}</p>
                        <p>•</p>
                        <p>{new Date(props.createdAt).toDateString()}</p>
                    </div>
                    <TagsList tags={props.tags} />
                </div>
            </article>
        </div>
    )
}

export default ArticleItem