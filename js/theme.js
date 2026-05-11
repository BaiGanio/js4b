(function() {
    var saved = localStorage.getItem('js4b-theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
    }
    updateIcon();

    function updateIcon() {
        var icon = document.querySelector('.theme-toggle i');
        if (!icon) return;
        if (document.body.classList.contains('light-mode')) {
            icon.className = 'bi bi-sun-fill';
        } else {
            icon.className = 'bi bi-moon-fill';
        }
    }

    function applyTheme() {
        var isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('js4b-theme', isLight ? 'light' : 'dark');
        updateIcon();
    }

    window.toggleTheme = function() {
        // Use the modern View Transition API when available — it's GPU-accelerated
        // and avoids expensive CSS wildcard style recalculations entirely.
        if (document.startViewTransition) {
            document.startViewTransition(function() {
                applyTheme();
            });
            return;
        }

        // Fallback: kill transitions during the switch to prevent morphing.
        // We apply 'theme-switching' to <html> so the CSS rule targets
        // all descendants and kills their transitions for one frame.
        document.documentElement.classList.add('theme-switching');
        applyTheme();
        // Re-enable transitions on the next animation frame
        requestAnimationFrame(function() {
            document.documentElement.classList.remove('theme-switching');
        });
    };
})();
