import React, { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [email] = useState('lovekry19950411@gmail.com'); // 預設使用你的 Email

  // 🎡 重生輪盤功能
  const handleLottery = async () => {
    setMessage('🎲 輪盤轉動中...');
    try {
      const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, isSapphire: true }), // 預設測試藍寶石權限
      });
      const data = await res.json();
      if (data.win) {
        setMessage(`🎊 恭喜！獲得了 ${data.prize} 寶石！請查看試算表。`);
      } else {
        setMessage('😢 可惜沒中獎，下次再試試！');
      }
    } catch (err) {
      setMessage('❌ 系統錯誤，請確認網路連線。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4 text-cyan-400">💎 TW_SPWU_ZH 重生者門戶</h1>
      
      {/* 積分領取狀態 */}
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-gray-800">
        <h2 className="text-xl text-yellow-500 font-bold mb-4">帳戶：{email}</h2>
        <p className="text-green-400 font-bold mb-6">✅ 100 積分已自動入帳！</p>
        
        <hr className="border-gray-700 mb-6" />

        {/* 🎡 新功能：重生輪盤 */}
        <h3 className="text-lg font-bold mb-4">🎡 重生輪盤中心</h3>
        <button 
          onClick={handleLottery} 
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
        >
          啟動輪盤 (消耗 20 寶石)
        </button>
        
        {/* 訊息顯示區 */}
        {message && (
          <p className="mt-4 p-3 bg-black rounded-lg border border-gray-700 text-sm animate-pulse">
            {message}
          </p>
        )}
      </div>

      <p className="mt-8 text-gray-500 text-xs">系統自動化運行中：Next.js + Google Sheets + World ID</p>
    </div>
  );
}