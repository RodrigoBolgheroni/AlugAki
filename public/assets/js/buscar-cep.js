async function buscarCepNoInput() {
    const inputCep = document.getElementById('cep');
    const btnBusca = document.getElementById('btn-buscar-cep');
    
    if (!inputCep) return;

    async function executarBusca() {
        // Remove hífens ou espaços para a API
        const cep = inputCep.value.replace(/\D/g, '');

        if (cep.length !== 8) return;

        try {
            // Mostra um estado de "carregando" nos campos (opcional)
            document.getElementById('logradouro').value = "Carregando...";

            const response = await fetch(`/api/cep/${cep}`);
            if (!response.ok) throw new Error('CEP inválido');

            const dados = await response.json();

            // Preenche os campos pelos IDs que adicionamos no HTML
            document.getElementById('logradouro').value = dados.logradouro || '';
            document.getElementById('bairro').value = dados.bairro || '';
            document.getElementById('cidade').value = dados.cidade || '';

            // Preenche o select de estado (id="estado")
            const selectEstado = document.getElementById('estado');
            if (selectEstado && dados.estado) {
                selectEstado.value = dados.estado; // Certifique-se que a API retorna a sigla (ex: "SP")
            }

            // Foca no campo número após o preenchimento
            document.getElementById('numero')?.focus();

        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            alert("CEP não encontrado. Por favor, preencha manualmente.");
            inputCep.focus();
        }
    }

    // Evento ao sair do campo (blur)
    inputCep.addEventListener('blur', executarBusca);

    // Evento ao clicar no botão "Buscar"
    if (btnBusca) {
        btnBusca.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que o form tente enviar
            executarBusca();
        });
    }
}

document.addEventListener('DOMContentLoaded', buscarCepNoInput);