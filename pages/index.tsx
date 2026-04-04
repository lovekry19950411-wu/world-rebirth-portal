import React, { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [email] = useState('lovekry19950411@gmail.com');

  const handleLottery = async () => {
    setMessage('🔮 正在抽取能量...');
    try {
      const res = await fetch('/api/lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, isSapphire: true }),
      });
      const data = await res.json();
      setMessage(data.win ? `🎊 中獎！獲得 ${data.prize} 能量！` : '😢 這次未中獎。');
    } catch (err) {
      setMessage('❌ 連線失敗');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="max-w-md w-full bg-slate-900 border border-blue-900/50 rounded-3xl p-8 text-center">
        <h1 className="text-3xl font-black mb-2 text-blue-400">💎 Sapphire Project</h1>
        <p className="mb-8 text-blue-300/70 text-sm">{email}</p>
        <button onClick={handleLottery} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all">
          立即抽取獎勵 🎲
        </button>
        {message && <div className="mt-4 p-4 bg-black/40 rounded-xl text-blue-200">{message}</div>}
      </div>
    </div>
  );
}