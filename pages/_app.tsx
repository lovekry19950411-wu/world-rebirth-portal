// import '../styles/globals.css'  // 暫時註解掉，不加載外部 CSS
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}