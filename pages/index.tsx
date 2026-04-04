import React, { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<number | string>('...'); 
  const [email] = useState('lovekry19950411@gmail.com');

  // 模擬從 Google Sheets 獲取積分
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await fetch(`/api/get-points?email=${email}`);
        const data = await res.json();
        setPoints(data.points || 100); // 如果沒讀到，暫時顯示 100
      } catch {
        setPoints(100); 
      }
    };
    fetchPoints();
  }, [email]);

  const handleLottery = async () => {
    setLoading(true);
    setMessage('⚡ 正在連線 World Chain 驗證節點...');
    setTimeout(async () => {
      try {
        const res = await fetch('/api/lottery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, isSapphire: true }),
        });
        const data = await res.json();
        setMessage(data.win ? `🟢 驗證成功：獲得 ${data.prize} 藍寶石能量` : '🔴 能量不足：本次未中獎');
        setLoading(false);
      } catch (err) {
        setMessage('❌ 系統異常');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-[#e2e8f0] flex flex-col items-center justify-center p-4 font-mono">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* 外框 */}
        <div className="bg-[#0f111a] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          
          {/* 頭部：BTC 科技感儀表板 */}
          <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                WU SHENG-PING <span className="text-orange-500">ZH</span>
              </h1>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em]">Reborn Protocol v2.0</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-1">Live Balance</p>
              <p className="text-2xl font-black text-white leading-none">{points} <span className="text-xs text-slate-500">PTS</span></p>
            </div>
          </div>

          {/* 用戶資訊 */}
          <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5">
            <div className="flex items-center justify-between text-[10px] mb-2 text-slate-400">
              <span>OPERATOR ID</span>
              <span className="text-green-500 text-[8px] border border-green-500/50 px-2 py-0.5 rounded">AUTHENTICATED</span>
            </div>
            <p className="text-sm font-bold text-slate-200">{email}</p>
          </div>

          {/* 轉盤核心區 */}
          <div className="py-10 text-center relative">
            <div className={`text-7xl mb-6 inline-block transition-all duration-700 ${loading ? 'animate-spin opacity-50' : 'drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]'}`}>
              {loading ? '⚙️' : '💎'}
            </div>
            <h2 className="text-lg font-bold mb-1">藍寶石重生輪盤</h2>
            <p className="text-xs text-slate-500 mb-8 font-bold italic">PROBABILISTIC REWARD SYSTEM</p>

            <button 
              onClick={handleLottery}
              disabled={loading}
              className={`w-full py-4 rounded-lg font-black transition-all border ${
                loading 
                ? 'bg-transparent border-white/10 text-slate-600' 
                : 'bg-orange-500 hover:bg-orange-600 text-black border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-[0.98]'
              }`}
            >
              {loading ? 'CONNECTING TO CHAIN...' : 'EXECUTE LOTTERY'}
            </button>
          </div>

          {/* 狀態訊息 */}
          {message && (
            <div className="mt-4 p-4 bg-black/60 rounded-lg border border-white/10 text-xs font-bold text-center animate-pulse">
              {message}
            </div>
          )}

          {/* 功能入口 */}
          <div className="grid grid-cols-2 gap-3 mt-10">
            <a href="#" className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
              <span className="text-lg mb-1">📊</span>
              <span className="text-[10px] font-bold text-slate-400">OTC TRADE</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
              <span className="text-lg mb-1">🌍</span>
              <span className="text-[10px] font-bold text-slate-400">RELIEF PROJECT</span>
            </a>
          </div>
        </div>

        {/* 底部頁腳 */}
        <div className="mt-10 text-center">
          <p className="text-[9px] text-slate-600 font-bold tracking-[0.5em] uppercase">
            Decentralized Identity Verification • World ID V2
          </p>
        </div>
      </div>
    </div>
  );
}