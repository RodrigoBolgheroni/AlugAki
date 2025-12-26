// ============================================
// STATUS LOCAÇÃO CONTROLLER
// ============================================
// Responsável por receber requisições e retornar respostas

import { listarStatusAlocacao } from '../services/statusalocacao.service.js';
import { asyncHandler } from '../middlewares/Asynchandler.middleware.js';

// GET /api/statusalocacao - Lista todos os status de locação ativos
export const getStatusLocacao = asyncHandler(async (req, res) => {
  const status = await listarStatusAlocacao();
  
  res.status(200).json(status);
});