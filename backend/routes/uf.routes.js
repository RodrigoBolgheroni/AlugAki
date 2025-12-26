// ============================================
// UF ROUTES
// ============================================
// Define apenas as rotas e chama os controllers

import express from 'express';
import { getUfs } from '../controllers/uf.controller.js';

const router = express.Router();

// GET /api/uf - Lista todos os estados
router.get('/', getUfs);

export default router;