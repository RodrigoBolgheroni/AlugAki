
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
