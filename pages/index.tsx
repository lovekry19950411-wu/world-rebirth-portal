import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';

const STORAGE_KEY = 'sapphire_reborn_nullifier';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [nullifier, setNullifier] = useState('—');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [power, setPower] = useState(100.0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 初始化：從本地與雲端還原資料
  useEffect(() => {
    if (!mounted) return;
    const hash = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!hash) return;

    setRestoring(true);
    void fetch(`/api/user-sync?nullifier_hash=${encodeURIComponent(hash)}`)
      .then(async (r) => {
        const data = (await r.json()) as {
          ok?: boolean;
          power?: number;
          email?: string;
          code?: string;
        };
        if (data.ok) {
          setIsVerified(true);
          setNullifier(`${hash.slice(0, 10)}…`);
          setPower(typeof data.power === 'number' ? data.power : 100);
          setEmail(data.email || '');
          setMessage('✅ 已從雲端還原你的重生能量與信箱紀錄。');
          return;
        }
        if (data.code === 'NOT_FOUND') {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }
        if (r.status === 503 && data.code === 'SHEETS_NOT_CONFIGURED') {
          setIsVerified(true);
          setNullifier(`${hash.slice(0, 10)}…`);
          setMessage('⚠️ 雲端未設定：目前為本機模式，請設定 GOOGLE_* 環境變數。');
        }
      })
      .catch(() => {
        setMessage('⚠️ 雲端同步暫時失敗；本機已保留驗證狀態。');
        setIsVerified(true);
        setNullifier(`${hash.slice(0, 10)}…`);
      })
      .finally(() => setRestoring(false));
  }, [mounted]);

  // World ID 驗證成功回傳
  const handleVerifySuccess = useCallback(async (result: ISuccessResult) => {
    const full = result.nullifier_hash;
    localStorage.setItem(STORAGE_KEY, full);
    setNullifier(`${full.slice(0, 10)}…`);
    setIsVerified(true);

    try {
      const r = await fetch('/api/user-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ensure', nullifier_hash: full }),
      });
      const data = await r.json();
      if (data.ok) {
        if (typeof data.power === 'number') setPower(data.power);
        if (typeof data.email === 'string' && data.email) setEmail(data.email);
        setMessage('✅ 真人身分確認！資料已同步，功能已解鎖。');
        return;
      }
    } catch { /* local-only fallback */ }
    setMessage('✅ 真人身分確認！功能已解鎖。');
  }, []);

  // 信箱綁定邏輯
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return setMessage('❌ 請先執行重生驗證');
    if (!email) return setMessage('❌ 請輸入有效的電子信箱');

    const hash = localStorage.getItem(STORAGE_KEY);
    if (!hash) return setMessage('❌ 找不到身分識別，請重新驗證');

    try {
      const r = await fetch('/api/user-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_email', nullifier_hash: hash, email }),
      });
      const data = await r.json();
      if (!data.ok) {
        setMessage('❌ 信箱同步失敗，請稍後再試。');
        return;
      }
    } catch {
      setMessage('❌ 網路錯誤，信箱未寫入雲端。');
      return;
    }
    setMessage(`📧 信箱 ${email} 已成功綁定並同步至雲端。`);
  };

  // 能量抽取轉盤邏輯
  const startSpin = () => {
    if (!isVerified) return setMessage('❌ 只有驗證過的真人才可抽取重生能量');
    setIsSpinning(true);
    setMessage('🌀 正在抽取藍寶石重生能量...');

    setTimeout(() => {
      const gain = Math.floor(Math.random() * 50) + 10;
      const hash = localStorage.getItem(STORAGE_KEY);

      setPower((prev) => prev + gain);

      if (hash) {
        void fetch('/api/user-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add_power', nullifier_hash: hash, delta: gain }),
        })
          .then((r) => r.json())
          .then((data: { ok?: boolean; power?: number }) => {
            if (data.ok && typeof data.power === 'number') setPower(data.power);
          });
      }

      setIsSpinning(false);
      setMessage(`💎 抽取成功！獲得 ${gain} 能量點。`);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <Head><title>SAPPHIRE REBORN | 藍寶石重生協議</title></Head>

      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        {restoring && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,7,10,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, fontSize: '14px', color: '#93c5fd' }}>
            同步藍寶石資料…
          </div>
        )}

        <div style={{ width: '100%', maxWidth: '450px', background: 'rgba(15, 17, 26, 0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '40px', padding: '40px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900 }}>SAPPHIRE <span style={{ color: '#3b82f6' }}>REBORN</span></h1>
              <p style={{ fontSize: '10px', color: '#475569' }}>UID: {nullifier}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '8px', color: '#3b82f6' }}>ENERGY</span>
              <div style={{ fontSize: '24px', fontWeight: 900 }}>{power.toFixed(2)}</div>
            </div>
          </div>

          <section style={{ marginBottom: '30px' }}>
            {/* 這裡套用了妳提供的最新正式版 ID */}
            <IDKitWidget
              app_id="app_f4bf6f2a1ca32e4f9af5f35b529f98f6"
              action="reborn-verify"
              onSuccess={handleVerifySuccess}
              verification_level={VerificationLevel.Device}
            >
              {({ open }: { open: () => void }) => (
                <button
                  type="button"
                  onClick={open}
                  disabled={isVerified}
                  style={{ width: '100%', padding: '18px', backgroundColor: isVerified ? '#1e293b' : '#3b82f6', borderRadius: '15px', color: 'white', fontWeight: 900, cursor: isVerified ? 'default' : 'pointer', border: 'none' }}
                >
                  {isVerified ? '✓ 驗證已完成' : '1. 執行重生驗證 (World ID)'}
                </button>
              )}
            </IDKitWidget>
          </section>

          <section style={{ marginBottom: '30px', opacity: isVerified ? 1 : 0.3 }}>
            <form onSubmit={(e) => void handleEmailSubmit(e)} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="email"
                placeholder="輸入信箱登記..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isVerified}
                style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', background: '#0f172a', color: 'white' }}
              />
              <button
                type="submit"
                disabled={!isVerified}
                style={{ padding: '0 20px', backgroundColor: isVerified ? '#3b82f6' : '#1e293b', borderRadius: '12px', border: 'none', color: 'white', cursor: isVerified ? 'pointer' : 'default' }}
              >
                提交
              </button>
            </form>
          </section>

          <section style={{ textAlign: 'center', background: 'rgba(59,130,246,0.05)', padding: '30px', borderRadius: '25px', opacity: isVerified ? 1 : 0.3 }}>
            <div style={{ fontSize: '50px', marginBottom: '20px', animation: isSpinning ? 'spin 1s infinite linear' : 'none', display: 'inline-block' }}>
              {isSpinning ? '🌀' : '💎'}
            </div>
            <button
              type="button"
              onClick={startSpin}
              disabled={!isVerified || isSpinning}
              style={{ width: '100%', padding: '15px', background: isVerified ? 'linear-gradient(90deg, #3b82f6, #2563eb)' : '#1e293b', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 900, cursor: (isVerified && !isSpinning) ? 'pointer' : 'default' }}
            >
              {isSpinning ? '能量抽取中...' : '2. 啟動能量轉盤'}
            </button>
          </section>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <a href="https://giveth.io/project/starmaker-taiwan-on-chain-emergency-relief" target="_blank" rel="noopener noreferrer" style={{ color: '#475569', fontSize: '10px', textDecoration: 'none' }}>
              🌐 查看鏈上救援網絡節點
            </a>
          </div>

          <div style={{ minHeight: '40px', marginTop: '20px' }}>
            {message && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '10px', fontSize: '11px', textAlign: 'center', color: '#93c5fd' }}>
                {message}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}