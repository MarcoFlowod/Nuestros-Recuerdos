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
    const galeriaContenedor = document.getElementById('galeriaRecuerdos');
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    // Escuchar cambios en la referencia 'recuerdos'
    database.ref('recuerdos').on('value', (snapshot) => {
        const data = snapshot.val();
        
        // Limpiar galerías actuales antes de repintar
        if (galeriaContenedor) galeriaContenedor.innerHTML = '';
        if (swiperWrapper) swiperWrapper.innerHTML = '';

        if (data) {
            // Convertir objeto de Firebase a Array y ordenar por fecha (más recientes primero)
            const listaRecuerdos = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);

            listaRecuerdos.forEach(foto => {
                // 1. Generar para Desktop
                if (galeriaContenedor) {
                    const htmlDesktop = crearHTMLRecuerdo(foto, 'desktop');
                    galeriaContenedor.innerHTML += htmlDesktop;
                }

                // 2. Generar para Swiper Móvil
                if (swiperWrapper) {
                    const htmlMovil = crearHTMLRecuerdo(foto, 'mobile');
                    swiperWrapper.innerHTML += htmlMovil;
                }
            });

            // Reinicializar manager de filtros para que reconozca los nuevos elementos
            if (window.filterManager) {
                window.filterManager.init(); 
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
                    <img src="${foto.url}" alt="${foto.titulo}">
                    <div class="image-tags">
                        <span class="fecha">${foto.fecha}</span>
                        <span class="lugar">${foto.lugar}</span>
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
function openImg(reference) {
    fullImgBox = document.getElementById('FullImgBox');
    fullImg = document.getElementById('fullImg');
    fullImgBox.style.display = 'flex';
    fullImg.src = reference;
}

function closeImg() {
    fullImgBox.style.display = 'none';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarRecuerdosDesdeFirebase();
});