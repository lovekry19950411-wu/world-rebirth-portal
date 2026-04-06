import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const USERS_SHEET_TITLE = 'SapphireUsers';
const DEFAULT_POWER = 100;

function getAuth() {
  return new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function getUsersSheet(doc: GoogleSpreadsheet) {
  await doc.loadInfo();
  let sheet = doc.sheetsByTitle[USERS_SHEET_TITLE];
  if (!sheet) {
    sheet = await doc.addSheet({
      title: USERS_SHEET_TITLE,
      headerValues: ['NullifierHash', 'Email', 'Power', 'UpdatedAt'],
    });
  }
  return sheet;
}

function parsePower(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : DEFAULT_POWER;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    return res.status(503).json({ ok: false, code: 'SHEETS_NOT_CONFIGURED' });
  }

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, getAuth());

  try {
    if (req.method === 'GET') {
      const nullifier_hash = req.query.nullifier_hash;
      if (!nullifier_hash || typeof nullifier_hash !== 'string') {
        return res.status(400).json({ ok: false, message: 'missing nullifier_hash' });
      }

      const sheet = await getUsersSheet(doc);
      const rows = await sheet.getRows();
      const row = rows.find((r) => r.get('NullifierHash') === nullifier_hash);
      if (!row) {
        return res.status(404).json({ ok: false, code: 'NOT_FOUND' });
      }

      return res.status(200).json({
        ok: true,
        email: String(row.get('Email') || ''),
        power: parsePower(row.get('Power')),
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
    }

    const body = req.body as {
      action?: string;
      nullifier_hash?: string;
      email?: string;
      delta?: number;
    };

    const { action, nullifier_hash, email, delta } = body;
    if (!nullifier_hash || typeof nullifier_hash !== 'string') {
      return res.status(400).json({ ok: false, message: 'missing nullifier_hash' });
    }

    const sheet = await getUsersSheet(doc);
    const rows = await sheet.getRows();
    let row = rows.find((r) => r.get('NullifierHash') === nullifier_hash);
    const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    if (action === 'ensure') {
      if (!row) {
        await sheet.addRow({
          NullifierHash: nullifier_hash,
          Email: '',
          Power: DEFAULT_POWER,
          UpdatedAt: now,
        });
        return res.status(200).json({ ok: true, email: '', power: DEFAULT_POWER });
      }
      return res.status(200).json({
        ok: true,
        email: String(row.get('Email') || ''),
        power: parsePower(row.get('Power')),
      });
    }

    if (action === 'set_email') {
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ ok: false, message: 'invalid email' });
      }
      if (!row) {
        await sheet.addRow({
          NullifierHash: nullifier_hash,
          Email: email,
          Power: DEFAULT_POWER,
          UpdatedAt: now,
        });
        return res.status(200).json({ ok: true, email, power: DEFAULT_POWER });
      }
      row.assign({ Email: email, UpdatedAt: now });
      await row.save();
      return res.status(200).json({ ok: true, email, power: parsePower(row.get('Power')) });
    }

    if (action === 'add_power') {
      const d = Number(delta);
      if (!Number.isFinite(d) || d <= 0 || d > 500) {
        return res.status(400).json({ ok: false, message: 'invalid delta' });
      }
      if (!row) {
        await sheet.addRow({
          NullifierHash: nullifier_hash,
          Email: '',
          Power: DEFAULT_POWER + d,
          UpdatedAt: now,
        });
        return res.status(200).json({ ok: true, power: DEFAULT_POWER + d });
      }
      const next = parsePower(row.get('Power')) + d;
      row.assign({ Power: next, UpdatedAt: now });
      await row.save();
      return res.status(200).json({ ok: true, power: next });
    }

    return res.status(400).json({ ok: false, message: 'unknown action' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'error';
    return res.status(500).json({ ok: false, message });
  }
}
