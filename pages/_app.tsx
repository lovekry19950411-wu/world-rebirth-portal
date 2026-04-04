import '@/styles/globals.css' // 確保這行路徑正確指向你的 CSS
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}