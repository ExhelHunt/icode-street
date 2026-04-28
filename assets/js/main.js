/* ═══════════════════════════════════════════════
   ICODE STREET — Oracle
   main.js
   ═══════════════════════════════════════════════ */


/* ── CUBE CURSOR ── */
const cursorEl  = document.getElementById('cursor-cube');
const cubeInner = document.getElementById('cube-inner');

let mx = 0, my = 0;
let px = 0, py = 0;
let rotX = 0, rotY = 0;
let velX = 0, velY = 0;

document.addEventListener('mousemove', (e) => {
  const dx = e.clientX - px;
  const dy = e.clientY - py;
  velX = dx;
  velY = dy;
  px = e.clientX;
  py = e.clientY;
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  cursorEl.style.transform = `translate(${mx - 11}px, ${my - 11}px)`;

  // Rotation directionnelle selon la vélocité
  rotY += velX * 0.4;
  rotX -= velY * 0.4;

  // Friction
  velX *= 0.88;
  velY *= 0.88;

  // Rotation idle lente
  rotY += 0.3;
  rotX += 0.15;

  cubeInner.style.animation   = 'none';
  cubeInner.style.transform   = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  requestAnimationFrame(animateCursor);
}
animateCursor();


/* ── HEX CANVAS (surbrillance au survol) ── */
const canvas = document.getElementById('hex-canvas');
const ctx    = canvas.getContext('2d');
let hexes    = [];
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildHexGrid();
}

function buildHexGrid() {
  hexes = [];
  const size = 36;
  const w    = size * 2;
  const h    = Math.sqrt(3) * size;
  const cols = Math.ceil(W / (w * 0.75)) + 2;
  const rows = Math.ceil(H / h) + 2;

  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const x = c * w * 0.75;
      const y = r * h + (c % 2 === 0 ? 0 : h / 2);
      hexes.push({ x, y, size, brightness: 0 });
    }
  }
}

function hexPath(x, y, s) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const hx = x + s * Math.cos(angle);
    const hy = y + s * Math.sin(angle);
    i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
  }
  ctx.closePath();
}

let mouseHexX = -9999, mouseHexY = -9999;
document.addEventListener('mousemove', (e) => {
  mouseHexX = e.clientX;
  mouseHexY = e.clientY;
});

function drawHexes() {
  ctx.clearRect(0, 0, W, H);

  hexes.forEach(h => {
    const dist   = Math.hypot(h.x - mouseHexX, h.y - mouseHexY);
    const radius = 120;
    const target = dist < radius ? (1 - dist / radius) * 0.85 : 0;

    h.brightness += (target - h.brightness) * 0.12;
    if (h.brightness < 0.003) return;

    // Contour cyan
    hexPath(h.x, h.y, h.size - 2);
    ctx.strokeStyle = `rgba(0, 200, 255, ${h.brightness * 0.6})`;
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.fillStyle   = `rgba(0, 200, 255, ${h.brightness * 0.07})`;
    ctx.fill();

    // Halo vert sur les hexagones les plus proches
    if (h.brightness > 0.4) {
      hexPath(h.x, h.y, h.size - 1);
      ctx.strokeStyle = `rgba(0, 255, 136, ${(h.brightness - 0.4) * 0.5})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }
  });

  requestAnimationFrame(drawHexes);
}

window.addEventListener('resize', resize);
resize();
drawHexes();


/* ── SCROLL FADE-IN ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));