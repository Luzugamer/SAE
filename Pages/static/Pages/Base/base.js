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

    // Funcionalidad de navegación mejorada
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Remover clase active de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Obtener la página del atributo data-page
            const page = this.getAttribute('data-page');
            console.log('Navegando a:', page);

            // Agregar un pequeño delay para que se vea la animación
            setTimeout(() => {
                // Redirigir según la página y el rol
                if (window.userIsAuthenticated) {
                    const userRole = window.userRole;

                    switch (page) {
                        case 'repositorio':
                            window.location.href = '/repositorio/';
                            break;
                        case 'cursos':
                            if (userRole === 'profesor') {
                                window.location.href = '/cursos/';
                            }
                            break;
                        case 'eventos':
                            window.location.href = '/eventos/';
                            break;
                        case 'perfil':
                            if (userRole === 'profesor') {
                                window.location.href = '/profesor/perfil/';
                            } else if (userRole === 'estudiante') {
                                window.location.href = '/estudiante/perfil/';
                            }
                            break;
                        case 'evaluaciones':
                            if (userRole === 'profesor') {
                                window.location.href = '/evaluaciones/';
                            }
                            break;
                        case 'comunidad':
                            if (userRole === 'estudiante') {
                                window.location.href = '/comunidad/';
                            }
                            break;
                        case 'progreso':
                            if (userRole === 'estudiante') {
                                window.location.href = '/progreso/';
                            }
                            break;
                        case 'ayuda':
                            window.location.href = '/ayuda/';
                            break;
                        case 'logout':
                            window.location.href = logoutUrl;
                            break;
                        default:
                            console.log('Página no encontrada');
                    }
                }
            }, 200); // Delay de 200ms para ver la animación
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