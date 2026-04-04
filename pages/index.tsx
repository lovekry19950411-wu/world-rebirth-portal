import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = (type: string) => {
    setLoading(true);
    const logMap: Record<string, string> = {
      lottery: '⚡ [SYSTEM] 正在驗證 World ID 零知識證明...',
      otc: '📊 [DATA] 正在獲取藍寶石流動性池數據...',
      relief: '🌍 [NETWORK] 正在連結全球救援協議節點...'
    };
    setMessage(logMap[type] || '處理中...');
    
    setTimeout(() => {
      setLoading(false);
      setMessage(`🟢 成功：${type === 'lottery' ? '重生能量提取成功' : '鏈上同步完成'}`);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace', position: 'relative', overflow: 'hidden' }}>
      <Head>
        <title>SAPPHIRE PROTOCOL | World Chain</title>
      </Head>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 75%)', filter: 'blur(80px)' }} />
      </div>

      <main style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          
          <div style={{ backgroundColor: 'rgba(15, 17, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '50px', backdropFilter: 'blur(30px)', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'white', letterSpacing: '0.05em', margin: 0 }}>
                  SAPPHIRE <span style={{ color: '#3b82f6' }}>PROTOCOL</span>
                </h1>
                <p style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.1em', marginTop: '12px' }}>
                  WLD-ID: 0x8b...f2e9 {/* 這裡顯示 WLD 唯一身份格式 */}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '8px', color: '#3b82f6', fontWeight: 900, marginBottom: '8px' }}>POWER</p>
                <div style={{ backgroundColor: 'rgba(59,130,246,0.1)', padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>100.0</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '35px', padding: '35px', marginBottom: '35px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '25px', filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.4))' }}>💎</div>
              <h2 style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.4em', marginBottom: '35px' }}>EXTRACT ENERGY</h2>
              
              <button 
                onClick={() => handleAction('lottery')}
                disabled={loading}
                style={{ width: '100%', padding: '22px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '22px', fontWeight: 900, fontSize: '15px', cursor: loading ? 'wait' : 'pointer', boxShadow: '0 10px 30px rgba(59,130,246,0.3)' }}
              >
                {loading ? 'VERIFYING...' : 'EXECUTE PROTOCOL'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <button onClick={() => handleAction('otc')} style={{ padding: '25px 15px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '28px', cursor: 'pointer' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🏛️</div>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#475569' }}>LIQUIDITY</span>
              </button>
              <button onClick={() => handleAction('relief')} style={{ padding: '25px 15px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '28px', cursor: 'pointer' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🌐</div>
                <span style={{ fontSize: '9px', fontWeight: 900, color: '#475569' }}>NETWORK</span>
              </button>
            </div>

            <div style={{ height: '55px', marginTop: '35px' }}>
              {message && (
                <div style={{ padding: '15px', backgroundColor: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '18px', fontSize: '10px', textAlign: 'center', color: '#93c5fd' }}>
                  {message}
                </div>
              )}
            </div>
          </div>

          <footer style={{ marginTop: '50px', textAlign: 'center', opacity: 0.2 }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.6em', fontWeight: 900, color: 'white' }}>SAPPHIRE PROTOCOL v4.0</p>
          </footer>
        </div>
      </main>
    </div>
  );
}