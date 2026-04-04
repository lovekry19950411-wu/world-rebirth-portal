import React, { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const points = 100;

  const handleLottery = () => {
    setLoading(true);
    setMessage('⚡ 正在連結 World Chain 節點驗證身份...');
    setTimeout(() => {
      setMessage('🟢 驗證成功：重生能量已注入您的帳戶');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 flex items-center justify-center font-mono p-4">
      <div className="w-full max-w-md bg-[#0f111a] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">
              Wu Sheng-ping <span className="text-orange-500">ZH</span>
            </h1>
            <p className="text-[10px] text-slate-500 tracking-[0.2em] mt-2">ID: lovekry19950411</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-orange-500 font-bold tracking-widest mb-1 uppercase">Live Points</p>
            <p className="text-2xl font-black text-white">{points} <span className="text-xs text-slate-500">PTS</span></p>
          </div>
        </div>

        <div className="text-center py-4">
          <div className="text-7xl mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">💎</div>
          <h2 className="text-lg font-black text-white mb-1 uppercase">Sapphire Reborn</h2>
          <button 
            onClick={handleLottery}
            disabled={loading}
            className="w-full py-4 mt-8 bg-orange-500 hover:bg-orange-600 text-black font-black rounded-xl border border-orange-400"
          >
            {loading ? 'VERIFYING...' : 'EXECUTE LOTTERY'}
          </button>
        </div>

        {message && (
          <div className="mt-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl text-[11px] text-center text-orange-200">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}