import React, { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  // 1. 定義抽獎功能 (這就是剛才報錯缺少的內容)
  const handleLottery = async () => {
    setMessage('抽獎中...');
    try {
      const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', isSapphire: false }),
      });
      const data = await res.json();
      if (data.win) {
        setMessage(`恭喜！獲得了 ${data.prize} 寶石！`);
      } else {
        setMessage('可惜沒中獎，再試一次吧！');
      }
    } catch (err) {
      setMessage('抽獎失敗，請檢查網路。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-8">TW_SPWU_ZH 重生門戶</h1>
      
      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl text-center">
        <p className="mb-4">{message || "準備好試試手氣了嗎？"}</p>
        
        {/* 區塊 C：抽獎中心 */}
        <button 
          onClick={handleLottery} 
          className="bg-white text-black p-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          🎡 啟動重生輪盤 (消耗 20 寶石)
        </button>
      </div>
    </div>
  );
}