import { testConnection, executeQuery, closePool } from './backend/config/database.js';

async function runTest() {
  try {
    // 1. Testar a conexão inicial
    await testConnection();

    // 2. Testar uma query simples
    console.log('Executando query de teste...');
    const result = await executeQuery('SELECT 1 + 1 AS result');
    console.log('Resultado da query:', result[0].result === 2 ? '✅ Sucesso' : '❌ Falha');

    // 3. Testar se o erro de variável faltando funciona
    // (Opcional: você pode comentar as variáveis no .env para ver o erro acontecer)

  } catch (error) {
    console.error('Falha no teste:', error.message);
  } finally {
    // 4. Fechar o pool para o script terminar
    await closePool();
    process.exit(0);
  }
}

runTest();