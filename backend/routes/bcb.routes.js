import express from 'express';
import fetch from 'node-fetch';
import { executeQuery } from '../config/database.js'; 

const router = express.Router();

const SERIES = {
  ipca: 433,
  igpm: 189,
  ipcbr: 191,
  igpdi: 190,
  inccdi: 192,
  inpc: 188,
  ipcfipe: 193,
  ivar: 7478
};

router.get('/:indice', async (req, res) => {
  const { indice } = req.params;

  if (!SERIES[indice]) {
    return res.status(400).json({ erro: 'Índice inválido' });
  }

  try {
    const codigo = SERIES[indice];

    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados?formato=json`;

    const response = await fetch(url);
    const dados = await response.json();

    // últimos 12 registros
    const ultimos = dados.slice(-12).map(item => ({
      data: item.data,
      valor: Number(item.valor)
    }));

    res.json(ultimos.reverse());
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao consultar BCB' });
  }
});

router.get('/admin/force-update', async (req, res) => {
    try {
        await fetchAndStoreAllIndices();
        res.json({ mensagem: 'Sincronização forçada concluída!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get('/db/:indice', async (req, res) => {
    const { indice } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const sgsCode = SERIES[indice.toLowerCase()];
    if (!sgsCode) return res.status(400).json({ erro: 'Índice inválido' });

    try {
        const sql = `
            SELECT MesAnoReferencia as data, ValorMensal as valor, ValorAcumulado as acumulado
            FROM tblindicesinflacao
            WHERE CodIndice = ?
            ORDER BY MesAnoReferencia DESC
            LIMIT ? OFFSET ?
        `;

        const countSql = `SELECT COUNT(*) as total FROM tblindicesinflacao WHERE CodIndice = ?`;

        console.log(`Buscando índice ${sgsCode} (Página ${page})`);

        const [registros, totalResult] = await Promise.all([
            executeQuery(sql, [sgsCode, limit, offset]),  // passe limit e offset como parâmetros
            executeQuery(countSql, [sgsCode])
        ]);

        const totalRegistros = totalResult[0].total;

        console.log(`Resultado: ${registros.length} linhas encontradas. Total: ${totalRegistros}`);

        const formatados = registros.map(r => ({
            data: new Date(r.data).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }),
            valor: parseFloat(r.valor),
            acumulado: parseFloat(r.acumulado)
        }));

        res.json({
            dados: formatados,
            pagination: {
                page,
                totalPages: Math.ceil(totalRegistros / limit),
                totalItems: totalRegistros
            }
        });
    } catch (err) {
        console.error("Erro ao carregar dados:", err);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

export default router;
