// overhaul.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        if(progressBar) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    });

    // 2. Scroll to Top Behavior
    const scrollTopBtn = document.getElementById('scroll-to-top');
    if(scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Typing Effect
    const typeElement = document.querySelector('.type-effect');
    if (typeElement) {
        const words = JSON.parse(typeElement.getAttribute('data-words') || '["Amazing", "Dynamic", "Engaging"]');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typeElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = 100;
            if (isDeleting) typeSpeed /= 2;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 1500; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 500);
    }

    // 4. Counter Animation (Intersection Observer)
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target') || 0);
                const duration = 2000;
                const frameRate = 30;
                const totalFrames = Math.round((duration / 1000) * frameRate);
                let currentFrame = 0;
                
                const updateCounter = () => {
                    currentFrame++;
                    const progress = currentFrame / totalFrames;
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
                    const currentValue = Math.floor(targetValue * easeProgress);
                    
                    target.textContent = currentValue + (targetValue > 1000 ? '+' : (targetValue > 0 && targetValue % 10 === 0 ? '+' : ''));

                    if (currentFrame < totalFrames) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = targetValue + (targetValue >= 50 ? '+' : '');
                    }
                };
                requestAnimationFrame(updateCounter);
                observer.unobserve(target); // Run once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 5. Ripple Effect on Buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 6. Card Parallax Tilt Hook
    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 7. Events Filtering & Search
    const searchInput = document.getElementById('eventSearch');
    const filterPills = document.querySelectorAll('.filter-pill');
    const eventCards = document.querySelectorAll('.event-card[data-name]');

    const filterEvents = () => {
        if (!searchInput || !eventCards.length) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        const activePill = document.querySelector('.filter-pill.active');
        const activeFilter = activePill ? activePill.getAttribute('data-filter') : 'all';

        eventCards.forEach(card => {
            const name = card.getAttribute('data-name');
            const venue = card.getAttribute('data-venue');
            const isPaid = card.getAttribute('data-paid') === 'true';
            const isTeam = card.getAttribute('data-team') === 'true';

            const matchesSearch = name.includes(searchTerm) || venue.includes(searchTerm);
            let matchesFilter = true;
            
            if (activeFilter === 'free') matchesFilter = !isPaid;
            if (activeFilter === 'paid') matchesFilter = isPaid;
            if (activeFilter === 'team') matchesFilter = isTeam;

            if (matchesSearch && matchesFilter) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }
    
    if (filterPills) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                filterPills.forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                filterEvents();
            });
        });
    }

    // 8. Particle Canvas (Simple Starfield)
    const canvas = document.getElementById('particles-canvas');
    if (canvas && window.innerWidth > 768) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
        
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }
});
