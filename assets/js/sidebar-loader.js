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
        
        // Evento de toggle do menu
        if (keyboardShortcut && sidebar && sidebarContainer) {
            keyboardShortcut.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                sidebarContainer.classList.toggle('collapsed');
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