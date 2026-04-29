document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if(hamburger){
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Testimonial Carousel Logic
    const track = document.getElementById('slider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;
    const totalItems = document.querySelectorAll('.carousel-item').length;

    function updateCarousel() {
        if(track){
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    if(nextBtn && prevBtn){
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Touch Swipe Logic for Carousel
    let touchStartX = 0;
    let touchEndX = 0;

    if(track) {
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }
        if (touchEndX > touchStartX + 50) {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }
    }

    // Set minimum date for the date picker to today
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Card "Elegir" buttons → scroll to form + pre-select service
    document.querySelectorAll('.btn-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const service = btn.getAttribute('data-service');
            const serviceSelect = document.getElementById('service');
            const contactSection = document.getElementById('contato');

            if (serviceSelect && service) {
                serviceSelect.value = service;
                // Highlight the select briefly
                serviceSelect.style.borderBottomColor = 'var(--color-accent-rose)';
                setTimeout(() => {
                    serviceSelect.style.borderBottomColor = '';
                }, 1500);
            }

            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Form → WhatsApp Redirect
    const scheduleForm = document.getElementById('scheduleForm');
    if(scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const preferredDate = document.getElementById('preferred-date').value;
            const submitBtn = document.getElementById('submitBtn');

            // Loading state
            if (submitBtn) {
                submitBtn.textContent = 'Abriendo WhatsApp...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.8';
            }

            // Format date to readable Spanish format
            const dateObj = new Date(preferredDate + 'T00:00:00');
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('es-ES', options);

            const message =
                `¡Hola Ana! 👋 Me gustaría reservar una cita a domicilio para extensiones de pestañas.\n\n` +
                `📋 Mis datos:\n` +
                `✨ Nombre: ${name}\n` +
                `✨ Teléfono: ${phone}\n` +
                `✨ Servicio: ${service}\n` +
                `✨ Día preferido: ${formattedDate}\n\n` +
                `¿Podrías confirmarme el horario disponible? ¡Muchas gracias! 🌸`;

            const whatsappUrl = `https://wa.me/34627011250?text=${encodeURIComponent(message)}`;

            // Short delay so user sees feedback, then open WhatsApp
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                // Reset button after redirect
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.textContent = 'Confirmar Cita por WhatsApp →';
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '';
                    }
                }, 2000);
            }, 400);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal on Scroll Animation
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Countdown Timer for Promotional Banner
    function updateCountdownTimer() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Set end date to the last day of current month at 23:59:59
        let endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
        
        function updateTimer() {
            const currentTime = new Date().getTime();
            const endTime = endDate.getTime();
            const difference = endTime - currentTime;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');

                if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
                if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
                if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
                if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
            }
        }

        // Initial update
        updateTimer();
        
        // Update every second
        setInterval(updateTimer, 1000);
    }

    updateCountdownTimer();

    // Mobile FAB Scroll Logic
    const mobileFab = document.getElementById('mobileFab');
    if (mobileFab) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                mobileFab.classList.add('visible');
            } else {
                mobileFab.classList.remove('visible');
            }
        });
    }
});
