import { executeQuery } from '../config/database.js';
import fetch from 'node-fetch';

function calcularAcumulado12Meses(dados, indexAtual) {
  if (indexAtual < 12) return 0; 

  let fatorAcumulado = 1;

  for (let i = 1; i <= 12; i++) {
      const valorMensal = parseFloat(dados[indexAtual - i].valor);
      fatorAcumulado *= (1 + (valorMensal / 100));
  }
  
  return ((fatorAcumulado - 1) * 100).toFixed(4);
}

export async function fetchAndStoreAllIndices() {
  const usuarioSistemaId = 1;
  const SERIES = { 433: 'IPCA', 189: 'IGP-M', 191: 'IPC-Br', 190: 'IGP-DI', 192: 'INCC-DI', 188: 'INPC', 193: 'IPC-Fipe', 7478: 'IVAR' };

  for (const [sgsCode, nome] of Object.entries(SERIES)) {
      try {
          const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${sgsCode}/dados?formato=json`;
          const response = await fetch(url);
          const dados = await response.json();

          // Pegamos apenas o necessário para não estourar o limite de pacotes do MySQL
          const ultimosDados = dados.slice(-60); // Últimos 5 anos

          const valoresFinais = ultimosDados.map((registro, index) => {
              const [dia, mes, ano] = registro.data.split('/');
              const acumulado = calcularAcumulado12Meses(ultimosDados, index);
              
              return [
                  sgsCode, 
                  nome, 
                  `${ano}-${mes}-${dia}`, 
                  parseFloat(registro.valor), 
                  parseFloat(acumulado), 
                  usuarioSistemaId, 
                  usuarioSistemaId,
                  new Date(), 
                  new Date()
              ];
          });

          // CORREÇÃO DA QUERY:
          // O mysql2 usa a sintaxe VALUES ? (sem parênteses no ?) para bulk inserts
          const query = `
              INSERT INTO tblindicesinflacao (
                  CodIndice, Indice, MesAnoReferencia, ValorMensal, 
                  ValorAcumulado, UsuarioInsercaoId, UsuarioAlteracaoId,
                  DataInsercao, DataAlteracao
              ) VALUES ? 
              ON DUPLICATE KEY UPDATE 
                  ValorMensal = VALUES(ValorMensal),
                  ValorAcumulado = VALUES(ValorAcumulado),
                  DataAlteracao = NOW()`;

          // O SEGREDO: Passar [valoresFinais] dentro de um array.
          // O executeQuery deve receber [ [ [col1, col2], [col1, col2] ] ]
          await executeQuery(query, [valoresFinais]);
          
          console.log(`✅ ${nome} sincronizado com sucesso.`);

      } catch (error) {
          console.error(`❌ Erro no cálculo de ${nome}:`, error.message);
      }
  }
}