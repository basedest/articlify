import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Footer from '../components/Footer'
import Header from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
  if (Component.getLayout) {
    return (
      <SessionProvider  session={pageProps.session} refetchInterval={0}>
        {Component.getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    )
  }
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
