// Efecto parallax y animaciones en scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Efecto parallax en el fondo
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${rate}px)`;
    }
    
    // Fade del hero content basado en scroll
    const heroContent = document.querySelector('.hero-content');
    const heroSection = document.querySelector('.hero-section');
    const heroHeight = heroSection.offsetHeight;
    
    if (scrolled < heroHeight) {
        const opacity = 1 - (scrolled / heroHeight) * 1.5;
        const transform = scrolled * 0.5;
        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = `translateY(${transform}px)`;
    }
});

// Configuración mejorada del observador con animaciones dinámicas
const observerOptions = {
    threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
    rootMargin: '0px 0px -100px 0px'
};

// Función para reiniciar animaciones
function resetAnimation(element) {
    element.classList.remove('slide-in-right', 'visible', 'fade-in-animation');
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    if (element.classList.contains('content-card')) {
        element.style.transform = 'translateX(100px)';
    }
}

// Función para aplicar animación
function applyAnimation(element, delay = 0) {
    setTimeout(() => {
        if (element.classList.contains('content-card')) {
            element.classList.add('slide-in-right');
        } else {
            element.classList.add('visible', 'fade-in-animation');
        }
    }, delay);
}

// Observer mejorado para animaciones dinámicas
const dynamicObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const element = entry.target;
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            // Elemento visible - aplicar animación
            const row = element.getAttribute('data-row');
            
            if (row) {
                // Animación para cards principales
                const baseDelay = row === '1' ? 0 : 200;
                const cardIndex = Array.from(element.parentElement.children).indexOf(element);
                const cardDelay = cardIndex * 150;
                
                applyAnimation(element, baseDelay + cardDelay);
            } else {
                // Animación para otros elementos
                const index = Array.from(document.querySelectorAll('.fade-in-up')).indexOf(element);
                applyAnimation(element, index * 100);
            }
        } else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
            // Elemento no visible - resetear animación
            resetAnimation(element);
        }
    });
}, observerOptions);

// Observador adicional para elementos que necesitan animación continua
const continuousObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const element = entry.target;
        
        if (entry.isIntersecting) {
            // Aplicar animación de entrada
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
            
            // Agregar clase de animación activa
            element.classList.add('animate-active');
            
            // Efecto de pulsación para cards
            if (element.classList.contains('benefit-card') || element.classList.contains('feature-item')) {
                element.style.animation = 'cardPulse 2s ease-in-out infinite';
            }
        } else {
            // Resetear cuando sale de vista
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px) scale(0.9)';
            element.classList.remove('animate-active');
            element.style.animation = 'none';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '-50px 0px -50px 0px'
});

// Función para crear efectos de hover dinámicos
function addDynamicHoverEffects() {
    const cards = document.querySelectorAll('.content-card, .benefit-card, .feature-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Efecto de brillo
            this.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            this.style.background = this.dataset.originalBg || 'white';
        });
    });
}

// Función para animaciones de texto con efecto typewriter
function addTypewriterEffect() {
    const titles = document.querySelectorAll('.section-title');
    
    const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target;
                const text = title.textContent;
                let index = 0;
                
                title.textContent = '';
                title.style.borderRight = '2px solid #4ecdc4';
                
                const typeInterval = setInterval(() => {
                    title.textContent += text[index];
                    index++;
                    
                    if (index >= text.length) {
                        clearInterval(typeInterval);
                        setTimeout(() => {
                            title.style.borderRight = 'none';
                        }, 1000);
                    }
                }, 100);
                
                typewriterObserver.unobserve(title);
            }
        });
    }, { threshold: 0.5 });
    
    titles.forEach(title => {
        typewriterObserver.observe(title);
    });
}

// Función para efectos de partículas flotantes
function createFloatingParticles() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createParticles(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(section);
    });
}

function createParticles(container) {
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #4ecdc4;
            border-radius: 50%;
            opacity: 0.6;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${3 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        container.style.position = 'relative';
        container.appendChild(particle);
        
        // Remover después de un tiempo
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 8000);
    }
}

// Función de inicialización
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.content-card');
    const fadeElements = document.querySelectorAll('.fade-in-up');
    const benefitCards = document.querySelectorAll('.benefit-card');
    const featureItems = document.querySelectorAll('.feature-item');
    
    // Observar elementos principales
    [...cards, ...fadeElements].forEach((element, index) => {
        if (element.classList.contains('fade-in-up')) {
            element.style.transitionDelay = `${index * 0.1}s`;
        }
        dynamicObserver.observe(element);
    });
    
    // Observar elementos para animación continua
    [...benefitCards, ...featureItems].forEach(element => {
        continuousObserver.observe(element);
    });
    
    // Inicializar efectos adicionales
    setTimeout(() => {
        addDynamicHoverEffects();
        addTypewriterEffect();
        createFloatingParticles();
    }, 1000);
});

// Smooth scroll mejorado
document.documentElement.style.scrollBehavior = 'smooth';

// Efecto de entrada inicial mejorado
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateY(0)';
    
    // Agregar efecto de respiración al hero
    setInterval(() => {
        heroContent.style.transform = 'translateY(0) scale(1.02)';
        setTimeout(() => {
            heroContent.style.transform = 'translateY(0) scale(1)';
        }, 1000);
    }, 4000);
});

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);