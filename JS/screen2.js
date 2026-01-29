// ========== CANVAS 2 - LOVE RAIN 2 (Segunda Pantalla) ==========

let canvas2, ctx2;
let hearts2 = [];
let canvas2AnimationId;
let heartRainInterval;

// Colores vibrantes
const canvasColors = [
    "#ff5555", "#ffaa00", "#55ff55", "#5555ff",
    "#aa00aa", "#00aaaa", "#ffff55", "#ff55ff",
    "#55ffff", "#aaaaaa"
];

function initCanvas2() {
    canvas2 = document.getElementById('loveRain2');
    if (canvas2) {
        canvas2.width = window.innerWidth;
        canvas2.height = window.innerHeight;
        ctx2 = canvas2.getContext('2d');
    }
}

function startHeartRain(container) {
    if (!container) return;
    
    const hearts = ["♡", "♥", "ღ","❣","❤","<3", "ౚ","ద"];
    
    function createHeart() {
        if (!container) return;
        
        const heart = document.createElement("span");
        let heart_emoji = hearts[Math.floor(Math.random() * hearts.length)];
        let size = Math.random() * 20 + 10;
        let posX = Math.random() * window.innerWidth;
        let duration = Math.random() * 5 + 5;
        let delay = Math.random() * 5;
        let opacity = Math.random() * 0.5 + 0.3;

        heart.textContent = heart_emoji;
        heart.style.left = posX + "px";
        heart.style.animationDuration = duration + "s";
        heart.style.animationDelay = delay + "s";
        heart.style.fontSize = size + "px";
        heart.style.opacity = opacity;
        heart.style.color = canvasColors[Math.floor(Math.random() * canvasColors.length)];

        container.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode === container) {
                heart.remove();
            }
        }, (duration + delay) * 1000);
    }
    
    heartRainInterval = setInterval(createHeart, 300);
    
    // Animación simple para canvas2
    if (canvas2 && ctx2) {
        function animateCanvas2() {
            if (!ctx2 || !canvas2) return;
            
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
            
            // Dibujar estrellas
            ctx2.fillStyle = "rgba(255, 255, 255, 0.3)";
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * canvas2.width;
                const y = Math.random() * canvas2.height;
                const size = Math.random() > 0.9 ? 2 : 1;
                ctx2.fillRect(x, y, size, size);
            }
            
            canvas2AnimationId = requestAnimationFrame(animateCanvas2);
        }
        
        animateCanvas2();
    }
}

// Redimensionamiento de ventana para canvas2
function handleCanvas2Resize() {
    if (canvas2) {
        canvas2.width = window.innerWidth;
        canvas2.height = window.innerHeight;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initCanvas2();
    window.addEventListener('resize', handleCanvas2Resize);
});

// Detener la lluvia de corazones cuando sea necesario
function stopHeartRain() {
    if (heartRainInterval) {
        clearInterval(heartRainInterval);
        heartRainInterval = null;
    }
    if (canvas2AnimationId) {
        cancelAnimationFrame(canvas2AnimationId);
        canvas2AnimationId = null;
    }
}

document.addEventListener("click", (e) => {

  // ❤️ corazones pequeños
const heartsAmount = 12;

for (let i = 0; i < heartsAmount; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";

    const size = Math.random() * 6 + 4; // mini
    heart.style.fontSize = size + "px";

    const colors = ["#ff4d6d", "#ff85a1", "#ffd6ff", "#c77dff"];
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];

    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";

    const x = (Math.random() - 0.5) * 250 + "px";
    const y = (Math.random() - 0.5) * 250 + "px";
    heart.style.setProperty("--x", x);
    heart.style.setProperty("--y", y);

    heart.style.opacity = Math.random() * 0.5 + 0.3;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
}

  // ✨ polvo mágico (partículas)
const dustAmount = 25;

for (let i = 0; i < dustAmount; i++) {
    const dust = document.createElement("div");
    dust.className = "particle";

    const size = Math.random() * 4 + 2;
    dust.style.width = size + "px";
    dust.style.height = size + "px";

    const colors = ["#ffffff", "#ffd6ff", "#c77dff", "#9d4edd", "#ffafcc"];
    dust.style.background = colors[Math.floor(Math.random() * colors.length)];

    dust.style.left = e.clientX + "px";
    dust.style.top = e.clientY + "px";

    const x = (Math.random() - 0.5) * 300 + "px";
    const y = (Math.random() - 0.5) * 300 + "px";
    dust.style.setProperty("--x", x);
    dust.style.setProperty("--y", y);

    dust.style.opacity = Math.random() * 0.6 + 0.2;

    document.body.appendChild(dust);
    setTimeout(() => dust.remove(), 2000);
}

});
