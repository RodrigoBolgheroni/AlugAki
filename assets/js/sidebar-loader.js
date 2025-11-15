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
                
                // Inicializar eventos
                initSidebarEvents();
                initUserDropdown();
            })
            .catch(error => {
                console.error('Erro ao carregar sidebar:', error);
            });
    }

    // Configurar eventos do sidebar
    function initSidebarEvents() {
        const navLinks = document.querySelectorAll('.nav-item');
        const keyboardShortcut = document.querySelector('.keyboard-shortcut');
        const sidebar = document.querySelector('.sidebar');
        const sidebarContainer = document.getElementById('sidebar-container');
        
        // Evento de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active de todos
                navLinks.forEach(item => item.classList.remove('active'));
                
                // Adiciona active no clicado
                this.classList.add('active');
            });
        });
        
        // Evento de toggle do menu (RECOLHER/EXPANDIR)
        if (keyboardShortcut && sidebar && sidebarContainer) {
            keyboardShortcut.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                sidebarContainer.classList.toggle('collapsed');
            });
        }
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
                const text = this.querySelector('span').textContent;
                
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
