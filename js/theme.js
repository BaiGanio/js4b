(function() {
    updateIcon();

    function updateIcon() {
        var icon = document.querySelector('.theme-toggle i');
        if (!icon) return;
        if (document.documentElement.classList.contains('light-mode')) {
            icon.className = 'bi bi-sun-fill';
        } else {
            icon.className = 'bi bi-moon-fill';
        }
    }

    function applyTheme() {
        var isLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('js4b-theme', isLight ? 'light' : 'dark');
        updateIcon();
    }

    window.toggleTheme = function() {
        if (document.startViewTransition) {
            document.startViewTransition(function() {
                applyTheme();
            });
            return;
        }

        document.documentElement.classList.add('theme-switching');
        applyTheme();
        requestAnimationFrame(function() {
            document.documentElement.classList.remove('theme-switching');
        });
    };
})();
