/* script.js - portfolio functionality */
document.addEventListener('DOMContentLoaded', function () {
    /* -------------------- helpers -------------------- */
    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));

    /* -------------------- header height & scroll-padding -------------------- */
    const header = $('.site-header');
    function updateHeaderHeight() {
        if (!header) return;
        const h = header.offsetHeight || 72;
        document.documentElement.style.setProperty('--header-height', h + 'px');
    }
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    /* -------------------- theme toggle -------------------- */
    const themeToggle = $('#theme-toggle');
    const body = document.body;
    const setThemeIcon = () => {
        if (!themeToggle) return;
        themeToggle.textContent = body.classList.contains('light-theme') ? '☀️' : '🌙';
    };
    const saved = localStorage.getItem('theme');
    if (saved === 'light') body.classList.add('light-theme');
    setThemeIcon();
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
            setThemeIcon();
        });
    }

    /* -------------------- scroll progress -------------------- */
    const progressBar = $('#progress-bar');
    function updateProgress() {
        if (!progressBar) return;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    /* -------------------- nav highlight using IntersectionObserver -------------------- */
    const sections = $$('main section[id]');
    const navLinks = $$('.nav-links a');
    if (sections.length && navLinks.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
                }
            });
        }, { threshold: 0.45 });
        sections.forEach(s => navObserver.observe(s));
    }

    // Fix initial nav highlight and scroll
    window.addEventListener('load', () => {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - header.offsetHeight + 1,
                    behavior: 'auto'
                });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${section.id}`));
            }
        });
    });

    /* -------------------- reveal + stagger -------------------- */
    const reveals = $$('.reveal');
    if (reveals.length) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const parent = el.closest('.stagger');
                if (parent) {
                    const items = Array.from(parent.querySelectorAll('.reveal'));
                    items.forEach((it, i) => {
                        if (it.classList.contains('active')) return;
                        it.style.transitionDelay = `${i * 0.09}s`;
                    });
                } else el.style.transitionDelay = '0s';
                el.classList.add('active');
                obs.unobserve(el);
            });
        }, { threshold: 0.18 });
        reveals.forEach(r => revealObserver.observe(r));
    }

    /* -------------------- certifications carousel -------------------- */
    const track = document.querySelector('#cert-carousel .cert-track');
    if (track) {
        let offset = 0;
        const gap = 12;
        let cardWidth = track.children[0] ? track.children[0].offsetWidth : 220;

        function updateCardWidth() { cardWidth = track.children[0] ? track.children[0].offsetWidth : 220; }
        window.addEventListener('resize', updateCardWidth);

        function slideCerts() {
            const maxOffset = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
            offset += (cardWidth + gap);
            if (offset > maxOffset) offset = 0;
            track.style.transform = `translateX(${-offset}px)`;
        }
        setTimeout(() => { updateCardWidth(); setInterval(slideCerts, 3000); }, 400);
    }

    /* -------------------- tilt effect for project-cards -------------------- */
    const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!supportsTouch) {
        $$('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                const rx = (y - 0.5) * 6;
                const ry = (x - 0.5) * -8;
                card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
                card.style.transition = 'transform 0.08s linear';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform .22s ease';
            });
        });
    }

    /* -------------------- typing effect -------------------- */
    (function typing() {
        const typed = $('#typed');
        if (!typed) return;
        const phrases = ['Aspiring Software Engineer', 'C++ • Java • Web Developer', 'Open to internships & projects'];
        let p = 0, ch = 0, deleting = false;
        function tick() {
            const full = phrases[p];
            if (!deleting) {
                typed.textContent = full.slice(0, ch + 1);
                ch++;
                if (ch >= full.length) { deleting = true; setTimeout(tick, 1000); return; }
            } else {
                typed.textContent = full.slice(0, ch - 1);
                ch--;
                if (ch <= 0) { deleting = false; p = (p + 1) % phrases.length; }
            }
            setTimeout(tick, deleting ? 40 : 80);
        }
        tick();
    })();

    /* -------------------- contact form submit -------------------- */
    const form = $('#contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                const prev = btn.textContent;
                btn.textContent = 'Sending...';
                setTimeout(() => { btn.disabled = false; btn.textContent = prev; }, 1500);
            }
        });
    }

});
