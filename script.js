(function() {
    // ── Theme Toggle ──
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', storedTheme);
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });

    // ── Mobile Menu ──
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
    document.querySelectorAll('[data-nav-link]').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });

    // ── Current Year ──
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // ── Typing Effect ──
    const typingEl = document.getElementById('typingText');
    const phrases = [
        'Building the future, one line at a time.',
        'Clean code. Clear mind.',
        'HTML • CSS • C • Python',
        'Open to collaborations & freelance.',
        'Minimalist by design. Developer by passion.'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 70;

    function typeLoop() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 35;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 70;
        }
        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400;
        }
        setTimeout(typeLoop, typeSpeed);
    }
    typeLoop();

    // ── Scroll Reveal ──
    const reveals = document.querySelectorAll('.reveal');
    const observerOptions = { threshold: 0.18, rootMargin: '0px 0px -40px 0px' };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    reveals.forEach(el => revealObserver.observe(el));

    // ── Skill Bar Animation ──
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.getAttribute('data-width') + '%';
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => skillObserver.observe(bar));

    // ── Particle Background ──
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;
    const particleCount = 55;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                r: Math.random() * 2.2 + 0.8,
                alpha: Math.random() * 0.7 + 0.3,
            });
        }
    }
    initParticles();

    function getParticleColor() {
        return html.getAttribute('data-theme') === 'dark' ?
            'rgba(180,170,220,' : 'rgba(80,70,140,';
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const colorBase = getParticleColor();
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = colorBase + p.alpha + ')';
            ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const lineAlpha = (1 - dist / 100) * 0.25;
                    ctx.strokeStyle = colorBase + lineAlpha + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        animFrame = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar').offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ── Keyboard accessibility for buttons ──
    document.querySelectorAll('.social-btn, .btn').forEach(btn => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    console.log('%c🚀 Portfolio by Samiul Tasab Sakhawat %c| %cReady.',
        'color:#6c5ce7;font-weight:bold;', '', 'color:#00cec9;');
    console.log('%c🔒 Static-safe • GitHub Pages Compatible • Theme Toggle Active',
        'color:#a0a0b8;');
})();