import { useState, useEffect } from "react";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";

// 配置區
const TWITTER_ID = "G9Yeu21"; 
const TARGET_WALLET = "0x8bfe4647304e9564c48f4457e5082275f200042f";

export default function SapphireReborn() {
  const [userAddress, setUserAddress] = useState<string>("");
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [power, setPower] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);

  // 初始化時自動抓取 World App 內建錢包地址
  useEffect(() => {
    if (MiniKit.isInstalled()) {
      setUserAddress(MiniKit.walletAddress || "");
    }
  }, []);

  // 1. World ID 驗證
  const handleVerify = async () => {
    try {
      const { finalPayload } = await MiniKit.verify({
        action: "sapphire-auth",
        verification_level: VerificationLevel.Device,
      });
      if (finalPayload.status === "success") {
        setStep1Done(true);
      }
    } catch (e) {
      console.error("驗證失敗", e);
    }
  };

  // 2. 追蹤 X (導流至個人頁面)
  const handleFollowX = () => {
    window.open(`https://x.com/intent/follow?screen_name=${TWITTER_ID}`, "_blank");
    setStep2Done(true);
  };

  // 3. 啟動轉盤 (連動錢包)
  const handleStartSpin = async () => {
    if (!step1Done || !step2Done || isSpinning) return;
    
    setIsSpinning(true);
    
    // 轉盤動畫邏輯
    setTimeout(() => {
      const win = Math.random() > 0.4; // 60% 中獎率
      const prize = win ? 50 : -30;
      setPower((prev) => prev + prize);
      setIsSpinning(false);
      alert(win ? "🔮 重生成功！獲得 50 能量" : "💀 重生失敗，能量損耗");
    }, 2500);
  };

  return (
    <div style={{ backgroundColor: "#050a18", color: "white", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      <header style={{ textAlign: "center", marginTop: "40px", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "2px" }}>
          SAPPHIRE <span style={{ color: "#3b82f6" }}>REBORN</span>
        </h1>
        <div style={{ backgroundColor: "#111827", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", border: "1px solid #1f2937", color: "#9ca3af" }}>
          Wallet: {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "連結中..."}
        </div>
        <div style={{ marginTop: "25px" }}>
          <div style={{ fontSize: "60px", fontWeight: "900", textShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}>{power}</div>
          <div style={{ fontSize: "14px", color: "#3b82f6", fontWeight: "bold" }}>CURRENT POWER</div>
        </div>
      </header>

      <main style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "12px" }}>
        
        {/* 步驟 1 */}
        <button onClick={handleVerify} disabled={step1Done}
          style={{ width: "100%", padding: "18px", borderRadius: "12px", backgroundColor: step1Done ? "#064e3b" : "#1e293b", color: step1Done ? "#34d399" : "white", border: "none", fontWeight: "bold", fontSize: "16px", cursor: step1Done ? "default" : "pointer" }}>
          {step1Done ? "✓ 身分驗證已完成" : "1. World ID 驗證"}
        </button>

        {/* 步驟 2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="email" placeholder="輸入 Email (不存數據庫，僅前端顯示)" 
            style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#111", border: "1px solid #333", color: "white" }} />
          <button onClick={handleFollowX} disabled={!step1Done || step2Done}
            style={{ width: "100%", padding: "18px", borderRadius: "12px", backgroundColor: step2Done ? "#1e293b" : (step1Done ? "#2563eb" : "#111827"), color: step2Done ? "#9ca3af" : "white", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", opacity: step1Done ? 1 : 0.5 }}>
            {step2Done ? "✓ 已追蹤 X 帳號 (增粉成功)" : "2. 追蹤 X 領取重生權限"}
          </button>
        </div>

        {/* 轉盤核心 */}
        <div style={{ textAlign: "center", margin: "20px 0", animation: isSpinning ? "spin 1s linear infinite" : "none" }}>
          <span style={{ fontSize: "64px" }}>💎</span>
        </div>

        {/* 步驟 3 */}
        <button onClick={handleStartSpin} disabled={!step1Done || !step2Done || isSpinning}
          style={{ width: "100%", padding: "20px", borderRadius: "12px", backgroundColor: (step1Done && step2Done) ? "#3b82f6" : "#111827", color: "white", border: "none", fontWeight: "900", fontSize: "18px", cursor: "pointer", boxShadow: (step1Done && step2Done) ? "0 0 25px rgba(59, 130, 246, 0.4)" : "none", opacity: (step1Done && step2Done) ? 1 : 0.5 }}>
          {isSpinning ? "重生啟動中..." : "3. 啟動重生轉盤"}
        </button>

      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}