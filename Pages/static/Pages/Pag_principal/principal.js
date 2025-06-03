document.addEventListener('DOMContentLoaded', function() {
    const cardsContainer = document.getElementById('cardsContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.card');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    const radius = 400; // Radio aumentado para mayor separación
    
    // Calcular el ángulo entre cada carta
    const angleStep = 360 / totalCards;
    
    function updateCarousel() {
        // Rotar el contenedor principal - rotación negativa para dirección correcta
        const rotation = -currentIndex * angleStep;
        console.log('updateCarousel - rotation:', rotation, 'degrees');
        cardsContainer.style.transform = `rotateY(${rotation}deg)`;
        console.log('Applied transform:', cardsContainer.style.transform);
        
        // Actualizar clases de las cartas para efectos visuales
        cards.forEach((card, index) => {
            card.classList.remove('active', 'side', 'back');
            
            // Calcular la posición relativa de cada carta
            let relativeIndex = (index - currentIndex + totalCards) % totalCards;
            
            if (relativeIndex === 0) {
                card.classList.add('active');
            } else if (relativeIndex === 1 || relativeIndex === totalCards - 1) {
                card.classList.add('side');
            } else {
                card.classList.add('back');
            }
        });
        
        // Controlar botones de navegación
        updateNavigationButtons();
    }
    
    function updateNavigationButtons() {
        // Los botones siempre están habilitados en un carrusel circular
        prevBtn.classList.remove('disabled');
        nextBtn.classList.remove('disabled');
    }
    
    function nextCard() {
        console.log('nextCard called - currentIndex before:', currentIndex);
        // Avanzar al siguiente índice (flecha derecha)
        currentIndex = (currentIndex + 1) % totalCards;
        console.log('nextCard called - currentIndex after:', currentIndex);
        updateCarousel();
    }
    
    function prevCard() {
        console.log('prevCard called - currentIndex before:', currentIndex);
        // Retroceder al índice anterior (flecha izquierda)
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        console.log('prevCard called - currentIndex after:', currentIndex);
        updateCarousel();
    }
    
    // Posicionar las cartas en círculo con mayor radio
    function positionCards() {
        cards.forEach((card, index) => {
            const angle = index * angleStep;
            
            // Posicionar cada carta en el círculo
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
    }
    
    // Función para animar el hover de los iconos
    function animateIconHover(icon, scale = 1.1) {
        icon.style.transform = `scale(${scale})`;
    }
    
    // Función para la animación flotante
    function startFloatingAnimation(element) {
        element.style.animation = 'float 3s ease-in-out infinite';
    }
    
    function stopFloatingAnimation(element) {
        element.style.animation = 'none';
    }
    
    // Event listeners para navegación
    nextBtn.addEventListener('click', function() {
        console.log('Right button clicked!');
        nextCard();
        updateActiveCardAnimation();
    });
    
    prevBtn.addEventListener('click', function() {
        console.log('Left button clicked!');
        prevCard();
        updateActiveCardAnimation();
    });
    
    // Click en las cartas para navegar
    cards.forEach((card, index) => {
        card.addEventListener('click', function() {
            if (index !== currentIndex) {
                currentIndex = index;
                updateCarousel();
            }
        });
        
        // Animaciones de hover para cada carta
        card.addEventListener('mouseenter', function() {
            const icon = card.querySelector('.icon');
            if (card.classList.contains('active')) {
                animateIconHover(icon, 1.2);
                startFloatingAnimation(icon);
            } else {
                animateIconHover(icon, 1.05);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = card.querySelector('.icon');
            animateIconHover(icon, 1);
            if (!card.classList.contains('active')) {
                stopFloatingAnimation(icon);
            }
        });
    });
    
    // Animación especial para la carta activa
    function updateActiveCardAnimation() {
        cards.forEach(card => {
            const icon = card.querySelector('.icon');
            if (card.classList.contains('active')) {
                startFloatingAnimation(icon);
            } else {
                stopFloatingAnimation(icon);
            }
        });
    }
    
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevCard();
        } else if (e.key === 'ArrowRight') {
            nextCard();
        }
    });
    
    // Función para actualizar el carrusel con animaciones
    function updateCarouselWithAnimations() {
        updateCarousel();
        // Pequeño delay para que las clases CSS se apliquen primero
        setTimeout(updateActiveCardAnimation, 100);
    }
    
    // Auto-play opcional (descomenta si quieres que rote automáticamente)
    /*
    setInterval(function() {
        nextCard();
        updateActiveCardAnimation();
    }, 4000); // Cambiar cada 4 segundos
    */
    
    // Inicializar el carrusel
    positionCards();
    updateCarousel();
    updateActiveCardAnimation();
    
    // Soporte para touch/swipe en dispositivos móviles
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let isSwipping = false;
    
    cardsContainer.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isSwipping = true;
    });
    
    cardsContainer.addEventListener('touchmove', function(e) {
        if (isSwipping) {
            e.preventDefault(); // Prevenir scroll
        }
    });
    
    cardsContainer.addEventListener('touchend', function(e) {
        if (!isSwipping) return;
        
        const touch = e.changedTouches[0];
        distX = touch.clientX - startX;
        distY = touch.clientY - startY;
        
        // Solo si el swipe es más horizontal que vertical
        if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
            if (distX > 0) {
                prevCard(); // Swipe derecha = anterior
            } else {
                nextCard(); // Swipe izquierda = siguiente
            }
        }
        
        isSwipping = false;
    });
    
    // Animaciones para los botones de navegación
    function animateButton(button, scale = 1.15) {
        button.style.transform = `scale(${scale}) translateY(-50%)`;
    }
    
    // Event listeners para animaciones de botones
    [prevBtn, nextBtn].forEach(button => {
        button.addEventListener('mouseenter', function() {
            animateButton(this, 1.15);
        });
        
        button.addEventListener('mouseleave', function() {
            animateButton(this, 1);
        });
        
        button.addEventListener('mousedown', function() {
            animateButton(this, 1.05);
        });
        
        button.addEventListener('mouseup', function() {
            animateButton(this, 1.15);
        });
    });
});