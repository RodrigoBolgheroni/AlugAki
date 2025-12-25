import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

import bcbRoutes from './backend/routes/bcb.routes.js';
import ufRoutes from './backend/routes/uf.routes.js';
import cepRoutes from './backend/routes/cep.routes.js';
import tipoimovelRoutes from './backend/routes/tipoimovel.routes.js';
import statusalocacaoRoutes from './backend/routes/statusalocacao.routes.js';
import { fetchAndStoreAllIndices } from './backend/services/bcb.service.js';
import { testConnection } from './backend/config/database.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve arquivos estáticos da pasta public (CSS, JS, imagens, HTMLs)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Rotas API
app.use('/api/bcb', bcbRoutes);
app.use('/api/uf', ufRoutes);
app.use('/api/cep', cepRoutes);
app.use('/api/tipoimovel', tipoimovelRoutes);
app.use('/api/statusalocacao', statusalocacaoRoutes);

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/index.html'));
});

// Agendamento mensal
cron.schedule('0 0 1 * *', async () => {
    console.log('Rotina mensal iniciada: Buscando índices do BCB...');
    await fetchAndStoreAllIndices();
});

app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    try {
        await testConnection();
    } catch (err) {
        console.error('ERRO CRÍTICO: Não conectou ao banco.', err);
    }
});