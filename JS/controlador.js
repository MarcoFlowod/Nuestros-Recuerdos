// ========== GESTOR DE PANTALLAS ==========
// Gestiona las transiciones entre pantallas

class ScreenManager {
    constructor() {
        this.startScreen = document.getElementById('startScreen');
        this.memoriesScreen = document.getElementById('memoriesScreen');
        this.teQuieroLink = document.getElementById('teQuieroLink');
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.rainContainer = document.getElementById('rain');
        this.currentScreen = 'start';
        
        this.init();
    }

    init() {
        this.initializeScreens();
        this.setupNavigationListener();
    }

    initializeScreens() {
        if (this.startScreen) {
            this.startScreen.classList.add('active-screen');
            this.currentScreen = 'start';
        }
    }

    setupNavigationListener() {
        if (this.teQuieroLink) {
            this.teQuieroLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToMemoriesScreen();
            });
        }
    }

    switchToMemoriesScreen() {
        console.log('[ScreenManager] Cambiando a pantalla de recuerdos');
        
        // Efecto de transición
        if (this.startScreen) {
            this.startScreen.style.opacity = '0';
            this.startScreen.style.visibility = 'hidden';
        }
        
        setTimeout(() => {
            // Actualizar clases
            if (this.startScreen) {
                this.startScreen.classList.remove('active-screen');
            }
            if (this.memoriesScreen) {
                this.memoriesScreen.classList.add('active-screen');
                this.memoriesScreen.style.opacity = '1';
                this.memoriesScreen.style.visibility = 'visible';
            }
            
            this.currentScreen = 'memories';
            
            // Inicializar efectos en segunda pantalla
            if (this.rainContainer && typeof startHeartRain === 'function') {
                startHeartRain(this.rainContainer);
            }
            
            // Reproducir música con interacción del usuario
            this.setupMusicPlayback();
            
            // Iniciar animación de entrada para imágenes
            setTimeout(() => {
                document.querySelectorAll('.gallery-image').forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.add('animate-in');
                });
            }, 500);
            
            // Configurar el scroll de filters-container
            this.setupFiltersScroll();
        }, 300);
    }

    switchToStartScreen() {
        console.log('[ScreenManager] Volviendo a pantalla de inicio');
        
        if (this.memoriesScreen) {
            this.memoriesScreen.style.opacity = '0';
            
            setTimeout(() => {
                this.memoriesScreen.classList.remove('active-screen');
                this.memoriesScreen.style.visibility = 'hidden';
                
                if (this.startScreen) {
                    this.startScreen.classList.add('active-screen');
                    this.startScreen.style.opacity = '1';
                    this.startScreen.style.visibility = 'visible';
                }
                
                // Pausar música
                if (this.backgroundMusic) {
                    this.backgroundMusic.pause();
                    this.backgroundMusic.currentTime = 0;
                }
                
                this.currentScreen = 'start';
            }, 300);
        }
    }

    setupMusicPlayback() {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3;
            
            const playMusic = () => {
                this.backgroundMusic.play().catch(e => {
                    console.log("[ScreenManager] Autoplay bloqueado:", e);
                });
                document.removeEventListener('click', playMusic);
            };
            
            document.addEventListener('click', playMusic);
        }
    }

    setupFiltersScroll() {
        const filtersContainer = document.querySelector('.filters-container');
        if (!filtersContainer) return;

        let lastScrollY = 0;
        const handleScroll = () => {
            const currentScrollY = window.scrollY || document.documentElement.scrollTop;
            
            // Si está en el inicio (scroll cercano a 0), mostrar filtros
            if (currentScrollY < 50) {
                filtersContainer.classList.remove('hidden');
            } else if (currentScrollY > lastScrollY) {
                // Si hace scroll hacia abajo, ocultar filtros
                filtersContainer.classList.add('hidden');
            } else {
                // Si hace scroll hacia arriba, mostrar filtros
                filtersContainer.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
    }

    getCurrentScreen() {
        return this.currentScreen;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.screenManager = new ScreenManager();
    console.log('[ScreenManager] Inicializado');
});

let swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 15,
        stretch: 0,
        depth: 500,
        modifier: 1,
        slideShadows: true,
    },
    loop: true,
});