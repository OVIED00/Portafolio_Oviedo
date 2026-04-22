/* ═══════════════════════════════════════════
   Juan Pablo Oviedo — Portfolio Scripts
═══════════════════════════════════════════ */

// ── CURSOR ──────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// ── CANVAS PARTICLE SYSTEM ───────────────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 80;

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '99,255,180' : '78,168,255';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,255,180,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gradient background
  const grad = ctx.createRadialGradient(canvas.width * 0.2, canvas.height * 0.5, 0, canvas.width * 0.2, canvas.height * 0.5, canvas.width * 0.7);
  grad.addColorStop(0, 'rgba(99,255,180,0.04)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── NAVIGATION ───────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  handleReveal();
});

// ── HAMBURGER MENU ───────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
}

// ── SCROLL REVEAL ────────────────────────────
const revealElements = document.querySelectorAll('.reveal-up');

function handleReveal() {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

// Trigger on load
setTimeout(handleReveal, 100);
window.addEventListener('scroll', handleReveal);

// ── SKILL BARS ANIMATION ─────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.classList.add('animated');
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

// ── COUNTER ANIMATION ────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      let current = 0;
      const increment = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        entry.target.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 30);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── HERO ROLES ROTATION ──────────────────────
const roles = document.querySelectorAll('.role');
let currentRole = 0;
setInterval(() => {
  roles[currentRole].classList.remove('active');
  currentRole = (currentRole + 1) % roles.length;
  roles[currentRole].classList.add('active');
}, 2500);

// ── 3D CARD TILT ─────────────────────────────
const aboutCard = document.getElementById('aboutCard');
if (aboutCard) {
  const cardInner = aboutCard.querySelector('.card-inner');
  aboutCard.addEventListener('mousemove', (e) => {
    const rect = aboutCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    cardInner.style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg)`;
  });
  aboutCard.addEventListener('mouseleave', () => {
    cardInner.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

// ── CONTACT FORM ─────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  const btnText = document.getElementById('btnText');
  const btnArrow = document.getElementById('btnArrow');

  btnText.textContent = 'Enviando...';
  btnArrow.textContent = '⏳';
  btn.disabled = true;

  setTimeout(() => {
    btnText.textContent = '¡Mensaje enviado!';
    btnArrow.textContent = '✓';
    btn.style.background = '#27c93f';

    setTimeout(() => {
      btnText.textContent = 'Enviar mensaje';
      btnArrow.textContent = '→';
      btn.disabled = false;
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  }, 1800);
}

function scrollToContact() {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// ── SMOOTH SCROLL FOR NAV LINKS ──────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── HERO TITLE STAGGER ANIMATION ─────────────
document.querySelectorAll('.line-wrap span').forEach((el, i) => {
  el.style.animation = `slideUp 0.8s cubic-bezier(0.4,0,0.2,1) ${0.1 + i * 0.12}s both`;
});

// Inject keyframe
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

// ── GLOWING ORBS ON HOVER ────────────────────
document.querySelectorAll('.tech-orb').forEach(orb => {
  orb.addEventListener('mouseenter', () => {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute;inset:0;border-radius:50%;
      background:radial-gradient(circle,rgba(99,255,180,0.3),transparent 70%);
      pointer-events:none;animation:orbGlow 0.5s ease forwards;
    `;
    orb.querySelector('.orb-inner').style.position = 'relative';
    orb.querySelector('.orb-inner').appendChild(glow);
    setTimeout(() => glow.remove(), 600);
  });
});

const orbGlowKf = document.createElement('style');
orbGlowKf.textContent = `@keyframes orbGlow{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}`;
document.head.appendChild(orbGlowKf);

console.log('%c⚡ Juan Pablo Oviedo Herrera — Portfolio', 'color:#63ffb4;font-weight:800;font-size:16px;');
console.log('%cFrontend Dev · UX/UI Designer · Graphic Designer', 'color:#7a8899;font-size:12px;');