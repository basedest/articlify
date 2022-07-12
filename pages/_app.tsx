import '../styles/globals.scss'
import { SessionProvider } from "next-auth/react"
import Footer from '../components/Footer'
import Header from '../components/Header'
import { ThemeProvider } from 'next-themes'

//общая структура каждой страницы
export default function MyApp({ Component, pageProps }:any) {
  //Если у компонента определена собственная структура
  if (Component.getLayout) {
    return (
      <SessionProvider  session={pageProps.session} refetchInterval={0}>
        {Component.getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    )
  }
  //Иначе оборачиваем всё в main и добавляем Header и Footer
  return (
      <ThemeProvider enableSystem={true} attribute="class">
        <SessionProvider  session={pageProps.session} refetchInterval={0}>
          <Header />
          <main className="
            flex flex-col flex-1 min-h-screen justify-center items-center
            bg-neutral-100 text-black
            dark:bg-neutral-900 dark:text-white
          ">
            <Component {...pageProps} />
          </main>
          <Footer />
        </SessionProvider>
      </ThemeProvider>
  )
}
