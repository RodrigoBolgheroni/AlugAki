async function carregarTiposImovel(selectId) {
    try {
        const response = await fetch('/api/tipoimovel'); 
        if (!response.ok) throw new Error('Erro ao carregar tipos');

        const tipos = await response.json();

        const select = document.getElementById(selectId);
        if (!select) return;

        // Limpa opções existentes (exceto talvez uma padrão)
        select.innerHTML = '<option value="">Selecione o tipo</option>';

        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.Tipo; 
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar tipos de imóvel:', error);
        alert('Não foi possível carregar os tipos de imóvel.');
    }
}

// Exporta se estiver usando modules, ou deixa global
// Se for script comum, só deixa a função no escopo global