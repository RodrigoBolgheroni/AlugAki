import { executeQuery } from '../config/database.js';

export async function listarStatusAlocacao() {
  const query = 'SELECT Id, StatusAlocacao FROM tblstatuslocacao WHERE Ativo = 1';
  const rows = await executeQuery(query);
  return rows; 
}

