import { executeQuery } from '../config/database.js';

export async function listarUfs() {
  const query = 'SELECT Id, Nome AS nome FROM tbluf WHERE Ativo = 1 ORDER BY Nome';
  const rows = await executeQuery(query);
  return rows; 
}

