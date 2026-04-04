import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 限制僅允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, isSapphire } = req.body;

  try {
    // 1. 抽獎邏輯
    // Harris 抽獎隨機機率：普通人 10%，藍寶石 30%
    const winChance = isSapphire ? 0.3 : 0.1;
    const random = Math.random();
    const isWin = random < winChance;
    
    // 中獎：隨機給予 5 ~ 50 WLD 等值的寶石；沒中則為 0
    const prize = isWin ? Math.floor(Math.random() * 46) + 5 : 0;

    // 2. 初始化 Google Sheets 認證
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, // 應為 world-id-portal@...
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // 處理換行符號
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // 使用第一個工作表

    // 3. 將結果寫入試算表
    await sheet.addRow({
      Time: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
      Email: email || 'Anonymous',
      Status: isSapphire ? '藍寶石會員' : '普通會員',
      Result: isWin ? '中獎' : '沒中獎',
      Prize: prize,
      Hash: `PROB_${winChance}_RAND_${random.toFixed(4)}`
    });

    // 4. 回傳結果給前端
    return res.status(200).json({ 
      win: isWin, 
      prize: prize,
      message: isWin ? `恭喜中獎！獲得 ${prize} 寶石` : '很可惜，下次再試試'
    });

  } catch (error: