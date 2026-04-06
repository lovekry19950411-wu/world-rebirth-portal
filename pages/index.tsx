import { useState, useEffect } from "react";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";

// --- 配置區 ---
const TWITTER_ID = "G9Yeu21"; 

export default function SapphireReborn() {
  const [userAddress, setUserAddress] = useState<string>("");
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [power, setPower] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [email, setEmail] = useState("");

  // 初始化 MiniKit
  useEffect(() => {
    if (typeof window !== "undefined" && MiniKit.isInstalled()) {
      setUserAddress(MiniKit.walletAddress || "");
    }
  }, []);

  // 1. World ID 驗證
  const handleVerify = async () => {
    try {
      const { finalPayload } = await MiniKit.verify({
        action: "sapphire-auth",
        // 修正導入名稱問題
        verification_level: VerificationLevel.Device,
      });
      if (finalPayload.status === "success") {
        setStep1Done(true);
      }
    } catch (e) {
      console.error("驗證失敗", e);
    }
  };

  // 2. 登記資訊並追蹤 X
  const handleFollowX = () => {
    window.open(`https://x.com/intent/follow?screen_name=${TWITTER_ID}`, "_blank");
    setStep2Done(true);
  };

  // 3. 啟動重生轉盤
  const handleStartSpin = () => {
    if (!step1Done || !step2Done || isSpinning) return;
    
    setIsSpinning(true);
    
    // 轉盤邏輯
    setTimeout(() => {
      const win = Math.random() > 0.5;
      const prize = win ? 50 : -25;
      setPower((prev) => prev + prize);
      setIsSpinning(false);
      alert(win ? "🔮 重生成功！能量大幅提升" : "💀 重生失敗，能量已損耗");
    }, 3000);
  };

  return (
    <div style={{ backgroundColor: "#0a0f1e", color: "white", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      <header style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
        <h1 style={{ color: "#4d90fe", fontSize: "36px", fontWeight: "bold", margin: "0" }}>
          SAPPHIRE <span style={{ color: "white" }}>REBORN</span>
        </h1>
        <p style={{ opacity: 0.5, fontSize: "12px", marginTop: "10px" }}>
          WALLET: {userAddress || "CONNECTED"}
        </p>
        <div style={{ marginTop: "30px" }}>
          <div style={{ fontSize: "64px", fontWeight: "900" }}>{power}</div>
          <div style={{ fontSize: "14px", color: "#4d90fe", fontWeight: "bold" }}>CURRENT POWER</div>
        </div>
      </header>

      <main style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* 第一步：驗證 */}
        <button 
          onClick={handleVerify} 
          disabled={step1Done}
          style={{ width: "100%", padding: "18px", borderRadius: "10px", backgroundColor: step1Done ? "#1e293b" : "#334155", border: "none", color: "white", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
        >
          {step1Done ? "✓ 驗證已完成" : "1. World ID 身分驗證"}
        </button>

        {/* 第二步：登記與追蹤 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#111827", padding: "15px", borderRadius: "12px" }}>
          <input 
            type="email" 
            placeholder="你的 Email (領取通知)" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#050a18", border: "1px solid #333", color: "white", boxSizing: "border-box" }} 
          />
          <button 
            onClick={handleFollowX} 
            disabled={!step1Done || step2Done}
            style={{ width: "100%", padding: "15px", borderRadius: "10px", backgroundColor: step2Done ? "#1e293b" : (step1Done ? "#2563eb" : "#334155"), border: "none", color: "white", fontWeight: "bold", cursor: "pointer", opacity: step1Done ? 1 : 0.5 }}
          >
            {step2Done ? "✓ 已登記並追蹤 X" : "2. 登記資訊並追蹤 X"}
          </button>
        </div>

        {/* 核心圖示 */}
        <div style={{ textAlign: "center", margin: "20px 0", animation: isSpinning ? "spin 1s linear infinite" : "none", fontSize: "60px" }}>
          💎
        </div>

        {/* 第三步：啟動 */}
        <button 
          onClick={handleStartSpin} 
          disabled={!step1Done || !step2Done || isSpinning}
          style={{ width: "100%", padding: "20px", borderRadius: "12px", backgroundColor: (step1Done && step2Done) ? "#3b82f6" : "#1e293b", color: "white", border: "none", fontWeight: "900", fontSize: "18px", cursor: "pointer", boxShadow: (step1Done && step2Done) ? "0 0 20px rgba(59, 130, 246, 0.4)" : "none", opacity: (step1Done && step2Done) ? 1 : 0.5 }}
        >
          {isSpinning ? "重生中..." : "3. 啟動重生轉盤"}
        </button>

      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}