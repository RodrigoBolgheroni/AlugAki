// ============================================
// STATUS LOCAÇÃO ROUTES
// ============================================
// Define apenas as rotas e chama os controllers

import express from 'express';
import { getStatusLocacao } from '../controllers/statusalocacao.controller.js';

const router = express.Router();

// GET /api/statusalocacao - Lista todos os status de locação
router.get('/', getStatusLocacao);

export default router;