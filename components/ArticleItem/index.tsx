import Image from "next/image"
import Link from "next/link"
import { Article } from "../../lib/ArticleTypes"

const ArticleItem = (props: Article) => {
    const img = props.img ?? `/img/${props.category}.jpg`
    return (
        <div className='articleList'>
            <article className='articleItem'>
                <Image
                    alt='Image for article'
                    className='articleItem__pic'
                    width={600} height={300}
                    src={`${img}`}
                />
                <div className='articleItem__info'>
                    <Link href={props.slug}>
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
                </div>
            </article>
        </div>
    )
}

export default ArticleItem