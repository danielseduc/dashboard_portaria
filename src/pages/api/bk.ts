import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { startDate, endDate, nome } = req.query;

  const connection = await mysql.createConnection({
    host: '165.22.39.208',
    user: 'assu_readonly',
    password: 'sZmk-bh8qHyuxXf_QQJaWmt3f',
    database: 'gw_assu',
  });

  let query = `
    SELECT
      entradas.entradaId as 'entradaid',
      func.dentro as 'dentro',
      func.identificacao as 'funcionarioid',
      func.nome as 'funcionario',
      func.funcao as 'funcao',
      func.contratante as 'contratante',
      func.contratada as 'contratada',
      DATE_FORMAT(CONVERT_TZ(entradas.dataHora, '+00:00', '-03:00'), '%d/%m/%Y %H:%i:%s') AS 'datahoraentrada',
      DATE_FORMAT(CONVERT_TZ(saidas.dataHora, '+00:00', '-03:00'), '%d/%m/%Y %H:%i:%s') AS 'datahorasaida',
      portaria.descricao as 'portaria_entrada',
      porteiro.nome as 'porteiro_entrada',
      liberador.nome as 'liberador',
      equip.identificacao as 'equipamentoid',
      equip.nome as 'equipamento',
      equip.tipo as 'tipo',
      equip.placa as 'placa',
      entradas.registroManual as 'entradamanual',
      portaria_saida.descricao as 'portariasaida',
      porteiro_saida.nome as 'porteirosaida',
      saidas.registroManual as 'saidamanual'
    FROM gw_assu.entradas entradas
    JOIN gw_assu.funcionarios func ON entradas.funcionarioId = func.funcionarioId
    LEFT JOIN gw_assu.entradas entradas_equip ON entradas.entradaReferenciaId = entradas_equip.entradaId
    LEFT JOIN gw_assu.equipamentos equip ON entradas_equip.equipamentoId = equip.equipamentoId
    LEFT JOIN gw_assu.portarias portaria ON entradas.portariaId = portaria.portariaId
    LEFT JOIN gw_assu.porteiros porteiro ON entradas.porteiroId = porteiro.porteiroId
    LEFT JOIN gw_assu.liberadores liberador ON entradas.liberadorId = liberador.liberadorId
    LEFT JOIN gw_assu.saidas saidas ON saidas.entradaId = entradas.entradaId
    LEFT JOIN gw_assu.portarias portaria_saida ON saidas.portariaId = portaria_saida.portariaId
    LEFT JOIN gw_assu.porteiros porteiro_saida ON saidas.porteiroId = porteiro_saida.porteiroId
    WHERE entradas.funcionarioId IS NOT NULL
  `;

  if (startDate && endDate) {
    query += ` AND entradas.dataHora BETWEEN ${connection.escape(startDate)} AND ${connection.escape(endDate)}`;
  } 
  else if (nome) {
    query += ` AND func.nome LIKE ${connection.escape('%' + nome + '%')}`;
  }  
  else {
    const today = new Date().toISOString().slice(0, 10);
    query += ` AND DATE(entradas.dataHora) = ${connection.escape(today)}`;
  }

  query += ' ORDER BY entradas.entradaId DESC;';

  try {
    const [rows] = await connection.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    await connection.end();
  }
}
