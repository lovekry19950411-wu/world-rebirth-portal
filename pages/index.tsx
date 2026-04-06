import { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

// 配置區
const TWITTER_ID = "G9Yeu21"; 

export default function SapphireReborn() {
  const [userAddress, setUserAddress] = useState<string>("");
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [power, setPower] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);

  // 初始化時自動抓取 World App 錢包地址
  useEffect(() => {
    if (MiniKit.isInstalled()) {
      setUserAddress(MiniKit.walletAddress || "");
    }
  }, []);

  // 1. World ID 驗證 (修正後的調用方式)
  const handleVerify = async () => {
    try {
      const response = await MiniKit.verify({
        action: "sapphire-auth",
        // 直接用字串避免編譯錯誤
        verification_level: "device" as any, 
      });
      if (response.finalPayload.status === "success") {
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

  // 3. 啟動轉盤
  const handleStartSpin = async () => {
    if (!step1Done || !step2Done || isSpinning) return;
    
    setIsSpinning(true);
    
    setTimeout(() => {
      const win = Math.random() > 0.4;
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
        <button onClick={handleVerify} disabled={step1Done}
          style={{ width: "100%", padding: "18px", borderRadius: "12px", backgroundColor: step1Done ? "#064e3b" : "#1e293b", color: step1Done ? "#34d399" : "white", border: "none", fontWeight: "bold", fontSize: "16px", cursor: step1Done ? "default" : "pointer" }}>
          {step1Done ? "✓ 身分驗證已完成" : "1. World ID 驗證"}
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="email" placeholder="輸入 Email (展示用)" 
            style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#111", border: "1px solid #333", color: "white" }} />
          <button onClick={handleFollowX} disabled={!step1Done || step2Done}
            style={{ width: "100%", padding: "18px", borderRadius: "12px", backgroundColor: step2Done ? "#1e293b" : (step1Done ? "#2563eb" : "#111827"), color: step2Done ?