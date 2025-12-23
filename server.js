import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import bcbRoutes from './backend/routes/bcb.routes.js';

const app = express();
const PORT = 3000;

// ===== fix para __dirname em ES module =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================
// 1️⃣ API PRIMEIRO
// ==============================
app.use('/api/bcb', bcbRoutes);

// ==============================
// 2️⃣ ARQUIVOS ESTÁTICOS
// ==============================
app.use(express.static(path.join(__dirname, 'public')));

// ==============================
// 3️⃣ INDEX
// ==============================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
