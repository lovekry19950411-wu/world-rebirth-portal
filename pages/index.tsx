import { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

// --- 配置區 ---
const TWITTER_ID = "G9Yeu21"; 

export default function SapphireReborn() {
  const [userAddress, setUserAddress] = useState<string>("");
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [power, setPower] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && MiniKit.isInstalled()) {
      setUserAddress(MiniKit.walletAddress || "");
    }
  }, []);

  const handleVerify = async () => {
    try {
      // 這裡直接用 'device' 字串，不再導入 VerificationLevel
      const { finalPayload } = await MiniKit.verify({
        action: "sapphire-auth",
        verification_level: 'device' as any, 
      });
      if (finalPayload.status === "success") {
        setStep1Done(true);
      }
    } catch (e) {
      console.error("驗證失敗", e);
    }
  };

  const handleFollowX = () => {
    window.open(`https://x.com/intent/follow?screen_name=${TWITTER_ID}`, "_blank");
    setStep2Done(true);
  };

  const handleStartSpin = () => {
    if (!step1Done || !step2Done || isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      const win = Math.random() > 0.5;
      setPower((prev) => prev + (win ? 50 : -25));
      setIsSpinning(false);
      alert(win ? "🔮 重生成功！" : "💀 重生失敗");
    }, 3000);
  };

  return (
    <div style={{ backgroundColor: "#0a0f1e", color: "white", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#4d90fe", fontSize: "36px" }}>SAPPHIRE REBORN</h1>
        <p style={{ opacity: 0.5 }}>{userAddress || "CONNECTED"}</p>
        <div style={{ fontSize: "64px", fontWeight: "900", marginTop: "20px" }}>{power}</div>
      </header>

      <main style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <button onClick={handleVerify} disabled={step1Done} style={{ padding: "18px", borderRadius: "10px", backgroundColor: step1Done ? "#1e293b" : "#334155", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" }}>
          {step1Done ? "✓ 驗證完成" : "1. World ID 身分驗證"}
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#111827", padding: "15px", borderRadius: "12px" }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#050a18", border: "1px solid #333", color: "white", boxSizing: "border-box" }} />
          <button onClick={handleFollowX} disabled={!step1Done || step2Done} style={{ padding: "15px", borderRadius: "10px", backgroundColor: step2Done ? "#1e293b" : "#2563eb", border: "none", color: "white", fontWeight: "bold", cursor: "pointer", opacity: step1Done ? 1 : 0.5 }}>
            {step2Done ? "✓ 已登記並追蹤 X" : "2. 登記資訊並追蹤 X"}
          </button>
        </div>

        <div style={{ textAlign: "center", margin: "20px 0", animation: isSpinning ? "spin 1s linear infinite" : "none", fontSize: "60px" }}>💎</div>

        <button onClick={handleStartSpin} disabled={!step1Done || !step2Done || isSpinning} style={{ padding: "20px", borderRadius: "12px", backgroundColor: (step1Done && step2Done) ? "#3b82f6" : "#1e293b", color: "white", fontWeight: "900", border: "none", cursor: "pointer", opacity: (step1Done && step2Done) ? 1 : 0.5 }}>
          {isSpinning ? "重生中..." : "3. 啟動重生轉盤"}
        </button>
      </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}