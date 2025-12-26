// ============================================
// UF CONTROLLER
// ============================================
// Responsável por receber requisições e retornar respostas

import { listarUfs } from '../services/uf.service.js';
import { asyncHandler } from '../middlewares/Asynchandler.middleware.js';


export const getUfs = asyncHandler(async (req, res) => {
  const ufs = await listarUfs();
  
  res.status(200).json(ufs);
});