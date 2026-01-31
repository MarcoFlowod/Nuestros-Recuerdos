// Datos de todas las fotos
const fotos = [
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img1.webp",
        titulo: "Nuestro Primer Día",
        descripcion: "Eres mi rayo de sol en los días nublados...",
        fecha: "30/11/2025",
        lugar: "Lugar Especial",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img2.webp",
        titulo: "Momentos Especiales",
        descripcion: "Cada instante contigo es perfecto...",
        fecha: "30/11/2025",
        lugar: "Lugar Especial",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img3.webp",
        titulo: "Paseo Inolvidable",
        descripcion: "Tu belleza ilumina todo a su alrededor...",
        fecha: "11/11/2025",
        lugar: "Paseo",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img4.webp",
        titulo: "Juntos Siempre",
        descripcion: "Contigo los segundos se convierten en eternidad...",
        fecha: "25/10/2025",
        lugar: "Casa",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img5.webp",
        titulo: "Sonrisas Compartidas",
        descripcion: "Tu sonrisa es mi razón para sonreír...",
        fecha: "20/10/2025",
        lugar: "Parque",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img6.webp",
        titulo: "Amor Infinito",
        descripcion: "Mi amor por ti es tan profundo como el océano...",
        fecha: "15/10/2025",
        lugar: "Playa",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img7.webp",
        titulo: "Momentos Mágicos",
        descripcion: "Eres la magia en mi vida cotidiana...",
        fecha: "05/10/2025",
        lugar: "Atardecer",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img8.webp",
        titulo: "Recuerdos Felices",
        descripcion: "Cada momento contigo es un recuerdo para siempre...",
        fecha: "01/10/2025",
        lugar: "Especial",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img9.webp",
        titulo: "Te Amo",
        descripcion: "Con todo mi corazón...",
        fecha: "28/09/2025",
        lugar: "Casa",
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img10.webp",
        titulo: "Eternidad",
        descripcion: "Quiero pasar mi eternidad contigo...",
        fecha: "20/09/2025",
        lugar: "Lugar Especial",
        //categoria: "recent"
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img11.webp",
        titulo: "Mi Amor",
        descripcion: "Eres todo para mí...",
        fecha: "15/09/2025",
        lugar: "Nuestro Lugar",
        //categoria: "favorite special"
    },
    {
        url: "https://raw.githubusercontent.com/MarcoFlowod/Proyectos-para-dedicar/main/Proyectos%E2%99%A5/imagenes/img12.webp",
        titulo: "Para Siempre",
        descripcion: "Te amaré por siempre...",
        fecha: "10/09/2025",
        lugar: "Corazón",
        //categoria: "special"
    }
];

// Generar galería dinámicamente
function generarGaleria() {
    const container = document.getElementById('gallery-container');
    const galleryImg = document.getElementById('galleryImg');
    
    if (!container || !galleryImg) return;
    
    fotos.forEach((foto, index) => {
        // Clonar el template
        const figure = galleryImg.cloneNode(true);
        figure.id = ''; // Remover id del template
        figure.style.display = ''; // Mostrar el elemento clonado
        
        // Asignar clases y atributos
        figure.className = `gallery-image ${foto.categoria}`;
        figure.dataset.index = index;
        figure.dataset.category = foto.categoria;
        figure.dataset.date = foto.fecha;
        figure.dataset.location = foto.lugar;
        
        // Rellenar contenido
        figure.querySelector('img').src = foto.url;
        figure.querySelector('img').alt = foto.titulo;
        figure.querySelector('.fecha').textContent = foto.fecha;
        figure.querySelector('.lugar').textContent = foto.lugar;
        figure.querySelector('.description h3').textContent = foto.titulo;
        figure.querySelector('.description p').textContent = foto.descripcion;
        
        container.appendChild(figure);
    });
    
    // Remover el template después de generar la galería
    if (galleryImg) {
        galleryImg.remove();
    }
}

// MODAL DE IMAGEN AMPLIADA
let fullImgBox;
let fullImg;

function FullImg(reference) {
    // Asegurarse de obtener los elementos si aún no existen
    if (!fullImgBox || !fullImg) {
        fullImgBox = document.getElementById('FullImgBox');
        fullImg = document.getElementById('fullImg');
        if (!fullImgBox || !fullImg) return;
    }

    fullImgBox.style.display = 'flex';
    fullImg.src = reference;
    // Intentar dar foco al overlay para mejorar la accesibilidad
    try { fullImgBox.focus(); } catch (e) {}
}

function closeImg() {
    if (!fullImgBox) fullImgBox = document.getElementById('FullImgBox');
    if (!fullImgBox) return;
    fullImgBox.style.display = 'none';
    if (fullImg) fullImg.src = '';
}

// Ejecutar cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    generarGaleria();

    // Obtener elementos ahora que el DOM está listo
    fullImgBox = document.getElementById('FullImgBox');
    fullImg = document.getElementById('fullImg');

    if (!fullImgBox || !fullImg) return;

    // Cerrar al hacer clic fuera de la imagen (en el overlay)
    fullImgBox.addEventListener('click', (e) => {
        if (e.target === fullImgBox) {
            closeImg();
        }
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullImgBox.style.display === 'flex') {
            closeImg();
        }
    });

    // Hacer el overlay enfocadable para soporte de teclado
    fullImgBox.tabIndex = -1;
});
