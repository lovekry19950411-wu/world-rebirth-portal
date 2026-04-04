import React, { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [email] = useState('lovekry19950411@gmail.com'); // 自動帶入你的 Email

  // 🎡 重生輪盤抽獎邏輯
  const handleLottery = async () => {
    setMessage('🎲 輪盤轉動中，請稍候...');
    try {
      const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, isSapphire: true }), // 預設開啟藍寶石加成
      });
      
      const data = await res.json();
      
      if (data.win) {
        setMessage(`🎊 恭喜！中獎了！獲得 ${data.prize} 寶石，已紀錄至試算表！`);
      } else {
        setMessage('😢 這次沒中獎，下次再接再厲！');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ 連線失敗，請檢查網路或 Vercel 日誌。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center">
        <h1 className="text-2xl font-extrabold mb-2 text-cyan-400">💎 TW_SPWU_ZH</h1>
        <h2 className="text-lg font-bold mb-6 text-gray-400">重生者門戶中心</h2>

        {/* 驗證成功區塊 */}
        <div className="bg-black/50 rounded-2xl p-6 mb-6 border border-green-900/30">
          <p className="text-yellow-500 font-mono text-sm mb-2">{email}</p>
          <p className="text-green-400 font-bold text-lg">✅ World ID 驗證成功</p>
          <p className="text-gray-400 text-sm mt-1">100 積分獎勵已發放</p>
        </div>

        <hr className="border-gray-800 mb-8" />

        {/* 🎡 抽獎區塊 */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-purple-400">🎡 重生輪盤</h3>
          <p className="text-gray-500 text-sm mb-4">每次啟動消耗 20 寶石</p>
          
          <button 
            onClick={handleLottery}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black py-4 rounded-2xl transition-all transform active:scale-95 shadow-lg shadow-purple-500/20"
          >
            啟動輪盤 🎲
          </button>

          {/* 訊息反饋 */}
          {message && (
            <div className="mt-4 p-4 bg-gray-800 rounded-xl text-sm border border-gray-700 animate-fade-in">
              {message}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-gray-600 text-[10px] tracking-widest uppercase">
        Next.js + Google Sheets + World ID Integration
      </footer>
    </div>
  );
}