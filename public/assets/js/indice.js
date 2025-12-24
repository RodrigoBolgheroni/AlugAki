let currentPage = 1;
let currentIndice = 'igpm'; // Padrão

async function carregarDados(indiceNome, page = 1) {
    const tableBody = document.getElementById('table-body');
    const paginationInfo = document.getElementById('pagination-info');
    const btnPrev = document.getElementById('prev-page');
    const btnNext = document.getElementById('next-page');

    currentIndice = indiceNome;
    currentPage = page;

    tableBody.innerHTML = `
    <tr>
        <td colspan="3">
            <div class="loading-container">
                <div class="spinner"></div>
                <span>Carregando dados...</span>
            </div>
        </td>
    </tr>
`;

    try {
        const response = await fetch(`/api/bcb/db/${indiceNome}?page=${page}`);
        if (!response.ok) throw new Error('Falha na resposta do servidor');
        
        const result = await response.json();

        // Limpa a tabela
        tableBody.innerHTML = '';

        if (!result.dados || result.dados.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">Nenhum dado encontrado para este período.</td></tr>';
            paginationInfo.innerText = "Página 0 de 0";
            return;
        }

        // Renderiza as linhas
        result.dados.forEach(item => {
            const row = `
                <tr>
                    <td>${item.data}</td>
                    <td>${item.valor.toFixed(2)}%</td>
                    <td>${item.acumulado.toFixed(4)}%</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // Atualiza a interface de paginação
        const { pagination } = result;
        paginationInfo.innerText = `Página ${pagination.page} de ${pagination.totalPages}`;
        
        btnPrev.disabled = pagination.page <= 1;
        btnNext.disabled = pagination.page >= pagination.totalPages;

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        tableBody.innerHTML = '<tr><td colspan="3" style="color: #ff6b6b;">Erro ao conectar com o servidor. Verifique o console.</td></tr>';
    }
}

// Configura os ouvintes de clique nos botões de paginação
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) carregarDados(currentIndice, currentPage - 1);
});

document.getElementById('next-page').addEventListener('click', () => {
    carregarDados(currentIndice, currentPage + 1);
});

// Configura os ouvintes nos Radio Buttons (Tabs)
document.querySelectorAll('input[name="indice"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        carregarDados(e.target.value, 1); // Volta para a página 1 ao trocar de índice
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarDados('igpm', 1);
});