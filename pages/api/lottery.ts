import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email, isSapphire } = req.body;

  try {
    const winChance = isSapphire ? 0.3 : 0.1;
    const random = Math.random();
    const isWin = random < winChance;
    const prize = isWin ? Math.floor(Math.random() * 46) + 5 : 0;

    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      Time: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
      Email: email || 'Anonymous',
      Status: isSapphire ? '藍寶石' : '普通',
      Result: isWin ? '中獎' : '沒中獎',
      Prize: prize
    });

    return res.status(200).json({ win: isWin, prize });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}