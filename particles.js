// Particle Canvas Setup
const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.getElementById('particles-container').appendChild(canvas);
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particleCount = 100;
const particles = [];
const mouse = { x: null, y: null, radius: 150 };
const trailParticles = [];

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - dist) / mouse.radius;
                this.vx += Math.cos(angle) * force * 0.6;
                this.vy += Math.sin(angle) * force * 0.6;
            }
        }

        this.vx *= 0.95;
        this.vy *= 0.95;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 249, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Initialize Particles
for (let i = 0; i < particleCount; i++) particles.push(new Particle());

// Connect Particles
function connectParticles() {
    const maxDistance = 120;
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 249, 255, ${(1 - distance / maxDistance) * 0.5})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Connect Mouse
function connectMouse() {
    if (!mouse.x || !mouse.y) return;
    const maxDistance = 150;
    particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 0, 255, ${(1 - dist / maxDistance) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    });
}

// Trail Particles
function addTrail() {
    if (!mouse.x || !mouse.y) return;
    trailParticles.push({ x: mouse.x, y: mouse.y, size: Math.random() * 4 + 2, opacity: 0.6 });
    if (trailParticles.length > 50) trailParticles.shift();
}

function drawTrail() {
    trailParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 255, ${p.opacity})`;
        ctx.fill();
        p.opacity -= 0.02;
    });
}

// Animate
function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    connectMouse();
    addTrail();
    drawTrail();
    requestAnimationFrame(animate);
}
animate();

// Mouse Events
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Resize Event
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});
