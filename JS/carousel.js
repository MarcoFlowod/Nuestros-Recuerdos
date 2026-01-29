// ========== CARRUSEL 3D INTERACTIVO ==========
// Carrusel tipo Netflix/Apple TV para dispositivos móviles (max-width: 480px)

class Carousel3D {
    constructor() {
        this.galleryGrid = document.getElementById('gallery-container');
        this.galleryImages = [];
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.dragStart = 0;
        this.dragOffset = 0;
        this.touchStartTime = 0;
        this.touchEndTime = 0;
        this.rafId = null;
        
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCarousel());
        } else {
            this.setupCarousel();
        }
    }

    setupCarousel() {
        // Verificar si estamos en pantalla móvil (max-width: 480px)
        const isMobile = window.matchMedia('(max-width: 480px)').matches;
        
        if (!isMobile || !this.galleryGrid) return;

        // Recopilar imágenes
        this.galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
        
        if (this.galleryImages.length === 0) return;

        console.log('[Carousel3D] Inicializando carrusel 3D con', this.galleryImages.length, 'imágenes');

        // Activar modo carrusel
        this.galleryGrid.classList.add('carousel-mode');
        this.galleryGrid.style.display = 'flex';

        // Establecer posiciones iniciales
        this.updateCarouselPositions();

        // Configurar event listeners
        this.setupTouchListeners();
        this.setupKeyboardListeners();
        this.setupMouseListeners();

        // Ajustar al redimensionar
        window.addEventListener('resize', () => {
            if (window.matchMedia('(max-width: 480px)').matches) {
                this.updateCarouselPositions();
            }
        });
    }

    setupTouchListeners() {
        this.galleryGrid.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
        this.galleryGrid.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
        this.galleryGrid.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);
    }

    setupMouseListeners() {
        this.galleryGrid.addEventListener('mousedown', (e) => this.handleMouseDown(e), false);
        this.galleryGrid.addEventListener('mouseup', (e) => this.handleMouseUp(e), false);
        this.galleryGrid.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);
        this.galleryGrid.addEventListener('mouseleave', (e) => this.handleMouseLeave(e), false);
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    handleTouchStart(e) {
        this.isDragging = true;
        this.touchStartX = e.touches[0].clientX;
        this.touchEndX = this.touchStartX;
        this.dragStart = e.touches[0].clientX;
        this.dragOffset = 0;
        this.touchStartTime = Date.now();
        this.disableTransition();
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        this.touchEndX = e.touches[0].clientX;
        this.dragOffset = this.touchEndX - this.dragStart;

        // Aplicar transformación en tiempo real durante el arrastre
        this.applyDragTransform(this.dragOffset);
    }

    handleTouchEnd(e) {
        this.isDragging = false;
        this.touchEndTime = Date.now();

        const swipeThreshold = 50; // px mínimo
        const diff = this.touchStartX - this.touchEndX;
        const dt = Math.max(1, this.touchEndTime - this.touchStartTime); // ms
        const velocity = Math.abs(diff) / dt; // px per ms

        // Si la velocidad es alta, considerar como flick y centrar inmediatamente
        const flickVelocityThreshold = 0.7;

        if (Math.abs(diff) > swipeThreshold || velocity > flickVelocityThreshold) {
            this.enableTransition(120);
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        } else {
            // Snap rápido de regreso
            this.enableTransition(120);
            this.updateCarouselPositions();
        }
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStart = e.clientX;
        this.dragOffset = 0;
        this.dragStartTime = Date.now();
        this.disableTransition();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.dragOffset = e.clientX - this.dragStart;
        this.applyDragTransform(this.dragOffset);
    }

    handleMouseUp(e) {
        this.isDragging = false;
        
        const swipeThreshold = 50;
        const dragEndTime = Date.now();
        const dt = Math.max(1, dragEndTime - (this.dragStartTime || dragEndTime));
        const velocity = Math.abs(this.dragOffset) / dt;
        const flickVelocityThreshold = 0.7;

        if (Math.abs(this.dragOffset) > swipeThreshold || velocity > flickVelocityThreshold) {
            this.enableTransition(120);
            if (this.dragOffset < 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        } else {
            this.enableTransition(120);
            this.updateCarouselPositions();
        }
    }

    handleMouseLeave(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.updateCarouselPositions();
        }
    }

    applyDragTransform(offset) {
        const sensitivity = 0.6;

        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
            this.galleryImages.forEach((img, index) => {
                const position = this.getPositionClass(index);
                let baseTransform = this.getBaseTransform(position);

                const transform = baseTransform.replace(/translateX\(([^)]+)\)/, (match, p1) => {
                    const baseValue = parseFloat(p1);
                    const newValue = baseValue + offset * sensitivity;
                    return `translateX(${newValue}px)`;
                });

                img.style.transform = transform;
            });
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;
        this.enableTransition(140);
        this.updateCarouselPositions();
        this.logCurrentSlide();
    }

    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        this.enableTransition(140);
        this.updateCarouselPositions();
        this.logCurrentSlide();
    }

    enableTransition(duration = 180) {
        const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
        const t = `${duration}ms ${easing}`;
        this.galleryImages.forEach(img => {
            img.style.transition = `transform ${t}`;
        });
    }

    disableTransition() {
        this.galleryImages.forEach(img => {
            img.style.transition = 'none';
        });
    }

    updateCarouselPositions() {
        this.galleryImages.forEach((img, index) => {
            // Remover todas las clases de posición
            img.classList.remove(
                'carousel-active',
                'carousel-left-1', 'carousel-left-2', 'carousel-left-3',
                'carousel-right-1', 'carousel-right-2', 'carousel-right-3',
                'carousel-hidden'
            );

            // Calcular posición relativa
            let position = (index - this.currentIndex + this.galleryImages.length) % this.galleryImages.length;

            // Ajustar para mostrar desde -3 a +3 (total 7 items)
            if (position > this.galleryImages.length / 2) {
                position = position - this.galleryImages.length;
            }

            // Aplicar clase según posición
            switch (position) {
                case 0:
                    img.classList.add('carousel-active');
                    break;
                case -1:
                    img.classList.add('carousel-left-1');
                    break;
                case -2:
                    img.classList.add('carousel-left-2');
                    break;
                case -3:
                    img.classList.add('carousel-left-3');
                    break;
                case 1:
                    img.classList.add('carousel-right-1');
                    break;
                case 2:
                    img.classList.add('carousel-right-2');
                    break;
                case 3:
                    img.classList.add('carousel-right-3');
                    break;
                default:
                    img.classList.add('carousel-hidden');
            }
        });
    }

    getPositionClass(index) {
        const img = this.galleryImages[index];
        if (img.classList.contains('carousel-active')) return 'active';
        if (img.classList.contains('carousel-left-1')) return 'left-1';
        if (img.classList.contains('carousel-left-2')) return 'left-2';
        if (img.classList.contains('carousel-left-3')) return 'left-3';
        if (img.classList.contains('carousel-right-1')) return 'right-1';
        if (img.classList.contains('carousel-right-2')) return 'right-2';
        if (img.classList.contains('carousel-right-3')) return 'right-3';
        return 'hidden';
    }

    getBaseTransform(position) {
        const transforms = {
            'active': 'translateX(0) rotateY(0deg) scale(1)',
            'left-1': 'translateX(-280px) rotateY(25deg) translateZ(-100px) scale(0.85)',
            'left-2': 'translateX(-520px) rotateY(35deg) translateZ(-200px) scale(0.7)',
            'left-3': 'translateX(-760px) rotateY(45deg) translateZ(-300px) scale(0.6)',
            'right-1': 'translateX(280px) rotateY(-25deg) translateZ(-100px) scale(0.85)',
            'right-2': 'translateX(520px) rotateY(-35deg) translateZ(-200px) scale(0.7)',
            'right-3': 'translateX(760px) rotateY(-45deg) translateZ(-300px) scale(0.6)',
            'hidden': 'translateX(0) scale(0)',
        };
        return transforms[position] || transforms['hidden'];
    }

    logCurrentSlide() {
        const currentImg = this.galleryImages[this.currentIndex];
        const titulo = currentImg.querySelector('h3')?.textContent || 'Sin título';
        console.log(`[Carousel3D] Slide actual: ${this.currentIndex + 1}/${this.galleryImages.length} - ${titulo}`);
    }
}

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.carousel3D = new Carousel3D();
    console.log('[Carousel3D] Inicializado');
});
