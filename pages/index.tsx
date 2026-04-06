import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [nullifier, setNullifier] = useState('—');
  const [email, setEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [message, setMessage] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [power, setPower] = useState(100.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 狐狸錢包收款地址
  const walletAddress = "0x05a78ead87e91986927a7c9339E102F89617300C";

  useEffect(() => { setMounted(true); }, []);

  const handleVerifySuccess = useCallback((result: ISuccessResult) => {
    setNullifier(`${result.nullifier_hash.slice(0, 10)}…`);
    setIsVerified(true);
    setMessage('✅ 驗證成功！請登記資訊並「追蹤 X」鎖定資格。');
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !twitter) return setMessage('❌ 請填寫信箱與 X 帳號。');
    setIsSubmitting(true);
    setMessage('📡 正在同步數據...');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, twitter, nullifier, timestamp: new Date().toISOString() }),
      });

      if (res.ok) {
        // 自動開啟追蹤頁面
        window.open(`https://x.com/intent/follow?screen_name=TWSPWUZH`, '_blank');
        setMessage(`🚀 登記成功！請在彈出視窗點擊「追蹤」完成步驟。`);
      } else {
        setMessage('⚠️ 同步失敗：請檢查 Vercel 環境變數名稱。');
      }
    } catch (err) {
      setMessage('⚠️ 網路異常，資料暫存在瀏覽器。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startSpin = () => {
    setIsSpinning(true);
    setMessage('🌀 正在抽取重生能量...');
    setTimeout(() => {
      const gain = Math.floor(Math.random() * 80) + 20;
      setPower(prev => prev + gain);
      setIsSpinning(false);
      setMessage(`💎 獲得 ${gain} 能量點！(測試版數據不存檔)`);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <Head><title>Sapphire Reborn | 藍寶石重生協議</title></Head>
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '450px', background: 'rgba(15, 17, 26, 0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '40px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', color: '#fbbf24', border: '1px solid #fbbf24', padding: '3px 12px', borderRadius: '20px' }}>
              ALPHA TEST: 功能測試中
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>藍寶石<span style={{ color: '#3b82f6' }}>重生協議</span> 💎</h1>
              <p style={{ fontSize: '10px', color: '#475569' }}>UID: {nullifier}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '9px', color: '#3b82f6', fontWeight: 'bold' }}>ENERGY</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#3b82f6' }}>{power.toFixed(2)}</div>
            </div>
          </div>

          {/* 打賞與 Giveth 說明區塊 */}
          <div style={{ background: 'linear-gradient(145deg, rgba(59,130,246,0.1), rgba(15,23,42,0.4))', padding: '20px', borderRadius: '24px', marginBottom: '25px', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#93c5fd', marginBottom: '8px' }}>💎 支持開發者加速重生</p>
            <div style={{ fontSize: '9px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', color: '#64748b', marginBottom: '12px', wordBreak: 'break-all' }}>
              收款地址: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)} (關聯 Giveth)
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={() => { navigator.clipboard.writeText(walletAddress); alert('地址已複製！'); }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', cursor: 'pointer' }}>📋 複製</button>
              <button onClick={() => window.open('https://giveth.io/project/smart-wallet-public-fundraising', '_blank')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>🔗 Giveth 專案</button>
            </div>
          </div>

          <section style={{ marginBottom: '25px' }}>
            <IDKitWidget
              app_id="app_f4bf6f2a1ca32e4f9af5f35b529f98f6"
              action="verify-rebirth"
              onSuccess={handleVerifySuccess}
              verification_level={VerificationLevel.Device}
            >
              {({ open }: { open: () => void }) => (
                <button onClick={open} disabled={isVerified} style={{ width: '100%', padding: '20px', backgroundColor: isVerified ? '#1e293b' : '#3b82f6', borderRadius: '18px', color: 'white', fontWeight: 900, border: 'none', cursor: 'pointer' }}>
                  {isVerified ? '✓ 身分驗證已完成' : '1. 驗證 World ID'}
                </button>
              )}
            </IDKitWidget>
          </section>

          <section style={{ marginBottom: '30px', opacity: isVerified ? 1 : 0.3 }}>
            <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="email" placeholder="信箱..." value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isVerified} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', background: '#0f172a', color: 'white' }} />
              <input type="text" placeholder="X 帳號 @..." value={twitter} onChange={(e) => setTwitter(e.target.value)} disabled={!isVerified} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', background: '#0f172a', color: 'white' }} />
              <button type="submit" disabled={!isVerified || isSubmitting} style={{ width: '100%', padding: '14px', backgroundColor: 'transparent', border: '1px solid #3b82f6', borderRadius: '14px', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}>
                {isSubmitting ? '📡 同步中...' : '2. 確認登記並追蹤 X'}
              </button>
            </form>
          </section>

          <section style={{ textAlign: 'center', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(5,7,10,0) 70%)', padding: '40px 20px', borderRadius: '35px', border: '1px solid rgba(59,130,246,0.1)', opacity: isVerified ? 1 : 0.3 }}>
            <div style={{ fontSize: '70px', marginBottom: '25px', animation: isSpinning ? 'spin 1s infinite linear' : 'none', display: 'inline-block' }}>💎</div>
            <button onClick={startSpin} disabled={!isVerified || isSpinning} style={{ width: '100%', padding: '20px', background: isVerified ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#1e293b', border: 'none', borderRadius: '18px', color: 'white', fontWeight: 900, fontSize: '18px', cursor: 'pointer' }}>
              {isSpinning ? '抽取中...' : '3. 啟動轉盤'}
            </button>
          </section>

          <div style={{ minHeight: '60px', marginTop: '25px' }}>
            {message && <div style={{ padding: '15px', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '15px', fontSize: '12px', textAlign: 'center', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>{message}</div>}
          </div>
        </div>
      </main>
      <style jsx global>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}