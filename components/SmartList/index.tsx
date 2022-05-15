import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Article } from "../../lib/ArticleTypes";
import ArticleList from "../ArticleList";
import MyInput from "../input/MyInput";

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
    //устанавливаем запрос для поиска при вводе
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    }
  
    //устанавливаем строку поиска как параметр запроса
    const handleSearch = async (e) => {
      router.push(`${basepath}/?title=${searchQuery}`)
    }
  
    //очищаем ввод
    const clearInput = (e) => {
      setSearchQuery('')
      router.push(basepath)
      setCaption('Latest articles')
    }
  
    //устанавливаем надпись в зависимости от состояния списка
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
    
    const changePage = page => {
      console.log(router.asPath.split("?")[0])
      router.push(`${basepath}/${searchQuery ? `?title=${searchQuery}&` : '?'}page=${page}`)
    }

    return (
        <>
          <div className="searchbar">
            <MyInput
                  value={searchQuery}
                  onChange={handleChange}
                  placeholder="Search by title..."
              />
            <button className='search' onClick={handleSearch}>Search</button>
            <button className='clear' onClick={clearInput}>Clear</button>
          </div>
          <h2 className='accented'>{caption}</h2>
          <ArticleList articles={props.articles} />
          <div className='navigation'>
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