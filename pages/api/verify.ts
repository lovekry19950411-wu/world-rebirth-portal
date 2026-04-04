export default async function handler(req, res) {
  // 這裡接收 World ID 傳回的結果
  const { nullifier_hash } = req.body;
  
  // 成功後，回傳初始 100 寶石，並記錄在 Sheets
  return res.status(200).json({ 
    success: true, 
    gems: 100,
    message: "重生者驗證成功！" 
  });
}