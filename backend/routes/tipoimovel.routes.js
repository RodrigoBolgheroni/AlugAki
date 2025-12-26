// ============================================
// TIPO IMÓVEL ROUTES
// ============================================
// Define apenas as rotas e chama os controllers

import express from 'express';
import { getTiposImovel } from '../controllers/tipoimovel.controller.js';

const router = express.Router();

// GET /api/tipoimovel - Lista todos os tipos de imóveis
router.get('/', getTiposImovel);

export default router;