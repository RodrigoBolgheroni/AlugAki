import express from 'express';
import fetch from 'node-fetch';

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

export default router;
