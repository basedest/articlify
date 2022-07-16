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

const ArticleItem:React.FC<Article> = props => {
    const img = props.img ?? `/img/${props.category}.png`
    const { data: session } = useSession()
    const [modal, setModal] = useState(false)
    const router = useRouter()
    return (
        <>
            <Modal visible={modal} setVisible={setModal}>
                <div className="flex flex-col content-center gap-6 text-2xl">
                    <span className="text-center">
                        Do you really want to delete this article?
                    </span>
                    <div className="flex place-content-center gap-4">
                        <button 
                            className="rounded-2xl px-3 pb-2 pt-1 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500"
                            onClick={() => setModal(false)}
                        >
                            No
                        </button>
                        <button 
                            className="rounded-2xl px-3 pb-2 pt-1 bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 "
                            onClick={ () => {
                            deleteArticle(props.slug, () => router.replace(router.asPath))
                            setModal(false)
                        }}>
                            Yes
                        </button>
                    </div>
                </div>
            </Modal>
            <article className="w-full h-fit items-center rounded-2xl shadow-lg bg-white dark:bg-neutral-800">
                <Link href={`/${props.category}/${props.slug}`}>
                    <a>
                        <Image
                            alt='Image for article'
                            className='object-cover w-full rounded-2xl block border-none'
                            width={2} height={1}
                            layout='responsive'
                            priority={true}
                            src={img}
                        />
                    </a>
                </Link>
                <div className="flex flex-col p-4">
                    <Link href={`/${props.category}/${props.slug}`}>
                        <a className="transition-all font-semibold text-4xl">{props.title}</a>
                    </Link>
                    <p className="text-lg uppercase font-semibold">
                        <Link href={`/${props.category}`}>
                            <a className="text-neutral-400 tracking-wide hover:text-fuchsia-600 dark:text-neutral-500 dark:hover:text-fuchsia-500">{props.category}</a>
                        </Link>
                    </p>
                    <p className="mt-3 mb-6 font-light text-lg text-neutral-500 dark:text-neutral-400">
                        {props.description}
                    </p>
                    <div className="flex gap-2">
                        <p>@{props.author}</p>
                        <p>•</p>
                        <p>{new Date(props.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex mt-4 items-end">
                        <TagsList tags={props.tags} />
                        {
                            checkPriveleges(session?.user as User, props.author)
                            &&
                            <div className="flex justify-center gap-1">
                                <button 
                                className="rounded-xl bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white py-1 px-3 hover:text-white
                                 hover:bg-green-600 dark:hover:bg-green-600"
                                onClick={() => {
                                    router.push(`/editor?edit=${props.slug}`)
                                }}>
                                    edit
                                </button>
                                <button className="rounded-xl bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white py-1 px-3 hover:text-white
                                hover:bg-red-600 dark:hover:bg-red-600"
                                onClick={() => setModal(true)}>
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