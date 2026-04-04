import '../styles/globals.css' // 這是正確的相對路徑
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}