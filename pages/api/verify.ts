import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  // 這裡接收 World ID 傳回的結果
  const { nullifier_hash } = req.body;

  try {
    // 這裡放置你原本的 World ID 驗證邏輯
    console.log("Verified hash:", nullifier_hash);
    return res.status(200).json({ success: true, hash: nullifier_hash });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}