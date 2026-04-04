import React, { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const points = 100; // 積分直接顯示

  const handleRun = () => {
    setLoading(true);
    setMessage('⚡ 正在連結 World Chain 節點...');
    setTimeout(() => {
      setMessage('🟢 驗證完成：獲得 100 積分獎勵');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 flex items-center justify-center font-mono p-4">
      {/* 科技感外框 */}
      <div className="w-full max-w-md bg-[#0f111a] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* 頂部：個人資訊與積分 */}
        <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">
              Wu Sheng-ping <span className="text-orange-500">ZH</span>
            </h1>
            <p className="text-[10px] text-slate-500 tracking-[0.2em] mt-1">TW_SPWU_ZH PROTOCOL</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-orange-500 font-bold tracking-widest mb-1 uppercase">Balance</p>
            <p className="text-2xl font-black text-white">{points} <span className="text-xs text-slate-500">PTS</span></p>
          </div>
        </div>

        {/* 主區塊 */}
        <div className="text-center py-6">
          <div className="text-6xl mb-6 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">💎</div>
          <h2 className="text-lg font-bold text-white mb-2">藍寶石重生輪盤</h2>
          <p className="text-xs text-slate-500 mb-8 font-bold italic">Verification-as-a-Service</p>
          
          <button 
            onClick={handleRun}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-black transition-all border ${
              loading 
              ? 'bg-transparent border-white/10 text-slate-600' 
              : 'bg-orange-500 hover:bg-orange-600 text-black border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
            }`}
          >
            {loading ? 'EXECUTING...' : 'EXECUTE LOTTERY'}
          </button>
        </div>

        {/* 狀態顯示 */}
        {message && (
          <div className="mt-4 p-3 bg-black/40 border border-white/5 rounded text-[11px] text-center text-orange-200 animate-pulse">
            {message}
          </div>
        )}

        {/* 下方連結 */}
        <div className="grid grid-cols-2 gap-3 mt-10">
          <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
            <p className="text-[10px] font-bold text-slate-400">📊 OTC TRADE</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
            <p className="text-[10px] font-bold text-slate-400">🌍 RELIEF</p>
          </div>
        </div>
      </div>
    </div>
  );
}