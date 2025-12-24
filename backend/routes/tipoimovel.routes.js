import express from 'express';
import { listarTipoImovel} from '../services/tipoimovel.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tipoimovel = await listarTipoImovel();
    res.json(tipoimovel);
  } catch (error) {
    console.error('Erro ao buscar Tipos de Imoveis:', error);
    res.status(500).json({ error: 'Erro interno ao buscar tipo de imoveis' });
  }
});

export default router;