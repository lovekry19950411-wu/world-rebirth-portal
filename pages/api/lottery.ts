import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. 限制僅允許 POST 請求，防止他人透過網址直接訪問
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, isSapphire } = req.body;

  try {
    // 2. 抽獎邏輯：根據會員等級決定機率
    const winChance = isSapphire ? 0.3 : 0.1;
    const random = Math.random();
    const isWin = random < winChance;
    
    // 中獎：隨機給予 5 ~ 50 寶石；沒中則為 0
    const prize = isWin ? Math.floor(Math.random() * 46) + 5 : 0;

    // 3. 初始化 Google Sheets 認證
    const serviceAccountAuth = new JWT({
      // 這裡會從 Vercel 的環境變數讀取服務帳號 Email
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, 
      // 處理私鑰中的換行符號，這是 Vercel 部署最常出錯的地方
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // 使用截圖中的第一個工作表

    // 4. 將結果寫入試算表，方便你後續對帳
    await sheet.addRow({
      Time: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
      Email: email || 'Anonymous',
      Status: isSapphire ? '藍寶石會員' : '普通會員',
      Result: isWin ? '中獎' : '沒中獎',
      Prize: prize,
      Hash: `PROB_${winChance}_RAND_${random.toFixed(4)}`
    });

    // 5. 回傳結果給前端
    return res.status(200).json({ 
      win: isWin, 
      prize: prize,
      message: isWin ? `恭喜中獎！獲得 ${prize} 寶石` : '很可惜，下次再試試'
    });

  } catch (error: any) {
    // 捕捉並記錄錯誤，防止伺服器崩潰
    console.error('Lottery API Error:', error);
    return res.status(500).json({ message: '內部伺服器錯誤', error: error.message });
  }
}