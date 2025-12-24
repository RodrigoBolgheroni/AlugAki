async function carregarEstados() {
    try {
      const response = await fetch('/api/uf');
      
      if (!response.ok) throw new Error('Erro ao carregar estados');
  
      const estados = await response.json();
      console.log(estados)
  
      estados.sort((a, b) => a.nome.localeCompare(b.nome));
  
      const selects = document.querySelectorAll('.estado-select');
  
      selects.forEach(select => {
        // Limpa opções existentes (exceto a primeira de loading)
        select.innerHTML = '<option value="">Selecione o estado</option>';
  
        // Preenche com os estados do banco
        estados.forEach(estado => {
          const option = document.createElement('option');
          option.value = estado.sigla;     // ou estado.id se preferir
          option.textContent = estado.nome;
          select.appendChild(option);
        });
  
      });
  
    } catch (error) {
      console.error('Erro ao carregar estados:', error);
      
      document.querySelectorAll('.estado-select').forEach(select => {
        select.innerHTML = '<option value="">Erro ao carregar estados</option>';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', carregarEstados);