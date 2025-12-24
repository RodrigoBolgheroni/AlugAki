// ============================
// VARIÁVEIS GLOBAIS
// ============================
let currentPage = 1;
let currentIndice = 'igpm';
let todosOsDados = [];       // Todos os registros do índice atual
let dadosFiltrados = [];     // Após filtro
const ITEMS_PER_PAGE = 12;

// ============================
// CARREGA TODOS OS DADOS DO ÍNDICE (uma vez por troca de aba)
// ============================
async function carregarTodosOsDados(indiceNome) {
    const tableBody = document.getElementById('table-body');
    const tabelaContainer = document.getElementById('tabela-container');

    currentIndice = indiceNome;
    currentPage = 1;

    tabelaContainer.classList.add('loading');
    tableBody.innerHTML = '';

    try {
        // 1. Busca página 1 para saber quantas páginas existem
        const response = await fetch(`/api/bcb/db/${indiceNome}?page=1`);
        if (!response.ok) throw new Error('Falha na resposta do servidor');

        const primeiraPagina = await response.json();
        const totalPages = primeiraPagina.pagination.totalPages || 1;

        // 2. Busca todas as páginas em paralelo
        const promises = [];
        for (let page = 1; page <= totalPages; page++) {
            promises.push(fetch(`/api/bcb/db/${indiceNome}?page=${page}`).then(r => r.json()));
        }

        const todasPaginas = await Promise.all(promises);

        // 3. Junta todos os dados
        todosOsDados = [];
        todasPaginas.forEach(pagina => {
            if (pagina.dados) {
                pagina.dados.forEach(item => {
                    todosOsDados.push({
                        ...item,
                        indice: indiceNome.toUpperCase()
                    });
                });
            }
        });

        // 4. Ordena: mais recente primeiro
        todosOsDados.sort((a, b) => {
            const [mesA, anoA] = a.data.split('/');
            const [mesB, anoB] = b.data.split('/');
            return (parseInt(anoB) - parseInt(anoA)) || (parseInt(mesB) - parseInt(mesA));
        });

        // 5. Aplica filtro atual (se houver) e renderiza
        aplicarFiltroEPaginacao();

    } catch (error) {
        console.error("Erro ao carregar dados completos:", error);
        tabelaContainer.classList.remove('loading');
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:60px; color:#ff6b6b;">
                    Erro ao carregar os dados.<br>
                    <small>Verifique sua conexão ou tente novamente.</small>
                </td>
            </tr>
        `;
    }
}

// ============================
// FILTRA E PAGINA NO CLIENTE
// ============================
function aplicarFiltroEPaginacao() {
    const mesInput = document.getElementById('search-mes')?.value.trim().toLowerCase() || '';
    const anoInput = document.getElementById('search-ano')?.value.trim() || '';

    const tableBody = document.getElementById('table-body');
    const tabelaContainer = document.getElementById('tabela-container');
    const paginationInfo = document.getElementById('pagination-info');
    const btnPrev = document.getElementById('prev-page');
    const btnNext = document.getElementById('next-page');
    const clearBtn = document.getElementById('clear-search');

    // Filtra
    dadosFiltrados = todosOsDados.filter(item => {
        const [mes, ano] = item.data.split('/');
        const mesNum = mes.padStart(2, '0');
        const mesNome = new Date(2024, parseInt(mes) - 1, 1)
            .toLocaleString('pt-BR', { month: 'short' })
            .replace('.', '')
            .toLowerCase();

        const anoCompleto = ano;
        const anoCurto = ano.slice(-2);

        const passaMes = !mesInput ||
            mesNum.includes(mesInput.padStart(2, '0')) ||
            mesNome.includes(mesInput) ||
            mes.includes(mesInput);

        const passaAno = !anoInput ||
            anoCompleto.includes(anoInput) ||
            anoCurto.includes(anoInput);

        return passaMes && passaAno;
    });

    // Paginação
    const totalItems = dadosFiltrados.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages); // evita página inválida

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginaAtual = dadosFiltrados.slice(start, end);

    // Renderiza
    tableBody.innerHTML = '';
    if (paginaAtual.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:60px; color:#999;">
                    ${totalItems === 0 ? 'Nenhum dado disponível.' : 'Nenhum resultado encontrado para o filtro.'}
                </td>
            </tr>
        `;
        paginationInfo.innerText = "Página 0 de 0";
        btnPrev.disabled = true;
        btnNext.disabled = true;
    } else {
        paginaAtual.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.indice}</td>
                <td>${item.data}</td>
                <td>${item.valor.toFixed(2)}%</td>
                <td>${item.acumulado.toFixed(4)}%</td>
            `;
            tableBody.appendChild(row);
        });

        paginationInfo.innerText = `Página ${currentPage} de ${totalPages} (${totalItems} resultados)`;
        btnPrev.disabled = currentPage <= 1;
        btnNext.disabled = currentPage >= totalPages;
    }

    tabelaContainer.classList.remove('loading');

    // Botão limpar
    if (mesInput || anoInput) {
        clearBtn?.classList.add('visible');
    } else {
        clearBtn?.classList.remove('visible');
    }
}

// ============================
// EVENTOS
// ============================

// Troca de índice (tabs)
document.querySelectorAll('input[name="indice"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        carregarTodosOsDados(e.target.value);
    });
});

// Paginação
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        aplicarFiltroEPaginacao();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        aplicarFiltroEPaginacao();
    }
});

// Filtros em tempo real
document.getElementById('search-mes')?.addEventListener('input', () => {
    currentPage = 1;
    aplicarFiltroEPaginacao();
});

document.getElementById('search-ano')?.addEventListener('input', () => {
    currentPage = 1;
    aplicarFiltroEPaginacao();
});

// Limpar filtros
document.getElementById('clear-search')?.addEventListener('click', () => {
    document.getElementById('search-mes').value = '';
    document.getElementById('search-ano').value = '';
    currentPage = 1;
    aplicarFiltroEPaginacao();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Começa com IGP-M selecionado (checked no HTML)
    carregarTodosOsDados('igpm');
});