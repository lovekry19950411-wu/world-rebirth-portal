import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [nullifier, setNullifier] = useState('');
  const [email, setEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [message, setMessage] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [power, setPower] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 收款地址與開發者資訊
  const walletAddress = "0x05a78ead87e91986927a7c9339E102F89617300C";

  useEffect(() => { setMounted(true); }, []);

  // 驗證成功後的回調
  const handleVerifySuccess = useCallback((result: ISuccessResult) => {
    setNullifier(result.nullifier_hash);
    setIsVerified(true);
    setMessage('✅ 身分驗證成功！請登記資訊以同步數據。');
  }, []);

  // 修正後的數據同步邏輯，對接後端的 action 判斷
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !twitter) return setMessage('❌ 請填寫信箱與 X 帳號。');
    setIsSubmitting(true);
    setMessage('📡 正在同步至 Google Sheets...');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'set_email', // 對接後端 api/submit.ts 中的 if (action === 'set_email')
          nullifier_hash: nullifier,
          email: email
          // 注意：後端 API 目前僅處理 email 與 nullifier_hash，twitter 資訊將存在記憶體或後續擴展
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPower(data.power || 100);
        // 自動跳轉追蹤 X
        window.open(`https://x.com/intent/follow?screen_name=TWSPWUZH`, '_blank');
        setMessage(`🚀 同步成功！當前能量點：${data.power || 100}`);
      } else {
        // 抓取後端返回的具體錯誤訊息
        setMessage(`⚠️ 同步失敗：${data.message || '未知錯誤'}`);
      }
    } catch (err) {
      setMessage('⚠️ 網路連線異常，請確認 Vercel 部署狀態。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 轉盤邏輯，與後端 add_power 對接 (可選)
  const startSpin = async () => {
    if (!isVerified) return;
    setIsSpinning(true);
    setMessage('🌀 正在抽取重生能量...');

    const delta = Math.floor(Math.random() * 50) + 10;

    try {
      // 嘗試將隨機獲得的能量同步回後端
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_power', nullifier_hash: nullifier, delta }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setPower(data.power);
        setMessage(`💎 成功獲得 ${delta} 點能量！`);
      }
    } catch (e) {
      setPower(prev => prev + delta);
      setMessage(`💎 獲得 ${delta} 點能量 (僅本地更新)`);
    } finally {
      setIsSpinning(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <Head><title>Sapphire Reborn | 藍寶石重生協議</title></Head>
      
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '450px', background: 'rgba(15, 17, 26, 0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '40px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>Sapphire <span style={{ color: '#3b82f6' }}>Reborn</span></h1>
              <p style={{ fontSize: '10px', color: '#475569' }}>{nullifier ? `ID: ${nullifier.slice(0,12)}...` : '等待驗證'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#3b82f6' }}>{power}</div>
              <span style={{ fontSize: '9px', color: '#64748b' }}>POWER</span>
            </div>
          </div>

          <div style={{ background: 'rgba(59,130,246,0.05)', padding: '15px', borderRadius: '20px', marginBottom: '20px', border: '1px dashed rgba(59,130,246,0.3)' }}>
            <p style={{ fontSize: '11px', textAlign: 'center', marginBottom: '10px' }}>💎 鏈上支持開發者 (Giveth)</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { navigator.clipboard.writeText(walletAddress); alert('地址已複製'); }} style={{ flex: 1, padding: '8px', fontSize: '10px', borderRadius: '10px', cursor: 'pointer', background: '#1e293b', color: 'white', border: 'none' }}>複製地址</button>
              <button onClick={() => window.open('https://giveth.io/project/smart-wallet-public-fundraising', '_blank')} style={{ flex: 1, padding: '8px', fontSize: '10px', borderRadius: '10px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none' }}>前往專案</button>
            </div>
          </div>

          <section style={{ marginBottom: '20px' }}>
            <IDKitWidget
              app_id="app_f4bf6f2a1ca32e4f9af5f35b529f98f6"
              action="verify-rebirth"
              onSuccess={handleVerifySuccess}
              verification_level={VerificationLevel.Device}
            >
              {({ open }: { open: () => void }) => (
                <button onClick={open} disabled={isVerified} style={{ width: '100%', padding: '18px', backgroundColor: isVerified ? '#1e293b' : '#3b82f6', borderRadius: '15px', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                  {isVerified ? '✓ 驗證已完成' : '1. 驗證 World ID 真人身分'}
                </button>
              )}
            </IDKitWidget>
          </section>

          <section style={{ marginBottom: '20px', opacity: isVerified ? 1 : 0.4 }}>
            <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="email" placeholder="Email 地址" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isVerified} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #1e293b', background: '#0f172a', color: 'white' }} />
              <input type="text" placeholder="X (Twitter) 帳號 @..." value={twitter} onChange={(e) => setTwitter(e.target.value)} disabled={!isVerified} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #1e293b', background: '#0f172a', color: 'white' }} />
              <button type="submit" disabled={!isVerified || isSubmitting} style={{ padding: '14px', backgroundColor: 'transparent', border: '1px solid #3b82f6', borderRadius: '12px', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}>
                {isSubmitting ? '同步中...' : '2. 登記資訊並追蹤 X'}
              </button>
            </form>
          </section>

          <section style={{ textAlign: 'center', opacity: isVerified ? 1 : 0.4 }}>
            <div style={{ fontSize: '50px', margin: '20px 0', animation: isSpinning ? 'spin 1s infinite linear' : 'none', display: 'inline-block' }}>💎</div>
            <button onClick={startSpin} disabled={!isVerified || isSpinning} style={{ width: '100%', padding: '18px', background: isVerified ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#1e293b', border: 'none', borderRadius: '15px', color: 'white', fontWeight: 900, fontSize: '16px', cursor: 'pointer' }}>
              {isSpinning ? '能量抽取中...' : '3. 啟動重生轉盤'}
            </button>
          </section>

          {message && <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '12px', fontSize: '11px', textAlign: 'center', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>{message}</div>}
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}