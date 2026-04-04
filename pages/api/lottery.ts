export default async function handler(req, res) {
  const { email, isSapphire } = req.body; // 判斷是否為藍寶石會員

  // Harris 抽獎隨機機率：普通人 10%，藍寶石 30%
  const winChance = isSapphire ? 0.3 : 0.1;
  const random = Math.random();

  if (random < winChance) {
    // 中獎：隨機給予 5 ~ 50 WLD 等值的寶石
    const prize = Math.floor(Math.random() * 46) + 5;
    return res.status(200).json({ win: true, prize });
  } else {
    // 沒中獎
    return res.status(200).json({ win: false, prize: 0 });
  }
}