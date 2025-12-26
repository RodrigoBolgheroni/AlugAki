// ============================================
// SERVER.JS - SERVIDOR PRINCIPAL
// ============================================

import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { testConnection } from './backend/config/database.js';
import { fetchAndStoreAllIndices } from './backend/services/bcb.service.js';
import routes from './backend/index.js';
import { errorHandler, notFoundHandler } from './backend/middlewares/error.middleware.js';

dotenv.config();

// Converte BigInt para String no JSON (para compatibilidade)
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('public'));

// ============================================
// ROTAS
// ============================================
routes(app);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// MIDDLEWARES DE ERRO (DEVEM SER OS ÚLTIMOS!)
// ============================================
app.use(notFoundHandler);  // Rota 404
app.use(errorHandler);     // Erros globais

// ============================================
// CRON JOB - Atualização automática BCB
// ============================================
cron.schedule('0 9 * * *', async () => {
  console.log('🔄 Iniciando sincronização automática dos índices BCB...');
  try {
    await fetchAndStoreAllIndices();
    console.log('✅ Sincronização concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na sincronização automática:', error.message);
  }
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================
app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  
  try {
    await testConnection();
  } catch (error) {
    console.error('❌ Falha ao conectar com o banco. Verifique as configurações.');
    process.exit(1);
  }
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Encerrando servidor...');
  process.exit(0);
});