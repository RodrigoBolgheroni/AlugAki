// sidebar-loader.js - Script para carregar o menu lateral
(function() {
    'use strict';

    // Carregar o header
    function loadSidebar() {
        fetch('/modals/header.html')
            .then(response => response.text())
            .then(html => {
                const container = document.getElementById('sidebar-container');
                const template = document.createElement('template');
                template.innerHTML = html.trim();

                container.innerHTML = '';
                container.appendChild(template.content.cloneNode(true));

                // Restaurar estado ANTES de inicializar eventos
                restoreInitialState();

                // Inicializar eventos
                initSidebarEvents();
                initUserDropdown();
            })
            .catch(error => {
                console.error('Erro ao carregar sidebar:', error);
            });
    }

    // Restaurar estado inicial do sidebar
    function restoreInitialState() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarContainer = document.getElementById('sidebar-container');

        // Verificar estado salvo no localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        const isCollapsed = savedState === 'true';

        if (isCollapsed) {
            // Aplicar estado colapsado
            sidebar?.classList.add('collapsed');
            sidebarContainer?.classList.add('collapsed');
        } else {
            // Garantir que está expandido (remover collapsed se existir)
            sidebar?.classList.remove('collapsed');
            sidebarContainer?.classList.remove('collapsed');
        }

        console.log('Estado inicial:', isCollapsed ? 'colapsado' : 'expandido');
    }

    // Normaliza paths (remove trailing slash)
    function normalizePath(p) {
        if (!p) return '';
        try {
            // remove query + hash
            p = p.split('?')[0].split('#')[0];
        } catch (e) {}
        return p.replace(/\/+$/, '') || '/';
    }

    // Configurar eventos do sidebar
    function initSidebarEvents() {
        const navLinks = Array.from(document.querySelectorAll('.nav-item'));
        const keyboardShortcut = document.querySelector('.keyboard-shortcut');
        const sidebar = document.querySelector('.sidebar');
        const sidebarContainer = document.getElementById('sidebar-container');

        if (!navLinks.length) {
            console.warn('initSidebarEvents: nenhum .nav-item encontrado');
        }

        // Define qual nav-item deve iniciar ativo baseado na URL atual
        function setActiveNavItem() {
            const currentPath = normalizePath(window.location.pathname);
            console.log('setActiveNavItem -> currentPath =', currentPath);

            navLinks.forEach(link => {
                // limpar todos
                link.classList.remove('active');

                const href = link.getAttribute('href');
                if (!href || href === '#' || href.trim() === '') {
                    // ignore anchors or empty
                    return;
                }

                // Resolve caminho do href mesmo se for relativo
                let linkPath;
                try {
                    // new URL resolver: se href for relativo, a base é window.location.origin + window.location.pathname
                    // usamos URL com base location to resolve correctly.
                    const resolved = new URL(href, window.location.origin + window.location.pathname);
                    linkPath = normalizePath(resolved.pathname);
                } catch (e) {
                    // fallback simples
                    linkPath = normalizePath(href);
                }

                // Comparação: ex: /pages/inquilinos.html vs /pages/inquilinos.html
                if (linkPath === currentPath) {
                    link.classList.add('active');
                    console.log('Ativando por match exato:', href, '->', linkPath);
                    return;
                }

                // Casos especiais: index.html ou root -> home
                // Se a página atual é '/' ou '/index.html' e o link aponta para '/pages/home.html', ativa-o
                const homePaths = ['/', '/index.html', '/index.htm'];
                const linkIsHome = linkPath === normalizePath('/pages/home.html') || linkPath === normalizePath('/home.html');
                if (homePaths.includes(currentPath) && linkIsHome) {
                    link.classList.add('active');
                    console.log('Ativando home por root/index:', href);
                    return;
                }

                // Também tenta comparar apenas o filename (caso a estrutura tenha diferença)
                const currentFilename = currentPath.split('/').pop();
                const linkFilename = linkPath.split('/').pop();
                if (currentFilename && linkFilename && currentFilename === linkFilename) {
                    link.classList.add('active');
                    console.log('Ativando por filename match:', href);
                    return;
                }
if (!document.querySelector('.nav-item.active')) {
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        if (/inquilino/i.test(window.location.pathname)) {
            if (href.includes('inquilinos.html')) {
                link.classList.add('active');
            }
        }
        if (/imovel/i.test(window.location.pathname)) {
            if (href.includes('imoveis.html')) {
                link.classList.add('active');
            }
        }
        if (/proprietario/i.test(window.location.pathname)) {
            if (href.includes('proprietarios.html')) {
                link.classList.add('active');
            }
        }
        if(/inventario/i.test(window.location.pathname)) {
            if (href.includes('inventario.html')) {
                link.classList.add('active');
            }
        }
    });
}

            });
        }

        // Executa ao inicializar (após fetch do header)
        setActiveNavItem();

        // Evento de navegação (quando usuário clica)
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href === "#" || href === "" || href === null) {
                    e.preventDefault();
                }

                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');

                // Se o link for de navegação full page, permitir que o navegador carregue a nova página.
                // Se for apenas âncora (#), prevenimos o default (já feito acima).
            });
        });

        // Evento de toggle do menu (RECOLHER/EXPANDIR)
        if (keyboardShortcut && sidebar && sidebarContainer) {
            keyboardShortcut.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Toggle das classes
                sidebar.classList.toggle('collapsed');
                sidebarContainer.classList.toggle('collapsed');

                // Salvar estado no localStorage
                const isCollapsed = sidebar.classList.contains('collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);

                console.log('Sidebar', isCollapsed ? 'colapsada' : 'expandida');
            });
        }

        // Se a aplicação muda a rota via History API sem recarregar (SPA), você precisa chamar setActiveNavItem() novamente.
        // Exemplo: window.addEventListener('popstate', setActiveNavItem);
        window.addEventListener('popstate', setActiveNavItem);
    }

    // Configurar dropdown do usuário
    function initUserDropdown() {
        const userMenuTrigger = document.getElementById('user-menu-trigger');
        const userDropdown = document.getElementById('user-dropdown');

        if (!userMenuTrigger || !userDropdown) return;

        // Toggle dropdown ao clicar no perfil
        userMenuTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target) && !userMenuTrigger.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });

        // Prevenir fechamento ao clicar dentro do dropdown
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Eventos dos itens do menu
        const dropdownItems = userDropdown.querySelectorAll('.dropdown-item');

        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const span = this.querySelector('span');
                const text = span ? span.textContent.trim() : '';

                switch(text) {
                    case 'Minha conta':
                        console.log('Navegar para Minha Conta');
                        // window.location.href = '/pages/minha-conta.html';
                        break;

                    case 'Ajuda':
                        console.log('Abrir Ajuda');
                        // window.open('/pages/ajuda.html', '_blank');
                        break;

                    case 'Suporte':
                        console.log('Abrir Suporte');
                        // window.open('/pages/suporte.html', '_blank');
                        break;

                    case 'Sair':
                        if (confirm('Deseja realmente sair?')) {
                            console.log('Logout');
                            window.location.href = '/index.html';
                        }
                        break;
                }

                // Fechar dropdown após clicar (exceto no toggle)
                if (!this.querySelector('.toggle-switch')) {
                    userDropdown.classList.remove('active');
                }
            });
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', function() {
                if (this.checked) {
                    console.log('Dark mode ativado');
                    document.body.classList.add('dark-mode');
                } else {
                    console.log('Dark mode desativado');
                    document.body.classList.remove('dark-mode');
                }
            });
        }
    }

    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSidebar);
    } else {
        loadSidebar();
    }

})();

