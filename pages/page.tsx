// 你的核心按鈕邏輯
<div className="flex flex-col gap-4">
  {/* 區塊 A：驗證領錢 (流量池) */}
  <button className="bg-blue-600 p-4 rounded-xl">World ID 驗證領 100 寶石</button>

  {/* 區塊 B：升級藍寶石 (利潤池) */}
  <div className="border-2 border-amber-400 p-4 rounded-xl bg-black">
    <p className="text-amber-400">💎 藍寶石會員 (支持 10 WLD)</p>
    <button className="bg-amber-400 text-black px-4 py-2 mt-2 font-bold rounded">立即升級</button>
  </div>

  {/* 區塊 C：抽獎中心 */}
  <button onClick={handleLottery} className="bg-white text-black p-4 rounded-xl font-bold">
    🎡 啟動重生輪盤 (消耗 20 寶石)
  </button>
</div>