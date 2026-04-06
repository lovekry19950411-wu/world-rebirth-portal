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

  useEffect(() => { setMounted(true); }, []);

  const handleVerifySuccess = useCallback((result: ISuccessResult) => {
    setNullifier(`${result.nullifier_hash.slice(0, 10)}…`);
    setIsVerified(true);
    setMessage('✅ 身分驗證成功！請填寫資料鎖定空投獎勵。');
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !twitter) return setMessage('❌ 請填寫信箱與 X 帳號。');
    
    setIsSubmitting(true);
    setMessage('📡 正在同步雲端數據庫...');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, twitter, nullifier, timestamp: new Date().toISOString() }),
      });

      if (res.ok) {
        setMessage(`🚀 同步成功！${email} 已列入空投名單。`);
      } else {
        setMessage('⚠️ 雲端連線異常，已先將資料暫存在瀏覽器。');
      }
    } catch (err) {
      setMessage('⚠️ 同步失敗，請檢查網路連線。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startSpin = () => {
    setIsSpinning(true);
    setMessage('🌀 正在抽取空投能量...');
    setTimeout(() => {
      const gain = Math.floor(Math.random() * 80) + 20;
      setPower(prev => prev + gain);
      setIsSpinning(false);
      setMessage(`💎 獲得 ${gain} 能量點！(測試版刷新會重置)`);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <Head><title>Sapphire Airdrop | 藍寶石空投轉盤</title></Head>
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '450px', background: 'rgba(15, 17, 26, 0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '40px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', color: '#fbbf24', border: '1px solid #fbbf24', padding: '3px 12px', borderRadius: '20px', letterSpacing: '1px' }}>
              ALPHA TEST: 目前僅供功能測試，刷新會重置
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>藍寶石<span style={{ color: '#3b82f6' }}>空投轉盤</span> 💎</h1>
              <p style={{ fontSize: '10px', color: '#475569', marginTop: '5px' }}>ID: {nullifier}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '9px', color: '#3b82f6', fontWeight: 'bold' }}>ENERGY</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#3b82f6' }}>{power.toFixed(2)}</div>
            </div>
          </div>

          <section style={{ marginBottom: '25px' }}>
            <IDKitWidget
              app_id="app_f4bf6f2a1ca32e4f9af5f35b529f98f6"
              action="reborn-verify"
              onSuccess={handleVerifySuccess}
              verification_level={VerificationLevel.Device}
            >
              {/* 修正後的 open 參數類型 */}
              {({ open }: { open: () => void }) => (
                <button onClick={open} disabled={isVerified} style={{ width: '100%', padding: '20px', backgroundColor: isVerified ? '#1e293b' : '#3b82f6', borderRadius: '18px', color: 'white', fontWeight: 900, cursor: isVerified ? 'default' : 'pointer', border: 'none', fontSize: '16px', transition: 'all 0.3s' }}>
                  {isVerified ? '✓ 身分驗證已完成' : '1. 驗證真人領取抽獎券'}
                </button>
              )}
            </IDKitWidget>
          </section>

          <section style={{ marginBottom: '30px', opacity: isVerified ? 1 : 0.3 }}>
            <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="email" placeholder="空投接收信箱..." value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isVerified || isSubmitting} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', background: '#0f172a', color: 'white', fontSize: '14px' }} />
              <input type="text" placeholder="X (Twitter) 帳號 @..." value={twitter} onChange={(e) => setTwitter(e.target.value)} disabled={!isVerified || isSubmitting} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', background: '#0f172a', color: 'white', fontSize: '14px' }} />
              <button type="submit" disabled={!isVerified || isSubmitting} style={{ width: '100%', padding: '14px', backgroundColor: 'transparent', border: '1px solid #3b82f6', borderRadius: '14px', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}>
                {isSubmitting ? '📡 同步中...' : '確認登記空投資格'}
              </button>
            </form>
          </section>

          <section style={{ textAlign: 'center', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(5,7,10,0) 70%)', padding: '40px 20px', borderRadius: '35px', border: '1px solid rgba(59,130,246,0.1)', opacity: isVerified ? 1 : 0.3 }}>
            <div style={{ fontSize: '70px', marginBottom: '25px', animation: isSpinning ? 'spin 1s infinite linear' : 'none', display: 'inline-block', filter: '