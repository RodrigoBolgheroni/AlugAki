// backend/services/cep.service.js
import fetch from 'node-fetch';

export async function buscarCep(cep) {
  // Remove tudo que não for dígito
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  // Função auxiliar para chamar BrasilAPI
  const buscarNaBrasilAPI = async () => {
    const url = `https://brasilapi.com.br/api/cep/v2/${cepLimpo}`;
    const response = await fetch(url, { timeout: 5000 }); // timeout de 5s

    if (!response.ok) {
      throw new Error(`BrasilAPI: HTTP ${response.status}`);
    }

    const dados = await response.json();

    // BrasilAPI não retorna "erro" como ViaCEP, mas pode ter mensagem
    if (dados.message || !dados.street) {
      throw new Error('CEP não encontrado na BrasilAPI');
    }

    return {
      logradouro: dados.street || '',
      bairro: dados.neighborhood || '',
      cidade: dados.city || '',
      estado: dados.state || '',
      complemento: dados.complement || ''
    };
  };

  // Função auxiliar para chamar ViaCEP (fallback)
  const buscarNoViaCEP = async () => {
    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
    const response = await fetch(url, { timeout: 5000 });

    if (!response.ok) {
      throw new Error(`ViaCEP: HTTP ${response.status}`);
    }

    const dados = await response.json();

    if (dados.erro) {
      throw new Error('CEP não encontrado no ViaCEP');
    }

    return {
      logradouro: dados.logradouro || '',
      bairro: dados.bairro || '',
      cidade: dados.localidade || '',
      estado: dados.uf || '',
      complemento: dados.complemento || ''
    };
  };

  // Tenta primeiro BrasilAPI
  try {
    console.log(`Tentando BrasilAPI para CEP: ${cepLimpo}`);
    return await buscarNaBrasilAPI();
  } catch (erroBrasil) {
    console.warn(`BrasilAPI falhou: ${erroBrasil.message}. Tentando ViaCEP...`);

    // Se BrasilAPI falhar, tenta ViaCEP
    try {
      return await buscarNoViaCEP();
    } catch (erroViaCEP) {
      console.error(`ViaCEP também falhou: ${erroViaCEP.message}`);
      throw new Error('CEP não encontrado em nenhuma fonte');
    }
  }
}