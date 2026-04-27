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

    // Form → WhatsApp Redirect
    const scheduleForm = document.getElementById('scheduleForm');
    if(scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const dateInput = document.getElementById('preferred-date').value;

            // Format date to readable Spanish format
            const dateObj = new Date(dateInput + 'T00:00:00');
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('es-ES', options);

            // Build WhatsApp message
            const message = `¡Hola Ana! 👋\n\n` +
                `Me gustaría reservar una cita:\n\n` +
                `👤 *Nombre:* ${name}\n` +
                `📱 *Teléfono:* ${phone}\n` +
                `💫 *Servicio:* ${service}\n` +
                `📅 *Día de preferencia:* ${formattedDate}\n\n` +
                `¡Espero tu confirmación! 😊`;

            const whatsappUrl = `https://wa.me/34627011250?text=${encodeURIComponent(message)}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
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

    // Promotion Countdown Logic
    function updatePromoCountdown() {
        const now = new Date();
        // Set target to the last day of the current month
        const targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('minutes');
        const secsEl = document.getElementById('seconds');

        if(daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if(hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if(minsEl) minsEl.innerText = minutes.toString().padStart(2, '0');
        if(secsEl) secsEl.innerText = seconds.toString().padStart(2, '0');
    }

    if(document.getElementById('countdown')){
        setInterval(updatePromoCountdown, 1000);
        updatePromoCountdown();
    }
});
