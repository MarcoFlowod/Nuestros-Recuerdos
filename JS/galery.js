// ==========================================
// 1. CONFIGURACIÓN DE FIREBASE (Asegúrate de que sea la misma que en addScreen.js)
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAyKDAsA0knWhyzM2mTg44sO3gnb_eoFVE",
    authDomain: "galeria-preset.firebaseapp.com",
    databaseURL: "https://galeria-preset-default-rtdb.firebaseio.com",
    projectId: "galeria-preset",
    storageBucket: "galeria-preset.firebasestorage.app",
    messagingSenderId: "679060061909",
    appId: "1:679060061909:web:bf3e21d22ce16dd7c8ec5c"
};

// Inicializar Firebase si no está inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

let fullImgBox, fullImg;

// ==========================================
// 2. FUNCIÓN PARA OBTENER DATOS DE FIREBASE
// ==========================================
function cargarRecuerdosDesdeFirebase() {
    const galeriaContenedor = document.getElementById('gallery-container'); // id correcto en index.html
    const swiperWrapper = document.getElementById('mobile-swiper-wrapper'); // id correcto en index.html
    const template = document.getElementById('galleryImg'); // plantilla oculta en el HTML

    // Escuchar cambios en la referencia 'recuerdos'
    database.ref('recuerdos').on('value', (snapshot) => {
        const data = snapshot.val();
        
        // Limpiar galerías actuales antes de repintar
        if (galeriaContenedor) galeriaContenedor.innerHTML = '';
        if (swiperWrapper) swiperWrapper.innerHTML = '';

        if (!data) {
            // Si no hay datos, asegurar que el FilterManager se inicialice
            if (!window.filterManager) window.filterManager = new FilterManager();
            return;
        }

        // Convertir objeto de Firebase a Array que preserve la clave y ordenar por fecha (más recientes primero)
        const listaRecuerdos = Object.entries(data)
            .map(([key, val]) => (Object.assign({ key }, val)))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        // Sincronizar marcas de favorito/especial desde la base de datos hacia localStorage
        // para que FilterManager las reconozca al inicializarse.
        try {
            const favIndices = [];
            const specialIndices = [];
            listaRecuerdos.forEach((foto, idx) => {
                if (foto.isFavorite) favIndices.push(idx);
                if (foto.isSpecial) specialIndices.push(idx);
            });
            localStorage.setItem('favorites', JSON.stringify(favIndices));
            localStorage.setItem('specials', JSON.stringify(specialIndices));
        } catch (e) {
            console.warn('[galery] No se pudo sincronizar favoritos/especiales con localStorage', e);
        }

        listaRecuerdos.forEach((foto, index) => {
            // 1. Generar para Desktop usando la plantilla existente
            if (template && galeriaContenedor) {
                const clone = template.cloneNode(true);
                clone.id = '';
                clone.style.display = 'block';
                clone.dataset.index = index;
                // Guardar timestamp para filtros 'recent' y para referencias estables
                if (foto.timestamp) clone.dataset.timestamp = foto.timestamp;
                // Guardar la clave de Firebase para poder eliminar más tarde
                if (foto.key) clone.dataset.key = foto.key;

                const img = clone.querySelector('img');
                if (img) {
                    img.src = foto.url || '';
                    img.alt = foto.titulo || '';
                    img.setAttribute('loading', 'lazy');
                    // Pasar la clave al abrir la imagen cuando esté disponible
                    img.onclick = () => openImg(foto.url, foto.key);
                }

                const fecha = clone.querySelector('.fecha');
                if (fecha) fecha.textContent = foto.fecha || '';
                const lugar = clone.querySelector('.lugar');
                if (lugar) lugar.textContent = foto.lugar || '';

                const titleEl = clone.querySelector('.description h3');
                if (titleEl) titleEl.textContent = foto.titulo || '';
                const descEl = clone.querySelector('.description p');
                if (descEl) descEl.textContent = foto.descripcion || '';

                // Marcar como favorito/especial si corresponde
                if (foto.isFavorite) {
                    clone.classList.add('favorite');
                    const favBtn = clone.querySelector('.favorite-btn');
                    if (favBtn) {
                        favBtn.classList.add('active');
                        const icon = favBtn.querySelector('i'); if (icon) { icon.classList.remove('far'); icon.classList.add('fas'); }
                    }
                }
                if (foto.isSpecial) {
                    clone.classList.add('special');
                    const spBtn = clone.querySelector('.especial-btn');
                    if (spBtn) {
                        spBtn.classList.add('active');
                        const icon = spBtn.querySelector('i'); if (icon) { icon.classList.remove('far'); icon.classList.add('fas'); }
                    }
                }

                galeriaContenedor.appendChild(clone);
            } else if (galeriaContenedor) {
                // Fallback simple
                const div = document.createElement('div');
                div.className = 'gallery-image';
                div.dataset.index = index;
                div.innerHTML = `<img src="${foto.url}" alt="${foto.titulo}" onclick="openImg('${foto.url}')">`;
                galeriaContenedor.appendChild(div);
            }

            // 2. Generar slide para Swiper (móvil)
            if (swiperWrapper) {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide mobile-gallery-image';
                slide.dataset.index = index;
                if (foto.timestamp) slide.dataset.timestamp = foto.timestamp;
                // Guardar la clave de Firebase para el slide también
                if (foto.key) slide.dataset.key = foto.key;
                slide.innerHTML = `
                    <figure>
                        <div class="image-container">
                            <img src="${foto.url}" alt="${foto.titulo}" onclick="FullImg(this.src)">
                            <div class="info-text">
                                <span class="fecha">${foto.fecha || ''}</span>
                                <span class="lugar">${foto.lugar || ''}</span>
                            </div>
                        </div>
                        <div class="image-overlay">
                            <div class="top-btns">
                                <button class="favorite-btn" title="Marcar como favorito">
                                    <i class="far fa-heart"></i>
                                </button>
                                <button class="especial-btn" title="Marcar como especial">
                                    <i class="far fa-star"></i>
                                </button>
                            </div>
                        </div>
                        <div class="description">
                            <h3>${foto.titulo || ''}</h3>
                            <p>${foto.descripcion || ''}</p>
                        </div>
                    </figure>`;
                swiperWrapper.appendChild(slide);
            }
        });

        // Inicializar/actualizar FilterManager para que reconozca los elementos con data-index
        if (!window.filterManager) {
            window.filterManager = new FilterManager();
        } else {
            // Forzar re-setup para re-coleccionar los elementos del DOM
            window.filterManager.init();
        }

        // Inicializar Swiper si está disponible (solo para dispositivos móviles)
        if (typeof Swiper !== 'undefined') {
            if (window.swiperInstance) {
                try { window.swiperInstance.update(); } catch (e) { /* ignore */ }
            } else {
                window.swiperInstance = new Swiper('.mySwiper', { spaceBetween: 10, pagination: { el: '.swiper-pagination' } });
            }
            // Después de inicializar/actualizar Swiper, volver a enganchar listeners móviles
            // (Swiper puede clonar/reemplazar slides y eliminar listeners previos)
            if (window.filterManager && typeof window.filterManager.setupMobileListeners === 'function') {
                // Ejecutar en el siguiente ciclo para asegurar que Swiper terminó de renderizar
                setTimeout(() => { window.filterManager.setupMobileListeners(); }, 50);
            }
        }
    });
}

// ==========================================
// 3. GENERADOR DE HTML (Plantilla única)
// ==========================================
function crearHTMLRecuerdo(foto, tipo) {
    const categorias = [];
    if (foto.isFavorite) categorias.push('favorite');
    if (foto.isSpecial) categorias.push('special');

    if (tipo === 'desktop') {
        return `
            <div class="gallery-image ${categorias.join(' ')}">
                <img src="${foto.url}" alt="${foto.titulo}" onclick="openImg('${foto.url}')">
                <div class="image-overlay">
                    <div class="image-info">
                        <h3>${foto.titulo}</h3>
                        <p><i class="fas fa-calendar-alt"></i> ${foto.fecha}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${foto.lugar}</p>
                    </div>
                </div>
            </div>`;
    } else {
        return `
            <div class="swiper-slide mobile-gallery-image ${categorias.join(' ')}">
                <figure>
                    <div class="image-container">
                        <img src="${foto.url}" alt="${foto.titulo}" onclick="FullImg(this.src)">
                        <div class="info-text">
                            <span class="fecha">${foto.fecha}</span>
                            <span class="lugar">${foto.lugar}</span>
                        </div>
                    </div>
                    <div class="image-overlay">
                        <div class="top-btns">
                            <button class="favorite-btn" title="Marcar como favorito">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="especial-btn" title="Marcar como especial">
                                <i class="far fa-star"></i>
                            </button>
                        </div>
                    </div>
                    <div class="description">
                        <h3>${foto.titulo}</h3>
                        <p>${foto.descripcion}</p>
                    </div>
                </figure>
            </div>`;
    }
}

// ==========================================
// 4. FUNCIONES DE UI (Abrir imagen, etc.)
// ==========================================
function openImg(reference, key) {
    fullImgBox = document.getElementById('FullImgBox');
    fullImg = document.getElementById('fullImg');
    fullImgBox.style.display = 'flex';
    fullImg.src = reference;
    if (key) {
        fullImg.dataset.key = key;
    } else {
        const foundKey = findKeyByUrl(reference);
        if (foundKey) fullImg.dataset.key = foundKey;
        else delete fullImg.dataset.key;
    }
}

function findKeyByUrl(url) {
    const imgs = document.querySelectorAll('[data-key] img, .gallery-image img, .mobile-gallery-image img');
    for (const img of imgs) {
        if (!img.src) continue;
        try {
            if (img.src === url || img.getAttribute('src') === url) {
                const parent = img.closest('[data-key]') || img.closest('.swiper-slide');
                return parent ? parent.dataset.key || null : null;
            }
            if (img.src.endsWith(url) || url.endsWith(img.src)) {
                const parent = img.closest('[data-key]') || img.closest('.swiper-slide');
                return parent ? parent.dataset.key || null : null;
            }
        } catch (e) { /* ignore */ }
    }
    return null;
}

async function deleteImg() {
    const key = fullImg?.dataset?.key || findKeyByUrl(fullImg?.src || '');
    if (!key) {
        alert('No se pudo identificar la imagen para eliminar.');
        return;
    }
    if (!confirm('¿Seguro que quieres eliminar esta imagen?')) return;
    try {
        await database.ref('recuerdos/' + key).remove();
        closeImg();
        setTimeout(() => { alert('Imagen eliminada.'); }, 100);
    } catch (err) {
        console.error('Error eliminando imagen:', err);
        alert('Error al eliminar la imagen.');
    }
}

// Compatibilidad con llamadas existentes desde HTML o otros scripts
function FullImg(reference) {
    try {
        openImg(reference);
    } catch (err) {
        console.warn('openImg no disponible', err);
    }
}

function closeImg() {
    if (fullImgBox) fullImgBox.style.display = 'none';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarRecuerdosDesdeFirebase();
    const delBtn = document.getElementById('deleteImgBtn');
    if (delBtn) delBtn.addEventListener('click', deleteImg);
});