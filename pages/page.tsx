import React, { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [email] = useState('lovekry19950411@gmail.com');

  const handleLottery = async () => {
    setMessage('🔮 正在抽取藍寶石能量...');
    try {
      const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, isSapphire: true }),
      });
      const data = await res.json();
      if (data.win) {
        setMessage(`🎊 成功中獎！獲得 ${data.prize} 藍寶石能量！`);
      } else {
        setMessage('😢 能量感應較弱，這次未中獎。');
      }
    } catch (err) {
      setMessage('❌ 連線失敗，請檢查 Vercel 部署。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-blue-900/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(30,58,138,0.3)] text-center">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          💎 Sapphire Project
        </h1>
        <h2 className="text-xs font-bold mb-8 text-blue-400/80 tracking-[0.2em] uppercase">
          藍寶石重生輪盤中心
        </h2>

        <div className="bg-blue-950/30 rounded-2xl p-6 mb-8 border border-blue-500/20">
          <p className="text-blue-300 font-mono text-xs mb-2 opacity-70">{email}</p>
          <p className="text-green-400 font-bold">✅ World ID 身份已驗證</p>
        </div>

        <div className="space-y-6">
          <div className="text-4xl mb-2 animate-bounce">🔮</div>
          <button 
            onClick={handleLottery}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            立即抽取獎勵 🎲
          </button>

          {message && (
            <div className="mt-4 p-4 bg-black/40 rounded-xl text-sm border border-blue-900/30 text-blue-200">
              {message}
            </div>
          )}
        </div>
      </div>
      <footer className="mt-12 text-slate-700 text-[10px] tracking-[0.3em] uppercase font-bold">
        Sapphire Protocol • On-Chain Identity
      </footer>
    </div>
  );
}