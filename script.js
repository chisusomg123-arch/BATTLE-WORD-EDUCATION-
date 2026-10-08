// --- SISTEMA DE NAVEGACIÓN ---
function nextScreen(screenNum) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${screenNum}`);
  if (target) {
    target.classList.add('active');
    document.getElementById('screenSelect').value = screenNum;
  }

  if (screenNum === 14) {
    startPixelWar();
  }
}

function jumpToScreen(val) {
  nextScreen(parseInt(val));
}

function answerQuiz(correct) {
  if (correct) {
    nextScreen(11);
  } else {
    alert("Respuesta Incorrecta. Inicias batalla con desventaja táctica.");
    nextScreen(14);
  }
}

// --- MOTOR GRAFICO 2D PIXEL WAR (OPTIMIZADO PARA 60 FPS) ---
let canvas, ctx;
let isRunning = false;

// Estado del jugador
const player = {
  x: 50,
  y: 140,
  w: 16,
  h: 16,
  speed: 3,
  color: '#f1c40f' // Amarillo Sol
};

let bullets = [];
let enemies = [];
const keys = {};

function startPixelWar() {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');
  
  // Reiniciar estado
  player.x = 50;
  player.y = 140;
  bullets = [];
  enemies = [
    { x: 550, y: 60, w: 16, h: 16, speed: 1.2, color: '#e74c3c' },
    { x: 580, y: 150, w: 16, h: 16, speed: 1.5, color: '#e74c3c' },
    { x: 520, y: 220, w: 16, h: 16, speed: 1.0, color: '#e74c3c' }
  ];

  window.removeEventListener('keydown', handleKeyDown);
  window.addEventListener('keydown', handleKeyDown);

  isRunning = true;
  requestAnimationFrame(gameLoop);
}

function handleKeyDown(e) {
  if (e.code === 'Space') {
    // Generar disparo
    bullets.push({ x: player.x + 16, y: player.y + 6, w: 6, h: 4, speed: 6, color: '#1a5276' });
  }
}

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// Bucle Principal de Juego a 60 FPS
function gameLoop() {
  if (!isRunning) return;

  // 1. ACTUALIZAR POSICIONES
  if ((keys['KeyW'] || keys['ArrowUp']) && player.y > 0) player.y -= player.speed;
  if ((keys['KeyS'] || keys['ArrowDown']) && player.y < canvas.height - player.h) player.y += player.speed;
  if ((keys['KeyA'] || keys['ArrowLeft']) && player.x > 0) player.x -= player.speed;
  if ((keys['KeyD'] || keys['ArrowRight']) && player.x < canvas.width - player.w) player.x += player.speed;

  // 2. RENDERIZAR
  ctx.fillStyle = '#27ae60'; // Fondo Verde Terreno
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar Jugador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Proyectiles
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.speed;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);

    if (b.x > canvas.width) bullets.splice(i, 1);
  }

  // Enemigos y Colisiones
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.x -= e.speed;
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.w, e.h);

    // Colisión con Balas
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }

    if (e.x < -16) e.x = canvas.width;
  }

  requestAnimationFrame(gameLoop);
}