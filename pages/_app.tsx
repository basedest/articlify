import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Footer from '../components/Footer'
import Header from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <SessionProvider  session={pageProps.session} refetchInterval={0}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
  )
}

export default MyApp
