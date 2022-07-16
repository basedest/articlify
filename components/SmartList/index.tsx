import { useRouter } from "next/router"
import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import { Article } from "../../lib/ArticleTypes"
import ArticleList from "../ArticleList"
import MyInput from "../input/MyInput"
import cl from "./SmartList.module.scss"

interface IProps {
    articles: Article[]
    page: number
    searchQuery: string
  }

export default function SmartList(props: IProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [caption, setCaption] = useState('Latest articles')
    const basepath = router.asPath.split("?")[0]
    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    }
  
    const handleSearch = async (e: MouseEvent<HTMLButtonElement>) => {
      router.push(`${basepath}/?title=${searchQuery}`)
    }
  
    const clearInput = (e:MouseEvent<HTMLButtonElement>) => {
      setSearchQuery('')
      router.push(basepath)
      setCaption('Latest articles')
    }
  
    useEffect(() => {
      if (props.articles.length === 0) {
        setCaption('No articles')
      }
      else if (props.searchQuery) {
        setCaption(`Search result [${props.page}]`)
      }
      else {
        setCaption(`Latest articles [${props.page}]`)
      }
    }, [props.articles, props.searchQuery, props.page])
    
    const changePage = (page:number) => {
      router.push(`${basepath}/${searchQuery ? `?title=${searchQuery}&` : '?'}page=${page}`)
    }

    return (
        <>
          <div className={cl.searchbar}>
            <MyInput
                  value={searchQuery}
                  onChange={handleChange}
                  placeholder="Search by title..."
              />
            <button className={cl.search} onClick={handleSearch}>Search</button>
            <button className={cl.clear} onClick={clearInput}>Clear</button>
          </div>
          <h2 className='accented'>{caption}</h2>
          <ArticleList articles={props.articles} />
          <div className={cl.navigation}>
            <button
              onClick={() => changePage(props.page-1)}
              disabled={props.page <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              onClick={() => changePage(props.page+1)}
              disabled={props.articles.length < 5}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </>
    )
}