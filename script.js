document.addEventListener('DOMContentLoaded', function () {
    // === Debounce Utility for Scroll Events ===
    function debounce(func, wait) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    // === Initialize Vanilla Tilt for 3D tilt effect ===
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,           // Maximum tilt angle
            speed: 400,        // Speed of the tilt effect
            glare: true,       // Enable glare effect
            "max-glare": 0.3,  // Maximum glare opacity
            scale: 1.03        // Slight zoom on hover
        });
    } else {
        console.warn('Vanilla Tilt library not loaded.');
    }

    // === Smooth Scrolling for Anchor Links ===
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.nav').offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash
                history.pushState(null, null, targetId);

                // Close mobile menu
                document.querySelector('.nav-links').classList.remove('active');
                document.querySelector('.nav').classList.remove('active');
                document.querySelector('.hamburger').classList.remove('active');
                document.querySelector('.hamburger').setAttribute('aria-expanded', 'false');
            }
        });
    });

    // === Hamburger Menu Toggle ===
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            const isActive = this.classList.toggle('active');
            document.querySelector('.nav-links').classList.toggle('active');
            document.querySelector('.nav').classList.toggle('active');
            this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    }

    // === Scroll Animation for Elements ===
    const animateOnScroll = debounce(function () {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const windowHeight = window.innerHeight;
        const triggerOffset = windowHeight / 1.2;

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            if (elementPosition < triggerOffset) {
                element.classList.add('animated');
            }
        });
    }, 100);

    // Initialize scroll animations
    const elementsToAnimate = document.querySelectorAll('.project-card, .skill-item, .timeline-item');
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Trigger animation on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // === Contact Form Submission to SheetDB ===
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitBtn = this.querySelector('button[type="submit"]');

            // Reset error messages
            document.querySelectorAll('.error-message').forEach(error => error.hidden = true);

            // Form validation
            let isValid = true;
            if (!nameInput.value.trim()) {
                document.getElementById('name-error').hidden = false;
                nameInput.focus();
                isValid = false;
            }
            if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                document.getElementById('email-error').hidden = false;
                emailInput.focus();
                isValid = false;
            }
            if (!messageInput.value.trim()) {
                document.getElementById('message-error').hidden = false;
                messageInput.focus();
                isValid = false;
            }

            if (!isValid) return;

            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            const data = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            fetch("https://sheetdb.io/api/v1/fwssaiyy0otd4", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data })
            })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(responseData => {
                    alert(`Thank you, ${data.name}! Your message has been sent.`);
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                })
                .catch(error => {
                    alert("There was an error sending your message. Please try emailing santhiarun2001@gmail.com directly.");
                    console.error("Error:", error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                });
        });
    }

    // === Update Copyright Year ===
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        const currentYear = new Date().getFullYear();
        copyright.textContent = `© ${currentYear} Arun P. All rights reserved.`;
    }

    // === Navbar Scroll Effect ===
    window.addEventListener('scroll', function () {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // === Animate Text on Load ===
    setTimeout(() => {
        document.querySelectorAll('.animate-text').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300 * index);
        });
    }, 500);

    // === Scroll to Top Button Functionality ===
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
});