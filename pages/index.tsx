import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // 確保客戶端渲染，防止 Hydration 錯誤
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = (type: string) => {
    setLoading(true);
    const logMap: Record<string, string> = {
      lottery: '⚡ [SYSTEM] 正在調用 World Chain 身份驗證合約...',
      otc: '📊 [DATA] 正在同步鏈上 OTC 交易深度數據...',
      relief: '🌍 [NETWORK] 正在連結 Starmaker 救助計畫存證節點...'
    };
    setMessage(logMap[type] || '處理中...');
    
    setTimeout(() => {
      setLoading(false);
      setMessage(`🟢 成功：${type === 'lottery' ? '重生能量注入成功，請確認錢包' : '數據庫同步完成'}`);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace', position: 'relative', overflow: 'hidden' }}>
      <Head>
        <title>Wu Sheng-ping | TW_SPWU_ZH Portal</title>
        <meta name="description" content="Official Reborn Portal on World Chain" />
      </Head>

      {/* 動態背景裝飾：增加視覺複雜度 */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 75%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '0', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 75%)', filter: 'blur(100px)' }} />
      </div>

      <main style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          
          {/* 頂部裝飾 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px', opacity: 0.3 }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, white)' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.6em', textTransform: 'uppercase' }}>Verified Human Node</span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, white)' }} />
          </div>

          {/* 主面板 */}
          <div style={{ backgroundColor: 'rgba(15, 17, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '50px', backdropFilter: 'blur(30px)', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8)' }}>
            
            {/* 個人資料標題區 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', margin: 0 }}>
                  Wu Sheng-ping <span style={{ color: '#f97316' }}>ZH</span>
                </h1>
                <p style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.2em', marginTop: '12px', fontWeight: 'bold' }}>
                  UID: TW_SPWU_ZH_2026
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '8px', color: '#f97316', fontWeight: 900, letterSpacing: '0.2em', marginBottom: '8px', textTransform: 'uppercase' }}>Energy Balance</p>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '8px 20px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: 'white', fontStyle: 'italic' }}>100.00</span>
                </div>
              </div>
            </div>

            {/* 重生能量按鈕區 */}
            <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '35px', padding: '35px', marginBottom: '35px', textAlign: 'center' }}>
              <div style={{ fontSize: '72px', marginBottom: '25px', filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.5))' }}>💎</div>
              <h2 style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5em', marginBottom: '35px', textTransform: 'uppercase' }}>Sapphire Reborn Energy</h2>
              
              <button 
                onClick={() => handleAction('lottery')}
                disabled={loading}
                style={{ width: '100%', padding: '24px', backgroundColor: '#f97316', color: 'black', border: 'none', borderRadius: '22px', fontWeight: 900, fontSize: '15px', letterSpacing: '0.15em', cursor: loading ? 'wait' : 'pointer', boxShadow: '0 10px 40px rgba(249,115,22,0.3)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {loading ? 'PROCESSING...' : 'EXECUTE REBORN'}
              </button>
            </div>

            {/* 底部功能矩陣 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <button onClick={() => handleAction('otc')} style={{ padding: '25px 15px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '28px', cursor: 'pointer', transition: '0.2s' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#475569', letterSpacing: '0.15em' }}>OTC DESK</span>
              </button>
              <button onClick={() => handleAction('relief')} style={{ padding: '25px 15px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '28px', cursor: 'pointer', transition: '0.2s' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🌍</div>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#475569', letterSpacing: '0.15em' }}>RELIEF HUB</span>
              </button>
            </div>

            {/* 系統訊息終端 */}
            <div style={{ height: '55px', marginTop: '35px' }}>
              {message && (
                <div style={{ padding: '15px', backgroundColor: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: '18px', fontSize: '10px', textAlign: 'center', color: '#fdba74' }}>
                  {message}
                </div>
              )}
            </div>
          </div>

          <footer style={{ marginTop: '50px', textAlign: 'center', opacity: 0.2 }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.7em', fontWeight: 900, color: 'white', marginBottom: '10px' }}>TW_SPWU_ZH PROTOCOL v3.2</p>
            <p style={{ fontSize: '8px', color: '#475569' }}>AUTHORIZED ACCESS ONLY • WORLD CHAIN MAINNET</p>
          </footer>
        </div>
      </main>
    </div>
  );
}