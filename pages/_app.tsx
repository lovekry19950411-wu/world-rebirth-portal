// 這次不使用相對路徑，直接使用 globals.css
// 只要 globals.css 跟 _app.tsx 在同一個專案層級，Next.js 就能抓到
import '../styles/globals.css' 
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}