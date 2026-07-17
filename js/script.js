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
            if (navbar) {
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Scroll progress bar
            const scrollProgress = document.getElementById('scroll-progress');
            if (scrollProgress) {
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
                scrollProgress.style.width = `${progress}%`;
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
    button.addEventListener('click', (e) => {
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

            // Create Floating Success Bubble
            const bubble = document.createElement('span');
            bubble.className = 'copy-success-bubble';
            bubble.innerText = 'Copied!';
            document.body.appendChild(bubble);

            const rect = button.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            bubble.style.left = `${rect.left + rect.width / 2 + scrollLeft}px`;
            bubble.style.top = `${rect.top + scrollTop - 10}px`;

            setTimeout(() => {
                bubble.remove();
            }, 800);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
});

// ===== Project Filtering Logic =====
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const tags = card.getAttribute('data-tags') || '';
            // Handle display & transition classes
            if (filterValue === 'all' || tags.split(' ').includes(filterValue)) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    });
});

// ===== Project Detail Modal =====
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTech = document.getElementById('modal-tech');
const modalAchievements = document.getElementById('modal-achievements');
const modalClose = document.getElementById('modal-close');

projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't open modal if a child link/pill was clicked
        if (e.target.closest('.pill') || e.target.closest('a')) {
            return;
        }

        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-description');
        const details = card.getAttribute('data-details');
        const techList = card.getAttribute('data-tech') ? card.getAttribute('data-tech').split(',') : [];

        // Set title and description
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;

        // Set achievements
        if (modalAchievements) {
            modalAchievements.innerHTML = details || '';
        }

        // Set tech pills
        if (modalTech) {
            modalTech.innerHTML = '';
            techList.forEach(tech => {
                const pill = document.createElement('span');
                pill.className = 'pill pill-small';
                pill.textContent = tech.trim();
                modalTech.appendChild(pill);
            });
        }

        // Open modal
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        }
    });
});

// Close modal function
function closeModal() {
    if (modal) {
        modal.classList.remove('open');
        // Restore background scroll only if mobile menu is not open
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileMenu || !mobileMenu.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    }
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        // Close modal if clicking outside of the modal container
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===== Skill-to-Project Interactive Highlights =====
const skillPills = document.querySelectorAll('.skills-card .pill');

skillPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
        const text = pill.textContent.toLowerCase();
        let targetTag = '';

        if (text.includes('c#') || text.includes('.net') || text.includes('vb')) {
            targetTag = 'dotnet';
        } else if (text.includes('angular') || text.includes('javascript') || text.includes('html') || text.includes('jquery') || text.includes('bootstrap')) {
            targetTag = 'frontend';
        } else if (text.includes('cordova')) {
            targetTag = 'mobile';
        } else if (text.includes('sql') || text.includes('mysql') || text.includes('sybase')) {
            targetTag = 'database';
        }

        if (targetTag) {
            pill.classList.add('highlight-pill');
            projectCards.forEach(card => {
                const tags = card.getAttribute('data-tags') || '';
                if (tags.split(' ').includes(targetTag)) {
                    card.classList.add('highlight-card');
                } else {
                    card.classList.add('fade-card');
                }
            });
        }
    });

    pill.addEventListener('mouseleave', () => {
        pill.classList.remove('highlight-pill');
        projectCards.forEach(card => {
            card.classList.remove('highlight-card', 'fade-card');
        });
    });
});

// ===== Mobile Carousel Scrollspy Indicators =====
const projectsGrid = document.querySelector('.projects-grid');
const indicatorDots = document.querySelectorAll('.indicator-dot');

if (projectsGrid && indicatorDots.length > 0) {
    projectsGrid.addEventListener('scroll', () => {
        const scrollLeft = projectsGrid.scrollLeft;
        const firstCard = projectsGrid.querySelector('.project-card');
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth + 16; // card width + gap
            const activeIndex = Math.round(scrollLeft / cardWidth);
            
            indicatorDots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });

    // Tap on dots to scroll to that project card
    indicatorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            const firstCard = projectsGrid.querySelector('.project-card');
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 16;
                projectsGrid.scrollTo({
                    left: slideIndex * cardWidth,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Mobile FAB & Bottom Sheet =====
const mobileFab = document.getElementById('mobile-fab');
const bottomSheet = document.getElementById('bottom-sheet');
const sheetOverlay = document.getElementById('sheet-overlay');
const sheetItems = document.querySelectorAll('.sheet-item');

function openBottomSheet() {
    if (bottomSheet) {
        bottomSheet.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock screen scroll
    }
}

function closeBottomSheet() {
    if (bottomSheet) {
        bottomSheet.classList.remove('open');
        // Keep body scroll locked only if modal or mobile menu is open
        const modalEl = document.getElementById('project-modal');
        const mobileMenu = document.querySelector('.mobile-menu');
        const modalOpen = modalEl && modalEl.classList.contains('open');
        const menuOpen = mobileMenu && mobileMenu.classList.contains('open');
        if (!modalOpen && !menuOpen) {
            document.body.style.overflow = '';
        }
    }
}

if (mobileFab) {
    mobileFab.addEventListener('click', openBottomSheet);
}

if (sheetOverlay) {
    sheetOverlay.addEventListener('click', closeBottomSheet);
}

sheetItems.forEach(item => {
    item.addEventListener('click', closeBottomSheet);
});

// ===== Skills Tab Switcher =====
const skillTabs = document.querySelectorAll('.skills-tab-btn');
const skillContents = document.querySelectorAll('.skills-tab-content');

skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Toggle active button
        skillTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Toggle visible content
        skillContents.forEach(content => {
            if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    });
});

