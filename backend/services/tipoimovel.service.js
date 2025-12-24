import { executeQuery } from '../config/database.js';

export async function listarTipoImovel() {
  const query = 'SELECT Id, Tipo FROM tbltipoimovel WHERE Ativo = 1';
  const rows = await executeQuery(query);
  return rows; 
}