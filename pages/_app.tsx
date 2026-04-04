import type { AppProps } from 'next/app'

// 徹底移除 import '../styles/globals.css' 以解決 Vercel 編譯錯誤
// 我們改用全域行內樣式來維持 UI 的純淨度

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        /* 強制重置全域樣式，確保藍寶石協議介面不跑位 */
        html,
        body {
          padding: 0;
          margin: 0;
          background-color: #05070a; /* 配合藍寶石深色背景 */
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        /* 移除藍色點選框，維持專業 Web3 感 */
        button, input {
          outline: none;
        }

        /* 自定義捲軸樣式 (Sapphire Style) */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #05070a;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}