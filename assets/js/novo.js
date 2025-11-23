document.addEventListener("DOMContentLoaded", () => {

    let currentTab = 0;

    function showTab(index) {
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');

        currentTab = index;

        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        tabs[index].classList.add('active');
        contents[index].classList.add('active');

        updateButtons();
    }

    function updateButtons() {
        const btnBack = document.querySelector('.btn-back');
        const btnNext = document.querySelector('.btn-next');

        if (!btnBack || !btnNext) return;

        const isPJ = document.querySelector('input[value="pj"]')?.checked;
        const totalTabs = isPJ ? 4 : 3;

        btnBack.disabled = currentTab === 0;
        btnBack.style.opacity = currentTab === 0 ? "0.4" : "1";
        btnBack.style.cursor = currentTab === 0 ? "not-allowed" : "pointer";

        btnNext.innerHTML = 
            currentTab === totalTabs - 1
            ? '<i class="fa-solid fa-check"></i> Concluir'
            : '<i class="fa-solid fa-chevron-right"></i> Próximo';
    }

    // Clique nas abas
    document.querySelectorAll('.tab').forEach((tab, index) => {
        tab.addEventListener('click', () => showTab(index));
    });

    // Botão próximo
    document.querySelector('.btn-next').addEventListener('click', () => {
        const isPJ = document.querySelector('input[value="pj"]')?.checked;
        const totalTabs = isPJ ? 4 : 3;

        if (currentTab < totalTabs - 1) {
            showTab(currentTab + 1);
        } else {
            alert("Cadastro concluído!");
        }
    });

    // Botão voltar
    document.querySelector('.btn-back').addEventListener('click', () => {
        if (currentTab > 0) showTab(currentTab - 1);
    });

    // ---------- LÓGICA DO CONDOMÍNIO ----------
    const tipoImovel = document.getElementById("tipoImovel");
    const campoCondominio = document.getElementById("campoCondominio");

    if (tipoImovel && campoCondominio) {
        tipoImovel.addEventListener("change", () => {
            const valor = tipoImovel.value.toLowerCase();

            if (valor === "apartamento" || valor === "condominio") {
                campoCondominio.style.display = "";
            } else {
                campoCondominio.style.display = "none";
            }
        });
    }

    // ---------- LÓGICA IPTU ----------
    const campoIPTU = document.getElementById("campoIPTU");
    const iptuSim = document.getElementById("iptuSim");
    const iptuNao = document.getElementById("iptuNao");

    if (iptuSim && iptuNao && campoIPTU) {

        function marcarBotao(ativo, inativo) {
            ativo.classList.add("active-iptu");
            inativo.classList.remove("active-iptu");
        }

        iptuSim.addEventListener("click", () => {
            campoIPTU.style.display = "block";
            marcarBotao(iptuSim, iptuNao);
        });

        iptuNao.addEventListener("click", () => {
            campoIPTU.style.display = "none";
            marcarBotao(iptuNao, iptuSim);
        });
    }

    updateButtons();
});
