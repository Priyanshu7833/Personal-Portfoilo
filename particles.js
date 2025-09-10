// Particle Canvas Setup (toned-down)
const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.getElementById('particles-container').appendChild(canvas);
canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';

const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particleCount = 60;
const particles = [];
const mouse = { x: null, y: null, radius: 110 };
const trailParticles = [];

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.6;
        this.opacity = Math.random() * 0.45 + 0.12;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const angle = Math.atan2(dy, dx), force = (mouse.radius - dist) / mouse.radius;
                this.vx += Math.cos(angle) * force * 0.25;
                this.vy += Math.sin(angle) * force * 0.25;
            }
        }
        this.vx *= 0.98; this.vy *= 0.98;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,169,169,${this.opacity * 0.5})`;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function connectParticles() {
    const max = 90;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < max) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(56,169,169,${(1 - d / max) * 0.12})`;
                ctx.lineWidth = 0.7;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function connectMouse() {
    if (!mouse.x || !mouse.y) return;
    const max = 120;
    particles.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < max) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(194,143,194,${(1 - d / max) * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
    });
}

function addTrail() {
    if (!mouse.x || !mouse.y) return;
    trailParticles.push({ x: mouse.x, y: mouse.y, size: Math.random() * 3 + 1, opacity: 0.36 });
    if (trailParticles.length > 38) trailParticles.shift();
}

function drawTrail() {
    trailParticles.forEach(t => { ctx.beginPath(); ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(194,143,194,${t.opacity})`; ctx.fill(); t.opacity -= 0.03; });
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles(); connectMouse(); addTrail(); drawTrail();
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });
