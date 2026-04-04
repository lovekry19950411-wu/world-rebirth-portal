import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [nullifier, setNullifier] = useState('0x8b...f2e9');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [power, setPower] = useState(100.0);

  useEffect(() => { setMounted(true); }, []);

  const handleVerifySuccess = (result: ISuccessResult) => {
    setNullifier(result.nullifier_hash.substring(0, 10) + "...");
    setIsVerified(true);
    setMessage('✅ 真人身分確認！信箱登記與轉盤功能已解鎖。');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return setMessage('❌ 請先執行重生驗證');
    if (!email) return setMessage('❌ 請輸入有效的電子信箱');
    setMessage(`📧 信箱 ${email} 已與 WLD-ID 綁定成功！`);
  };

  const startSpin = () => {
    if (!isVerified) return setMessage('❌ 只有驗證過的真人才可抽取重生能量');
    setIsSpinning(true);
    setMessage('🌀 正在抽取藍寶石重生能量...');
    
    setTimeout(() => {
      const gain = Math.floor(Math.random() * 50) + 10;
      setPower(prev => prev + gain);
      setIsSpinning(false);
      setMessage(`💎 抽取成功！獲得 ${gain} 能量點。`);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <Head><title>SAPPHIRE REBORN | 藍寶石協議</title></Head>

      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
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
            {/* 這裡已換成正式 Production ID，解決「找不到要求」的問題 */}
            <IDKitWidget
              app_id="app_083652c77605f6396f4244031649646b" 
              action="reborn-verify"
              onSuccess={handleVerifySuccess}
              verification_level={VerificationLevel.Device}
            >
              {({ open }: { open: () => void }) => (
                <button 
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
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: '10px' }}>
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
                style={{ padding: '0 20px', backgroundColor: isVerified ? '#3b82f6' : '#1e293b', borderRadius: '12px', border: 'none', color: 'white' }}
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
              onClick={startSpin} 
              disabled={!isVerified || isSpinning} 
              style={{ width: '100%', padding: '15px', background: isVerified ? 'linear-gradient(90deg, #3b82f6, #2563eb)' : '#1e293b', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 900 }}
            >
              {isSpinning ? '能量抽取中...' : '2. 啟動能量轉盤'}
            </button>
          </section>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <a href="https://giveth.io/project/starmaker-taiwan-on-chain-emergency-relief" target="_blank" rel="noopener noreferrer" style={{ color: '#475569', fontSize: '10px', textDecoration: 'none' }}>
              🌐 查看鏈上救援網絡節點
            </a>
          </div>

          <div style={{ height: '40px', marginTop: '20px' }}>
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