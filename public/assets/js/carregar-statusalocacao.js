async function carregarStatusalocacao() {
    try {
      const response = await fetch('/api/statusalocacao');
      
      if (!response.ok) throw new Error('Erro ao carregar status de alocação');
  
      const listaStatus = await response.json();
  
      // Ordena pelo nome (StatusAlocacao)
      listaStatus.sort((a, b) => a.StatusAlocacao.localeCompare(b.StatusAlocacao));
  
      const selects = document.querySelectorAll('.statusalocacao-select');
  
      selects.forEach(select => {
        select.innerHTML = '<option value="">Selecione o status de alocação</option>';
  
        listaStatus.forEach(item => {
          const option = document.createElement('option');
          // Usamos o Id para salvar no banco e StatusAlocacao para mostrar ao usuário
          option.value = item.Id;    
          option.textContent = item.StatusAlocacao;
          select.appendChild(option);
        });
      });
  
    } catch (error) {
      console.error('Erro ao carregar statusalocacao:', error);
      
      document.querySelectorAll('.statusalocacao-select').forEach(select => {
        select.innerHTML = '<option value="">Erro ao carregar status</option>';
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', carregarStatusalocacao);