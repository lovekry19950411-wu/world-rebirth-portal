import { useState, useEffect } from "react";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";

// --- 配置區 ---
const TWITTER_ID = "G9Yeu21"; // 妳的 X 帳號
const TARGET_WALLET = "0x8bfe4647304e9564c48f4457e5082275f200042f"; // 目標錢包

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

  // 1. World ID 驗證邏輯
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

  // 2. 追蹤 X (直接跳轉增粉)
  const handleFollowX = () => {
    window.open(`https://x.com/intent/follow?screen_name=${TWITTER_ID}`, "_blank");
    setStep2Done(true);
  };

  // 3. 啟動轉盤 (純前端邏輯，不報連線錯誤)
  const handleStartSpin = async () => {
    if (!step1Done || !step2Done || isSpinning) return;
    
    setIsSpinning(true);
    
    // 模擬轉盤動畫
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
      
      {/* 頂部標題與錢包顯示 */}
      <header style={{ textAlign: "center", marginTop: "40px", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "2px", margin: "0" }}>
          SAPPHIRE <span style={{ color: "#3b82f6" }}>REBORN</span>
        </h1>
        <div style={{ marginTop: "10px", backgroundColor: "#111827", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", border: "1px solid #1f2937", color: "#9ca3af", display: "inline-block" }}>
          WALLET: {userAddress ? `${userAddress.slice(0, 8)}...${userAddress.slice(-6)}` : "CONNECTING..."}
        </div>
        
        <div style={{ marginTop: "30px" }}>
          <div style={{ fontSize: "70px", fontWeight: "900", lineHeight: "1", textShadow: "0 0 25px rgba(59, 130, 246, 0.6)" }}>{power}</div>
          <div style={{ fontSize: "12px", color: "#3b82f6", fontWeight: "bold", marginTop: "5px", letterSpacing: "1px" }}>CURRENT POWER</div>
        </div>
      </header>

      {/* 操作按鈕區 */}
      <main style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "12px" }}>
        
        {/* 步驟 1: 驗證 */}
        <button onClick={handleVerify} disabled={step1Done}
          style={{ width: "100%", padding: "20px", borderRadius: "14px", backgroundColor: step1Done ? "#064e3b" : "#1e293b", color: step1Done ? "#34d399" : "white", border: "none", fontWeight: "bold", fontSize: "16px", cursor: step1Done ? "default" : "pointer", transition: "0.3s" }}>
          {step1Done ? "✓ 身分驗證已完成" : "1. World ID 驗證"}
        </button>

        {/* 步驟 2: 追蹤與輸入 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#0f172a", padding: "15px", borderRadius: "14px", border: "1px solid #1e293b" }}>
          <input type="email" placeholder="輸入 Email (領取中獎通知)" 
            style={{ width: "100%", padding: "14px", borderRadius: "10px", backgroundColor: "#050a18", border: "1px solid #334155", color: "white", outline: "none", boxSizing: "border-box" }} />
          <button onClick={handleFollowX} disabled={!step1Done || step2Done}
            style={{ width: "100%", padding: "18px", borderRadius: "10px", backgroundColor: step2Done ? "#1e293b" : (step1Done ? "#2563eb" : "#111827"), color: step2Done ? "#9ca3af" : "white", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", opacity: step1Done ? 1 : 0.5 }}>
            {step2Done ? "✓ 已追蹤 X (權限解鎖)" : "2. 追蹤 X 領取重生權限"}
          </button>
        </div>

        {/* 轉盤裝飾圖示 */}
        <div style={{ textAlign: "center", margin: "15px 0", animation: isSpinning ? "spin 1s linear infinite" : "none", fontSize: "60px" }}>
          💎
        </div>

        {/* 步驟 3: 啟動 */}
        <button onClick={handleStartSpin} disabled={!step1Done || !step2Done || isSpinning}
          style={{ width: "100%", padding: "22px", borderRadius: "14px", backgroundColor: (step1Done && step2Done) ? "#3b82f6" : "#111827", color: "white", border: "none", fontWeight: "900", fontSize: "20px", cursor: "pointer", boxShadow: (step1Done && step2Done) ? "0 10px 30px rgba(59, 130, 246, 0.4)" : "none", transition: "0.3s", opacity: (step1Done && step2Done) ? 1 : 0.5 }}>
          {isSpinning ? "重生啟動中..." : "3. 啟動重生轉盤"}
        </button>

      </main>

      {/* 旋轉動畫定義 */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}