import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // 確保客戶端渲染以避免 hydration 錯誤
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = (type: string) => {
    setLoading(true);
    const msgs: Record<string, string> = {
      lottery: '⚡ 正在連結 World Chain 節點驗證身份...',
      otc: '📊 正在載入 OTC 交易深度表...',
      relief: '🌍 正在同步 On-Chain 救助數據...'
    };
    setMessage(msgs[type] || '處理中...');
    
    setTimeout(() => {
      setLoading(false);
      setMessage(`🟢 執行成功：${type === 'lottery' ? '重生能量已注入' : '模組已準備就緒'}`);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 font-mono selection:bg-orange-500/30">
      <Head>
        <title>Wu Sheng-ping | Reborn Portal</title>
      </Head>

      {/* 背景動態光暈 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-lg">
          
          {/* 頂部裝飾條 */}
          <div className="flex items-center gap-2 mb-8 opacity-50">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] tracking-[0.4em] uppercase">Identity Verified</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <div className="bg-[#0f111a]/80 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl">
            
            {/* 個人品牌頭部 */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">
                  Wu Sheng-ping <span className="text-orange-500">ZH</span>
                </h1>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <p className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">Node: TW_SPWU_ZH</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-orange-500 font-black tracking-widest mb-1 uppercase">Reborn Pts</p>
                <div className="bg-white/5 px-4 py-1 rounded-full border border-white/5">
                  <span className="text-xl font-black text-white italic">100.00</span>
                </div>
              </div>
            </div>

            {/* 核心功能：重生輪盤 */}
            <div className="group relative bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-8 mb-8 overflow-hidden transition-all hover:border-orange-500/30">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="text-6xl italic font-black">REBORN</span>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform duration-500">💎</div>
                <h2 className="text-sm font-bold text-slate-400 mb-6 tracking-[0.3em] uppercase">Sapphire Energy Portal</h2>
                
                <button 
                  onClick={() => handleAction('lottery')}
                  disabled={loading}
                  className="w-full py-5 bg-orange-500 hover:bg-orange-400 text-black font-black rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.2)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                  {loading ? 'EXECUTING PROTOCOL...' : 'LAUNCH REBORN'}
                </button>
              </div>
            </div>

            {/* 次要功能入口 */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAction('otc')} className="flex flex-col items-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">OTC Desk</span>
              </button>
              <button onClick={() => handleAction('relief')} className="flex flex-col items-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all">
                <span className="text-2xl mb-2">🌍</span>
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Relief Plan</span>
              </button>
            </div>

            {/* 動態訊息欄 */}
            <div className="h-12 mt-8">
              {message && (
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[10px] text-center text-orange-200 animate-in fade-in slide-in-from-bottom-2">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* 頁尾 */}
          <footer className="mt-12 text-center">
            <p className="text-[9px] text-slate-700 font-bold tracking-[0.5em] uppercase mb-2">
              On-Chain Identity Verification Protocol v3.0
            </p>
            <p className="text-[8px] text-slate-800 tracking-tighter">
              © 2026 WU SHENG-PING. DEPLOYED ON WORLD CHAIN.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}