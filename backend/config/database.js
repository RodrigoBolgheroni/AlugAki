// ============================================
// DATABASE CONFIGURATION - VERSÃO MELHORADA
// ============================================

import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();


const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `  Variáveis de ambiente faltando: ${missingEnvVars.join(', ')}\n` +
    `Configure o arquivo .env antes de iniciar o servidor.`
  );
}

// ============================================
// CONFIGURAÇÃO DO POOL DE CONEXÕES
// ============================================
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  
  // Configurações de Pool
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  
  // Configurações de Timeout
  connectTimeout: 10000, // 10 segundos
  acquireTimeout: 10000,
  
  // Configurações de Charset
  charset: 'utf8mb4',
  
  // Timezone
  timezone: process.env.DB_TIMEZONE || '-03:00', // Horário de Brasília
  
  // Habilita múltiplas queries (use com cuidado)
  multipleStatements: false,
  
  // Configurações de segurança
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

const pool = createPool(poolConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('    Conexão com o banco de dados estabelecida com sucesso!');
    console.log(`    Database: ${process.env.DB_NAME}`);
    console.log(`    Host: ${process.env.DB_HOST}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('   Erro ao conectar com o banco de dados:');
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   Código: ${error.code}`);
    
    // Mensagens de erro mais amigáveis
    if (error.code === 'ECONNREFUSED') {
      console.error('   Verifique se o MySQL está rodando e acessível.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Verifique as credenciais (usuário/senha) no arquivo .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   O banco de dados especificado não existe.');
    }
    
    throw error;
  }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
async function closePool() {
  try {
    await pool.end();
    console.log('   Pool de conexões encerrado com sucesso.');
  } catch (error) {
    console.error('  Erro ao encerrar pool de conexões:', error.message);
    throw error;
  }
}

// Encerra conexões quando o processo termina
process.on('SIGINT', async () => {
  console.log('\n Recebido sinal de interrupção (SIGINT)');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n Recebido sinal de término (SIGTERM)');
  await closePool();
  process.exit(0);
});

export async function executeQuery(query, params = []) {
    try {
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('   Erro ao executar query:', error.message);
      console.error('   Query:', query);
      console.error('   Params:', JSON.stringify(params).substring(0, 200) + "..."); 
      throw error;
    }
  }


export async function transaction(callback) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const result = await callback(connection);
    
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error(' Transação revertida devido a erro:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

export function getPoolStats() {
  return {
    total: pool.pool._allConnections.length,
    active: pool.pool._allConnections.length - pool.pool._freeConnections.length,
    idle: pool.pool._freeConnections.length,
    waiting: pool.pool._connectionQueue.length
  };
}

// ============================================
// EXPORTS
// ============================================
export default pool;
export { testConnection, closePool };