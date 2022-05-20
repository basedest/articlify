import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { Article } from "../../lib/ArticleTypes"
import checkPriveleges from "../../lib/client/checkPriveleges"
import deleteArticle from "../../lib/client/deleteArticle"
import { User } from "../../lib/UserTypes"
import Modal from "../Modal"
import TagsList from "../TagsList"
import cl from "./ArticleItem.module.scss"

const ArticleItem:React.FC<Article> = props => {
    const img = props.img ?? `/img/${props.category}.png`
    const { data: session } = useSession()
    const [modal, setModal] = useState(false)
    const router = useRouter()
    return (
        <>
            <Modal visible={modal} setVisible={setModal}>
                <div className={cl.articleItem__confirm}>
                    <span className={cl.articleItem__confirm_text}>
                        Do you really want to delete this article?
                    </span>
                    <div className={cl.articleItem__confirm_buttons}>
                        <button onClick={() => setModal(false)}>
                            No
                        </button>
                        <button onClick={ () => {
                            deleteArticle(props.slug, () => router.replace(router.asPath))
                            setModal(false)
                        }}>
                            Yes
                        </button>
                    </div>
                </div>
            </Modal>
            <article className={cl.articleItem}>
                <Image
                    alt='Image for article'
                    className={cl.articleItem__pic}
                    width={2} height={1}
                    layout='responsive'
                    priority={true}
                    src={img}
                />
                <div className={cl.articleItem__info}>
                    <Link href={`/${props.category}/${props.slug}`}>
                        <a className={cl.articleItem__title}>{props.title}</a>
                    </Link>
                    <p className={cl.articleItem__category}>
                        <Link href={`/${props.category}`}>
                            <a>{props.category}</a>
                        </Link>
                    </p>
                    <p className={cl.articleItem__text}>
                        {props.description}
                    </p>
                    <div className={cl.articleItem__etc}>
                        <p>@{props.author}</p>
                        <p>•</p>
                        <p>{new Date(props.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={cl.wrapper}>
                        <TagsList tags={props.tags} />
                        {
                            checkPriveleges(session?.user as User, props.author)
                            &&
                            <div className={cl.articleItem__actions}>
                                <button className={cl.edit} onClick={() => {
                                    router.push(`/editor?edit=${props.slug}`)
                                }}>
                                    edit
                                </button>
                                <button className={cl.delete} onClick={() => setModal(true)}>
                                    delete
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </article>
        </>
    )
}

export default ArticleItem