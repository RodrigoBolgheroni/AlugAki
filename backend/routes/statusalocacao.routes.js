import express from 'express';
import { listarStatusAlocacao} from '../services/statusalocacao.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const statusalocacao = await listarStatusAlocacao();
    res.json(statusalocacao);
  } catch (error) {
    console.error('Erro ao buscar Status da locação:', error);
    res.status(500).json({ error: 'Erro interno ao buscar status da locação' });
  }
});

export default router;