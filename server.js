import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

// Rotas e Serviços
import bcbRoutes from './backend/routes/bcb.routes.js';
import { fetchAndStoreAllIndices } from './backend/services/bcb.service.js';
import { testConnection } from './backend/config/database.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================
// AGENDAMENTO (Todo dia 1 às 00:00)
// ==============================
cron.schedule('0 0 1 * *', async () => {
    console.log('Rotina mensal iniciada: Buscando índices do BCB...');
    await fetchAndStoreAllIndices();
});

app.use(express.json());

// 1️⃣ API
app.use('/api/bcb', bcbRoutes);

// 2️⃣ ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'public')));

// 3️⃣ FALLBACK
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, async () => {
    console.log(` Servidor rodando em http://localhost:${PORT}`);
    
    try {
        testConnection();
        //fetchAndStoreAllIndices();
    } catch (err) {
        console.error('ERRO CRÍTICO: Não conectou ao banco.');
    }
});