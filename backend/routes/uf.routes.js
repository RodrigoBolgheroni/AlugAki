import express from 'express';
import { listarUfs } from '../services/uf.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const ufs = await listarUfs();
    res.json(ufs);
  } catch (error) {
    console.error('Erro ao buscar UFs:', error);
    res.status(500).json({ error: 'Erro interno ao buscar estados' });
  }
});

export default router;