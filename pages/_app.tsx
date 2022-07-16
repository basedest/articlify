import '../styles/globals.scss'
import { SessionProvider } from "next-auth/react"
import Footer from '../components/Footer'
import Header from '../components/Header'
import { ThemeProvider } from 'next-themes'

export default function MyApp({ Component, pageProps }:any) {
  if (Component.getLayout) {
    return (
      <SessionProvider  session={pageProps.session} refetchInterval={0}>
        {Component.getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    )
  }
  return (
      <ThemeProvider enableSystem={true} attribute="class">
        <SessionProvider  session={pageProps.session} refetchInterval={0}>
          <Header />
          <main className="
            flex flex-col min-h-screen justify-center items-center
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
