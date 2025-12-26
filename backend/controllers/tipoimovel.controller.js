// ============================================
// TIPO IMÓVEL CONTROLLER
// ============================================
// Responsável por receber requisições e retornar respostas

import { listarTipoImovel } from '../services/tipoimovel.service.js';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';

// GET /api/tipoimovel - Lista todos os tipos de imóveis ativos
export const getTiposImovel = asyncHandler(async (req, res) => {
  const tipos = await listarTipoImovel();
  
  res.status(200).json(tipos);
});