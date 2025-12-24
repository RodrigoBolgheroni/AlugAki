// backend/routes/cep.routes.js
import express from 'express';
import { buscarCep } from '../services/cep.service.js';

const router = express.Router();

router.get('/:cep', async (req, res) => {
  const { cep } = req.params;

  try {
    const endereco = await buscarCep(cep);
    res.json(endereco);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

export default router;