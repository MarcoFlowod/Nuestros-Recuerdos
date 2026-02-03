// JS/addScreen.js
class AddMemoryScreen {
    constructor() {
        this.form = document.getElementById('memoryForm');
        this.imageUpload = document.getElementById('imageUpload');
        this.imageDropZone = document.getElementById('imageDropZone');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImage = document.getElementById('previewImage');
        this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
        this.removeImageBtn = document.getElementById('removeImageBtn');
        this.successMessage = document.getElementById('successMessage');
        this.loadingModal = document.getElementById('loadingModal');
        
        this.isFavorite = false;
        this.isSpecial = false;
        this.currentImage = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.setupHeartRain();
        this.setupDatePicker();
    }

    setupEventListeners() {
        // Subida de imagen
        this.imageDropZone.addEventListener('click', () => this.imageUpload.click());
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.removeImageBtn.addEventListener('click', () => this.removeImage());
        
        // Drag and drop
        this.imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.imageDropZone.style.borderColor = 'var(--primary-color)';
            this.imageDropZone.style.background = 'rgba(255, 85, 85, 0.1)';
        });
        
        this.imageDropZone.addEventListener('dragleave', () => {
            this.imageDropZone.style.borderColor = 'var(--add-border)';
            this.imageDropZone.style.background = 'rgba(255, 255, 255, 0.05)';
        });
        
        this.imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.imageDropZone.style.borderColor = 'var(--add-border)';
            this.imageDropZone.style.background = 'rgba(255, 255, 255, 0.05)';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleImageFile(file);
            }
        });
        
        // Botones de opciones
        document.getElementById('markFavoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });
        
        document.getElementById('markSpecialBtn').addEventListener('click', () => {
            this.toggleSpecial();
        });
        
        // Formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Botón cancelar
        document.getElementById('cancelBtn').addEventListener('click', () => {
            if (confirm('¿Seguro que quieres cancelar? Se perderán los datos no guardados.')) {
                window.location.href = '../index.html';
            }
        });
    }

    setupCanvas() {
        const canvas = document.getElementById('loveRainCanvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext('2d');
            
            // Efecto de partículas simple
            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Dibujar estrellas de fondo
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                for (let i = 0; i < 50; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const size = Math.random() > 0.9 ? 2 : 1;
                    ctx.fillRect(x, y, size, size);
                }
                
                requestAnimationFrame(drawParticles);
            }
            
            drawParticles();
            
            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }
    }

    setupHeartRain() {
        const container = document.getElementById('rainEffect');
        if (!container) return;
        
        const hearts = ["❤️", "💕", "💖", "💘", "💝", "♥", "♡"];
        
        function createHeart() {
            const heart = document.createElement("span");
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '-50px';
            heart.style.fontSize = Math.random() * 20 + 15 + 'px';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            heart.style.color = '#ff5555';
            heart.style.zIndex = '1';
            heart.style.pointerEvents = 'none';
            heart.style.animation = `fall ${Math.random() * 3 + 5}s linear forwards`;
            
            container.appendChild(heart);
            
            setTimeout(() => heart.remove(), 8000);
        }
        
        setInterval(createHeart, 500);
    }

    setupDatePicker() {
        // Establecer fecha actual por defecto
        const dateInput = document.getElementById('memoryDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.max = today; // No permitir fechas futuras
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.handleImageFile(file);
        }
    }

    handleImageFile(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.currentImage = {
                file: file,
                url: e.target.result
            };
            
            this.showPreview(e.target.result);
        };
        
        reader.readAsDataURL(file);
    }

    showPreview(imageUrl) {
        this.previewImage.src = imageUrl;
        this.uploadPlaceholder.style.display = 'none';
        this.imagePreview.style.display = 'block';
    }

    removeImage() {
        this.currentImage = null;
        this.imageUpload.value = '';
        this.imagePreview.style.display = 'none';
        this.uploadPlaceholder.style.display = 'block';
    }

    toggleFavorite() {
        const btn = document.getElementById('markFavoriteBtn');
        this.isFavorite = !this.isFavorite;
        
        if (this.isFavorite) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i> Favorito';
            this.createConfettiEffect('#ff5555');
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i> Favorito';
        }
    }

    toggleSpecial() {
        const btn = document.getElementById('markSpecialBtn');
        this.isSpecial = !this.isSpecial;
        
        if (this.isSpecial) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-star"></i> Especial';
            this.createConfettiEffect('#ffaa00');
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-star"></i> Especial';
        }
    }

    createConfettiEffect(color) {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: [color]
            });
        }
    }

    validateForm() {
        const title = document.getElementById('memoryTitle').value.trim();
        const date = document.getElementById('memoryDate').value;
        
        if (!title) {
            alert('Por favor, ingresa un título para el recuerdo.');
            return false;
        }
        
        if (!date) {
            alert('Por favor, selecciona una fecha.');
            return false;
        }
        
        if (!this.currentImage) {
            alert('Por favor, selecciona una imagen para el recuerdo.');
            return false;
        }
        
        return true;
    }

    handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.showLoading(true);
        
        // Simular procesamiento (en un caso real, aquí subirías la imagen a un servidor)
        setTimeout(() => {
            const memory = this.createMemoryObject();
            this.saveMemory(memory);
            this.showLoading(false);
            this.showSuccessMessage();
        }, 1500);
    }

    createMemoryObject() {
        // Crear un ID único
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        
        // Obtener datos del formulario
        return {
            id: id,
            url: this.currentImage.url, // En producción, sería una URL del servidor
            titulo: document.getElementById('memoryTitle').value.trim(),
            descripcion: document.getElementById('memoryDescription').value.trim(),
            fecha: this.formatDate(document.getElementById('memoryDate').value),
            lugar: document.getElementById('memoryLocation').value.trim(),
            categoria: this.getCategories(),
            fechaCreacion: new Date().toISOString(),
            metadata: {
                isFavorite: this.isFavorite,
                isSpecial: this.isSpecial
            }
        };
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    getCategories() {
        const categories = [];
        if (this.isFavorite) categories.push('favorite');
        if (this.isSpecial) categories.push('special');
        return categories.join(' ');
    }

    saveMemory(memory) {
        try {
            // 1. Guardar en localStorage (para persistencia temporal)
            const memories = JSON.parse(localStorage.getItem('userMemories')) || [];
            memories.push(memory);
            localStorage.setItem('userMemories', JSON.stringify(memories));
            
            // 2. Agregar a la galería principal (global)
            if (window.fotos && Array.isArray(window.fotos)) {
                window.fotos.unshift(memory); // Agregar al inicio
            }
            
            // 3. Actualizar contador en el almacenamiento principal
            const galleryData = JSON.parse(localStorage.getItem('galleryData')) || { count: 0, lastUpdate: null };
            galleryData.count = (galleryData.count || 0) + 1;
            galleryData.lastUpdate = new Date().toISOString();
            localStorage.setItem('galleryData', JSON.stringify(galleryData));
            
            console.log('Recuerdo guardado:', memory);
            return true;
        } catch (error) {
            console.error('Error al guardar el recuerdo:', error);
            return false;
        }
    }

    showLoading(show) {
        this.loadingModal.style.display = show ? 'flex' : 'none';
    }

    showSuccessMessage() {
        this.successMessage.style.display = 'flex';
        
        // Efecto de confeti al guardar exitosamente
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
        
        // Opcional: Reproducir sonido de éxito
        this.playSuccessSound();
    }

    playSuccessSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
            audio.volume = 0.3;
            audio.play();
        } catch (e) {
            console.log('No se pudo reproducir sonido:', e);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.addMemoryScreen = new AddMemoryScreen();
    console.log('[AddMemoryScreen] Inicializado');
});

// Añadir animación de caída para corazones
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);