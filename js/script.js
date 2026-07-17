// Mobile Menu Functionality
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Performant Scroll Handling (Combined Scrollspy + Navbar Toggle + Back to Top)
const navbar = document.querySelector('.navbar');
const backToTopBtn = document.getElementById('back-to-top');
const sections = document.querySelectorAll('section');
const navLinksList = document.querySelectorAll('.nav-links .nav-link');

let sectionPositions = [];
let isScrolling = false;

// Pre-calculate heights & positions to avoid reading layout properties during scroll ticks
function calculatePositions() {
    sectionPositions = Array.from(sections).map(section => {
        const id = section.getAttribute('id');
        const top = section.offsetTop - 150; // offset for nav heights
        const bottom = top + section.offsetHeight;
        return { id, top, bottom };
    });
}

// Throttle scroll events with requestAnimationFrame
function onScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            // 1. Toggle scrolled navbar
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // 2. Toggle back-to-top button visibility
            if (backToTopBtn) {
                if (scrollY > 400) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            }

            // 3. High-performance Scroll Spy
            let currentSectionId = '';
            for (let i = 0; i < sectionPositions.length; i++) {
                const pos = sectionPositions[i];
                if (scrollY >= pos.top && scrollY < pos.bottom) {
                    currentSectionId = pos.id;
                    break;
                }
            }

            navLinksList.forEach(link => {
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            isScrolling = false;
        });
        isScrolling = true;
    }
}

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', () => {
    calculatePositions();
    onScroll();
});
window.addEventListener('load', () => {
    calculatePositions();
    onScroll();
});

// Run calculation initially
calculatePositions();
onScroll();

// Scroll Reveal Animation (Intersection Observer)
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => {
    observer.observe(el);
});

// Initial trigger for elements already in viewport
setTimeout(() => {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
}, 100);

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Offset for navbar
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// INTERACTIVE FEATURES & CONTACT FORM
// ==========================================

// 1. Typed.js Initialization (Hero Section)
if (document.querySelector('.typed-text')) {
    new Typed('.typed-text', {
        strings: ['.NET Core & C#.', 'ASP.NET MVC.', 'Angular & Web APIs.', 'Cordova Mobile Apps.'],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1500,
        loop: true
    });
}

// 2. Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// 4. Working Contact Form (Mailto integration)
const submitBtn = document.querySelector('.btn-submit');
if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const nameInput    = document.getElementById('name');
        const emailInput   = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const formMessage  = document.getElementById('form-message');

        const name    = nameInput.value.trim();
        const email   = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Helper: show error
        function showError(msg) {
            if (formMessage) {
                formMessage.innerText = msg;
                formMessage.style.display = 'block';
                formMessage.style.color = '#ff6b6b';
            }
        }

        // Helper: show success
        function showSuccess(msg) {
            if (formMessage) {
                formMessage.innerText = msg;
                formMessage.style.display = 'block';
                formMessage.style.color = '#4ade80';
            }
        }

        // --- Validation Rules ---

        // 1. Empty check
        if (!name || !email || !message) {
            showError('Please fill out all fields before sending.');
            return;
        }

        // 2. Name: letters, spaces, hyphens and apostrophes only (no numbers or symbols)
        const nameRegex = /^[A-Za-z\s'\-]+$/;
        if (!nameRegex.test(name)) {
            showError('Name should only contain letters (no numbers or special characters).');
            nameInput.focus();
            return;
        }

        // 3. Email: standard valid email format
        //    Must have characters before @, a domain, and a valid TLD (2–6 letters)
        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address (e.g. name@example.com).');
            emailInput.focus();
            return;
        }

        // All good — hide error
        if (formMessage) formMessage.style.display = 'none';

        // Format the email content
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

        // Open user's default email client pre-filled
        window.location.href = `mailto:nikhitha.mitukula@gmail.com?subject=${subject}&body=${body}`;

        // Clear the form and show success
        nameInput.value    = '';
        emailInput.value   = '';
        messageInput.value = '';
        showSuccess('✓ Opening your email client...');

        // Hide success after 4 seconds
        setTimeout(() => {
            if (formMessage) formMessage.style.display = 'none';
        }, 4000);
    });
}

// 5. Back to Top Button Click Event
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 7. Copy to Clipboard Feature
const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const textToCopy = button.getAttribute('data-copy');
        const tooltip = button.querySelector('.tooltip');
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            if (tooltip) {
                tooltip.innerText = 'Copied!';
                
                // Reset tooltip text after 2 seconds
                setTimeout(() => {
                    tooltip.innerText = 'Copy';
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
});

