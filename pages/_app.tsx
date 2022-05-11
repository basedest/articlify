import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Footer from '../components/Footer'
import Header from '../components/Header'

//общая структура каждой страницы
function MyApp({ Component, pageProps }: AppProps) {
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
      <SessionProvider  session={pageProps.session} refetchInterval={0}>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </SessionProvider>
  )
}


export default MyApp
