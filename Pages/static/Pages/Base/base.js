document.addEventListener('DOMContentLoaded', function () {
    const navbarToggle = document.getElementById('navbarToggle');
    const bottomNavbar = document.getElementById('bottomNavbar');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle navbar visibility
    navbarToggle.addEventListener('click', function () {
        bottomNavbar.classList.toggle('hidden');
        navbarToggle.classList.toggle('rotated');
        
        // Cambiar el icono del toggle
        const toggleIcon = navbarToggle.querySelector('.toggle-icon');
        if (bottomNavbar.classList.contains('hidden')) {
            toggleIcon.innerHTML = '↑'; // Flecha hacia arriba cuando está oculto
        } else {
            toggleIcon.innerHTML = '↓'; // Flecha hacia abajo cuando está visible
        }
    });

    // Inicializar el icono del toggle
    const toggleIcon = navbarToggle.querySelector('.toggle-icon');
    toggleIcon.innerHTML = '↓';

    // Solo efectos visuales para los nav items
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            // NO preventDefault() - permite que los enlaces funcionen normalmente
            
            // Remover clase active de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
        });

        // Agregar efecto hover mejorado
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-8px) scale(1.05)';
            }
        });

        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });

    // Auto-hide navbar después de un tiempo sin interacción (opcional)
    let hideTimeout;
    
    bottomNavbar.addEventListener('mouseenter', function() {
        clearTimeout(hideTimeout);
    });

    bottomNavbar.addEventListener('mouseleave', function() {
        // Opcional: ocultar automáticamente después de 3 segundos
        hideTimeout = setTimeout(() => {
            if (!bottomNavbar.classList.contains('hidden')) {
                bottomNavbar.classList.add('hidden');
                navbarToggle.classList.add('rotated');
                toggleIcon.innerHTML = '↑';
            }
        }, 3000);
    });

    // Mejorar la experiencia táctil en dispositivos móviles
    if ('ontouchstart' in window) {
        navItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });

            item.addEventListener('touchend', function() {
                setTimeout(() => {
                    if (!this.classList.contains('active')) {
                        this.style.transform = '';
                    }
                }, 150);
            });
        });
    }
});