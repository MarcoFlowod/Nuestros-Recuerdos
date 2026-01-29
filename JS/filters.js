// ========== GESTOR DE FILTROS Y FAVORITOS ==========

class FilterManager {
    constructor() {
        this.currentFilter = 'all';
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.specials = JSON.parse(localStorage.getItem('specials')) || [];
        this.galleryImages = [];
        this.init();
    }

    init() {
        // Esperar a que se cargue el DOM completamente
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupListeners());
        } else {
            this.setupListeners();
        }
    }

    setupListeners() {
        // Configurar botones de filtro
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Recopilar imágenes de la galería
        this.galleryImages = document.querySelectorAll('.gallery-image');

        // Configurar botones de favoritos y especiales para cada imagen
        this.galleryImages.forEach((img, index) => {
            const favoriteBtn = img.querySelector('.favorite-btn');
            const specialBtn = img.querySelector('.especial-btn');

            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFavorite(index, img, favoriteBtn, e);
                });
            }

            if (specialBtn) {
                specialBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleSpecial(index, img, specialBtn, e);
                });
            }

            // Restaurar estados de favoritos y especiales al cargar
            this.updateImageState(index, img, favoriteBtn, specialBtn);
        });

        // Aplicar filtro inicial
        this.applyFilter('all');
    }

    handleFilterClick(event) {
        const filterBtn = event.currentTarget;
        const filterType = filterBtn.dataset.filter;

        // Remover clase active de todos los botones
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Agregar clase active al botón clickeado
        filterBtn.classList.add('active');

        // Aplicar el filtro
        this.applyFilter(filterType);
    }

    applyFilter(filterType) {
        this.currentFilter = filterType;
        console.log(`[FilterManager] Aplicando filtro: ${filterType}`);

        this.galleryImages.forEach((img, index) => {
            const foto = fotos[index];
            let shouldShow = false;

            switch (filterType) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'favorite':
                    shouldShow = this.favorites.includes(index);
                    break;
                case 'special':
                    shouldShow = this.specials.includes(index);
                    break;
                case 'recent':
                    shouldShow = foto.categoria.includes('recent');
                    break;
                default:
                    shouldShow = true;
            }

            // Animar la transición
            if (shouldShow) {
                img.style.display = '';
                setTimeout(() => img.classList.add('show'), 10);
                img.classList.remove('hide');
            } else {
                img.classList.add('hide');
                img.classList.remove('show');
                setTimeout(() => {
                    if (img.classList.contains('hide')) {
                        img.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    toggleFavorite(index, imgElement, favoriteBtn, event) {
        if (this.favorites.includes(index)) {
            // Remover de favoritos
            this.favorites = this.favorites.filter(i => i !== index);
            favoriteBtn.classList.remove('active');
            favoriteBtn.querySelector('i').classList.remove('fas');
            favoriteBtn.querySelector('i').classList.add('far');
            imgElement.classList.remove('favorite');
        } else {
            // Agregar a favoritos
            this.favorites.push(index);
            favoriteBtn.classList.add('active');
            favoriteBtn.querySelector('i').classList.remove('far');
            favoriteBtn.querySelector('i').classList.add('fas');
            imgElement.classList.add('favorite');
            
            // Crear animación de corazón
            this.createHeartAnimation(event);
        }

        // Guardar en localStorage
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        console.log('[FilterManager] Favoritos actualizados:', this.favorites);

        // Si estamos en filtro de favoritos, actualizar la vista
        if (this.currentFilter === 'favorite') {
            this.applyFilter('favorite');
        }
    }

    toggleSpecial(index, imgElement, specialBtn, event) {
        if (this.specials.includes(index)) {
            // Remover de especiales
            this.specials = this.specials.filter(i => i !== index);
            specialBtn.classList.remove('active');
            specialBtn.querySelector('i').classList.remove('fas');
            specialBtn.querySelector('i').classList.add('far');
            imgElement.classList.remove('special');
        } else {
            // Agregar a especiales
            this.specials.push(index);
            specialBtn.classList.add('active');
            specialBtn.querySelector('i').classList.remove('far');
            specialBtn.querySelector('i').classList.add('fas');
            imgElement.classList.add('special');
            
            // Crear animación de estrella
            this.createStarAnimation(event);
        }

        // Guardar en localStorage
        localStorage.setItem('specials', JSON.stringify(this.specials));
        console.log('[FilterManager] Especiales actualizados:', this.specials);

        // Si estamos en filtro de especiales, actualizar la vista
        if (this.currentFilter === 'special') {
            this.applyFilter('special');
        }
    }

    updateImageState(index, imgElement, favoriteBtn, specialBtn) {
        // Verificar si está en favoritos
        if (this.favorites.includes(index)) {
            if (favoriteBtn) {
                favoriteBtn.classList.add('active');
                favoriteBtn.querySelector('i').classList.remove('far');
                favoriteBtn.querySelector('i').classList.add('fas');
            }
        }

        // Verificar si está en especiales
        if (this.specials.includes(index)) {
            if (specialBtn) {
                specialBtn.classList.add('active');
                specialBtn.querySelector('i').classList.remove('far');
                specialBtn.querySelector('i').classList.add('fas');
            }
        }
    }

    createHeartAnimation(event) {
        const hearts = ["❤", "💕", "💖", "💝", "💗"];
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = (event.clientX) + 'px';
        heart.style.top = (event.clientY) + 'px';
        heart.style.fontSize = '24px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = 'floatUp 1s ease-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 1000);
    }

    createStarAnimation(event) {
        const stars = ["⭐", "🌟"];
        const star = document.createElement('div');
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        star.style.position = 'fixed';
        star.style.left = (event.clientX) + 'px';
        star.style.top = (event.clientY) + 'px';
        star.style.fontSize = '24px';
        star.style.pointerEvents = 'none';
        star.style.zIndex = '9999';
        star.style.animation = 'floatUp 1s ease-out forwards';
        
        document.body.appendChild(star);
        
        setTimeout(() => star.remove(), 1000);
    }
}

// Inicializar el gestor de filtros cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.filterManager = new FilterManager();
    console.log('[FilterManager] Inicializado');
});
