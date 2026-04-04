// 將原本的 "@/styles/globals.css" 改為相對路徑 "../styles/globals.css"
// 如果你的 styles 資料夾是在根目錄，請確保路徑正確
import '../styles/globals.css' 
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}