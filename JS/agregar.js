// ==========================================
// 1. CONFIGURACIÓN DE FIREBASE (Tus credenciales reales)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAyKDAsA0knWhyzM2mTg44sO3gnb_eoFVE",
  authDomain: "galeria-preset.firebaseapp.com",
  databaseURL: "https://galeria-preset-default-rtdb.firebaseio.com",
  projectId: "galeria-preset",
  storageBucket: "galeria-preset.firebasestorage.app",
  messagingSenderId: "679060061909",
  appId: "1:679060061909:web:bf3e21d22ce16dd7c8ec5c",
  measurementId: "G-ZMBFW4JGLC"
};

// Inicializar Firebase en modo compatibilidad
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
        
        this.currentImageFile = null;
        this.isFavorite = false;
        this.isSpecial = false;
        this.markFavoriteBtn = document.getElementById('markFavoriteBtn');
        this.markSpecialBtn = document.getElementById('markSpecialBtn');
        
        this.init();
    }

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
        if (!this.markFavoriteBtn) return;
        this.markFavoriteBtn.classList.toggle('active', this.isFavorite);
        this.markFavoriteBtn.innerHTML = `<i class="${this.isFavorite ? 'fas' : 'far'} fa-heart"></i> Favorito`;
    }

    toggleSpecial() {
        this.isSpecial = !this.isSpecial;
        if (!this.markSpecialBtn) return;
        this.markSpecialBtn.classList.toggle('active', this.isSpecial);
        this.markSpecialBtn.innerHTML = `<i class="${this.isSpecial ? 'fas' : 'far'} fa-star"></i> Especial`;
    }

    init() {
        this.setupEventListeners();
        this.setupDatePicker();
    }

    setupEventListeners() {
        // Clic para subir
        this.imageDropZone.addEventListener('click', () => this.imageUpload.click());
        
        // Selección de archivo
        this.imageUpload.addEventListener('change', (e) => this.handleImageFile(e.target.files[0]));
        
        // Botón remover imagen
        this.removeImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeImage();
        });

        // --- FUNCIONALIDAD DRAG & DROP ---
        this.imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.imageDropZone.style.borderColor = 'var(--primary-color)';
            this.imageDropZone.style.background = 'rgba(255, 85, 85, 0.1)';
        });

        this.imageDropZone.addEventListener('dragleave', () => {
            this.imageDropZone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            this.imageDropZone.style.background = 'rgba(255, 255, 255, 0.05)';
        });

        this.imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.imageDropZone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            this.imageDropZone.style.background = 'rgba(255, 255, 255, 0.05)';
            const file = e.dataTransfer.files[0];
            this.handleImageFile(file);
        });

        // Formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Cancelar
        document.getElementById('cancelBtn').addEventListener('click', () => {
            if (confirm('¿Seguro que quieres salir?')) window.location.href = '../index.html';
        });
        // Agregar otro recuerdo
        const addAnotherBtn = document.getElementById('addAnotherBtn');
        if (addAnotherBtn) {
            addAnotherBtn.addEventListener('click', () => this.resetForm());
        }

        // Opciones especiales (favorito / especial)
        if (this.markFavoriteBtn) this.markFavoriteBtn.addEventListener('click', (e) => { e.preventDefault(); this.toggleFavorite(); });
        if (this.markSpecialBtn) this.markSpecialBtn.addEventListener('click', (e) => { e.preventDefault(); this.toggleSpecial(); });
    }

    setupDatePicker() {
        const dateInput = document.getElementById('memoryDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.max = today;
    }

    handleImageFile(file) {
        if (file && file.type.startsWith('image/')) {
            this.currentImageFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewImage.src = e.target.result;
                this.uploadPlaceholder.style.display = 'none';
                this.imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage() {
        this.currentImageFile = null;
        this.imageUpload.value = '';
        this.imagePreview.style.display = 'none';
        this.uploadPlaceholder.style.display = 'block';
    }

    // Mostrar u ocultar modal de carga
    showLoading(isVisible) {
        if (!this.loadingModal) return;
        this.loadingModal.style.display = isVisible ? 'flex' : 'none';
    }

    // Mostrar mensaje de éxito
    showSuccessMessage() {
        if (!this.successMessage) return;
        this.successMessage.style.display = 'block';
        // Opcional: resetear formulario y volver a la galería después de un tiempo
        this.form.reset();
        this.removeImage();
        // Resetear flags y estado visual de botones
        this.isFavorite = false;
        this.isSpecial = false;
        if (this.markFavoriteBtn) {
            this.markFavoriteBtn.classList.remove('active');
            this.markFavoriteBtn.innerHTML = `<i class="far fa-heart"></i> Favorito`;
        }
        if (this.markSpecialBtn) {
            this.markSpecialBtn.classList.remove('active');
            this.markSpecialBtn.innerHTML = `<i class="far fa-star"></i> Especial`;
        }
    }

    // Resetear el formulario y permitir agregar otro
    resetForm() {
        this.form.reset();
        this.removeImage();
        this.successMessage.style.display = 'none';
        this.currentImageFile = null;
        this.isFavorite = false;
        this.isSpecial = false;
        if (this.markFavoriteBtn) {
            this.markFavoriteBtn.classList.remove('active');
            this.markFavoriteBtn.innerHTML = `<i class="far fa-heart"></i> Favorito`;
        }
        if (this.markSpecialBtn) {
            this.markSpecialBtn.classList.remove('active');
            this.markSpecialBtn.innerHTML = `<i class="far fa-star"></i> Especial`;
        }
        this.setupDatePicker();
        // Scroll al inicio del formulario
        window.scrollTo(0, 0);
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.currentImageFile) return alert("Por favor, selecciona una imagen.");

        this.showLoading(true);

        try {
            // 1. Subir a Cloudinary
            const imageUrl = await this.uploadToCloudinary(this.currentImageFile);

            // 2. Guardar en Firebase
            const memory = {
                url: imageUrl,
                titulo: document.getElementById('memoryTitle').value.trim(),
                descripcion: document.getElementById('memoryDescription').value.trim(),
                fecha: document.getElementById('memoryDate').value,
                lugar: document.getElementById('memoryLocation').value.trim() || "Lugar Especial",
                isFavorite: !!this.isFavorite,
                isSpecial: !!this.isSpecial,
                timestamp: Date.now()
            };

            await database.ref('recuerdos').push(memory);

            this.showLoading(false);
            this.showSuccessMessage();
            if (typeof confetti === 'function') confetti();

        } catch (error) {
            this.showLoading(false);
            console.error(error);
            alert("Error al guardar: " + error.message);
        }
    }

    async uploadToCloudinary(file) {
        const formData = new FormData();
        
        // El archivo binario que capturaste con el input o drag & drop
        formData.append('file', file);
        
        // El nombre exacto del preset que creamos en el paso anterior
        const uploadPreset = 'galeria_preset';
        formData.append('upload_preset', uploadPreset);

        // Reemplaza 'TU_CLOUD_NAME' con tu Cloud Name real
        const cloudName = 'dydxpxb5i'; 
        const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        console.debug('Cloudinary upload', { endpoint, uploadPreset, fileName: file.name, fileType: file.type });

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMsg = text;
                try { errorMsg = JSON.parse(text).error.message; } catch (e) { /* no-op */ }
                throw new Error(errorMsg || 'Error al subir a Cloudinary');
            }

            const data = await response.json();
            
            // Esta es la URL pública que guardaremos en Firebase
            return data.secure_url; 
            
        } catch (error) {
            console.error("Error en Cloudinary:", error);
            throw error;
        }
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new AddMemoryScreen();
});