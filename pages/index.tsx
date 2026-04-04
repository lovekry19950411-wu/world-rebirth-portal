import React, { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState('---'); // 模擬讀取分數
  const [email] = useState('lovekry19950411@gmail.com');

  const handleLottery = async () => {
    setLoading(true);
    setMessage('🔮 正在感應 World Chain 節點...');
    
    // 延遲 1.5 秒增加儀式感
    setTimeout(async () => {
      try {
        const res = await fetch('/api/lottery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, isSapphire: true }),
        });
        const data = await res.json();
        setMessage(data.win ? `🎊 成功中獎！獲得 ${data.prize} 藍寶石！` : '😢 能量感應較弱，這次未中獎。');
        setLoading(false);
      } catch (err) {
        setMessage('❌ 連線失敗');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white p-6 font-sans">
      <div className="max-w-md w-full bg-[#0f172a] border border-blue-500/30 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(30,58,138,0.5)]">
        
        {/* 頂部：身份與分數 */}
        <div className="flex justify-between items-center mb-10 bg-blue-950/40 p-4 rounded-2xl border border-blue-400/20">
          <div className="text-left">
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">ID Verified</p>
            <p className="text-xs font-mono opacity-60">{email.split('@')[0]}...</p>
          </div>
          <div className="text-right">
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Current Points</p>
            <p className="text-xl font-black text-cyan-400">{points} PTS</p>
          </div>
        </div>

        {/* 中間：主標題 */}
        <h1 className="text-3xl font-black text-center mb-2 bg-gradient-to-b from-white to-blue-400 bg-clip-text text-transparent">
          SAPPHIRE PORTAL
        </h1>
        <p className="text-center text-blue-300/50 text-xs tracking-[0.2em] mb-10 font-bold">重生者專屬能量轉盤</p>

        {/* 抽獎區 */}
        <div className="relative group mb-10">
          <div className={`text-6xl text-center mb-6 transition-all duration-500 ${loading ? 'animate-spin scale-110' : 'animate-bounce'}`}>
            {loading ? '🌀' : '💎'}
          </div>
          
          <button 
            onClick={handleLottery}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black transition-all ${
              loading 
              ? 'bg-slate-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95'
            }`}
          >
            {loading ? '處理中...' : '啟動重生感應'}
          </button>

          {message && (
            <div className="mt-6 p-4 bg-black/40 rounded-xl text-sm border border-blue-900/30 text-blue-200 text-center animate-fade-in">
              {message}
            </div>
          )}
        </div>

        {/* 下選單：其他入口 */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="bg-slate-800/50 hover:bg-slate-700 p-3 rounded-xl border border-white/5 text-[10px] font-bold tracking-tighter">
            💰 買賣藍寶石 (OTC)
          </button>
          <button className="bg-slate-800/50 hover:bg-slate-700 p-3 rounded-xl border border-white/5 text-[10px] font-bold tracking-tighter">
            🛡️ 認證/領取 100 積分
          </button>
          <button className="bg-slate-800/50 hover:bg-slate-700 p-3 rounded-xl border border-white/5 text-[10px] font-bold tracking-tighter col-span-2">
            🌍 Starmaker On-Chain Emergency Relief
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-slate-600 text-[10px] font-bold tracking-[0.4em]">TW_SPWU_ZH PROTOCOL v2.0</p>
    </div>
  );
}