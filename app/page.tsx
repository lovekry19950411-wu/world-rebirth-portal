'use client'

import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  // 你的 Google 腳本網址
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1q7nTpF_BpxDj8wDPy3sTPmZV-mttGZnWGdCeIlRn_snxHWhx-YFky-wJeNPfeCxnFQ/exec'

  const handleVerify = async (result: ISuccessResult) => {
    setStatus('驗證成功，正在核發 100 積分...')
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          nullifier_hash: result.nullifier_hash,
        }),
      })
      setStatus('100 積分已自動入帳！請查看試算表。')
    } catch (error) {
      console.error('Error:', error)
      setStatus('積分錄入失敗，請聯繫管理員。')
    }
  }

  return (
    <main style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', minHeight: '100vh', backgroundColor: '#000', color: '#fff',
      fontFamily: 'sans-serif', padding: '20px', textAlign: 'center'
    }}>
      <h1 style={{ color: '#00ffcc', fontSize: '2.2rem', marginBottom: '10px' }}>
        💎 TW_SPWU_ZH 重生者門戶
      </h1>
      
      <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '30px', borderRadius: '15px', maxWidth: '450px' }}>
        <h2 style={{ color: '#ffcc00' }}>早期參與獎勵：100 Points</h2>
        <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '0.9rem' }}>
          完成 World ID 真人驗證，積分將自動存入您的數位身分憑證。
        </p>

        <input
          type="email"
          placeholder="輸入您的 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px',
            border: '1px solid #444', backgroundColor: '#222', color: '#fff', outline: 'none'
          }}
        />

        <IDKitWidget
          app_id="app_f4bf6f2a1ca32e4f9af5f35b529f98f6" 
          action="verify-human"
          onSuccess={handleVerify}
          verification_level={VerificationLevel.Device}
        >
          {/* 修正後的邏輯，加上了類型定義以繞過 Vercel 報錯 */}
          {({ open }: { open: () => void }) => (
            <button 
              onClick={open} 
              disabled={!email}
              style={{
                width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold',
                borderRadius: '8px', cursor: email ? 'pointer' : 'not-allowed',
                backgroundColor: email ? '#00ffcc' : '#333', color: '#000', border: 'none'
              }}
            >
              {email ? '領取 100 積分獎勵' : '請先輸入 Email'}
            </button>
          )}
        </IDKitWidget>

        {status && <p style={{ marginTop: '20px', color: '#00ffcc', fontWeight: 'bold' }}>{status}</p>}
      </div>

      <div style={{ marginTop: '30px', color: '#444', fontSize: '0.8rem' }}>
        <p>系統自動化運行中：Next.js + Google Sheets + World ID</p>
      </div>
    </main>
  )
}