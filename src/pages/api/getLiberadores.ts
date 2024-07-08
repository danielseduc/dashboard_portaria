import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const connection = await mysql.createConnection({
    host: '165.22.39.208',
    user: 'assu_readonly',
    password: 'sZmk-bh8qHyuxXf_QQJaWmt3f',
    database: 'gw_assu',
  });

  let query = `
  select
    liberadorId,
    obraId,
    nome
  from gw_assu.liberadores
  `;

  try {
    const [rows] = await connection.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    await connection.end();
  }
}
