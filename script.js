// =========================
// Loading Animations
// =========================
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.contact-card');
    if (card) {
        setTimeout(() => {
            card.classList.remove('loading');
        }, 100);
    }
});

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// =========================
// Click Ripple Effect
// =========================
document.querySelectorAll('.contact-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// =========================
// Musical Notes Animation
// =========================
document.querySelectorAll('.musical-note').forEach((note, index) => {
    note.style.animationDuration = `${6 + index * 0.5}s`;
    note.style.animationDelay = `${index * 0.8}s`;
});

// =========================
// Typing Effect
// =========================
const typingTexts = [
    "Violinista Clássico",
    "Artista Apaixonado",
    "Professor Dedicado",
    "Intérprete Sensível"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeWriter() {
    if (!typingElement) return;
    
    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1) + '|';
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1) + '|';
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
    }

    const speed = isDeleting ? 50 : 100;
    setTimeout(typeWriter, speed);
}

if (typingElement) {
    typeWriter();
}

// =========================
// Smooth Scroll Navigation
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        if (navLinks && hamburger) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// =========================
// Mobile Menu Toggle
// =========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// =========================
// Intersection Observer Animations
// =========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-observer').forEach(section => {
    observer.observe(section);
});

// =========================
// Back to Top Button
// =========================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    });
}

// =========================
// Contact Form (Mailto)
// =========================
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

if (form && submitBtn && successMessage) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject') || 'Contato do Site';
        const message = formData.get('message');

        // Validate form
        if (!name || !email || !message) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Disable submit button and show loading
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        try {
            // Create mailto link
            const mailtoLink = `mailto:fabricioportoviolinista@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`)}`;
            
            // Open mail client
            window.location.href = mailtoLink;

            // Show success message after a short delay
            setTimeout(() => {
                successMessage.classList.add('show');
                form.reset();

                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 3000);
            }, 500);

        } catch (error) {
            console.error('Erro ao enviar:', error);
            alert('Erro ao enviar mensagem. Por favor, envie diretamente para fabricioportoviolinista@gmail.com');
        } finally {
            // Reset submit button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
        }
    });
}

// =========================
// Parallax Effect
// =========================
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const fpNote = document.querySelector('.fp-musical-note');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    if (fpNote) {
        fpNote.style.transform = `translateY(-50%) translateX(${10 + scrolled * 0.1}px)`;
    }
}

// =========================
// Form Validation
// =========================
const inputs = document.querySelectorAll('input, textarea');

inputs.forEach(input => {
    input.addEventListener('blur', validateInput);
    input.addEventListener('input', clearValidation);
});

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Remove previous validation classes
    input.classList.remove('invalid', 'valid');

    // Check if required field is empty
    if (input.hasAttribute('required') && !value) {
        input.classList.add('invalid');
        return false;
    }

    // Validate email format
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('invalid');
            return false;
        }
    }

    // Add valid class if input has value
    if (value) {
        input.classList.add('valid');
    }

    return true;
}

function clearValidation(e) {
    e.target.classList.remove('invalid', 'valid');
}

// Add validation styles
const validationStyle = document.createElement('style');
validationStyle.textContent = `
    .form-group input.invalid,
    .form-group textarea.invalid {
        border-color: #ff4757 !important;
        box-shadow: 0 0 20px rgba(255, 71, 87, 0.3) !important;
    }
    .form-group input.valid,
    .form-group textarea.valid {
        border-color: #2ed573 !important;
        box-shadow: 0 0 20px rgba(46, 213, 115, 0.3) !important;
    }
`;
document.head.appendChild(validationStyle);

// =========================
// Performance Optimization - Throttled Scroll Handler
// =========================
function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const navbar = document.getElementById('navbar');

            // Update navbar
            if (navbar) {
                if (scrolled > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Update back to top button
            if (backToTop) {
                if (scrolled > 500) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }

            // Update parallax effect
            updateParallax();

            ticking = false;
        });
        ticking = true;
    }
}

// Add scroll event listener
window.addEventListener('scroll', updateOnScroll, { passive: true });

// =========================
// Video Placeholder Click Handlers
// =========================
document.querySelectorAll('.video-placeholder').forEach(placeholder => {
    placeholder.addEventListener('click', function() {
        const videoTitle = this.querySelector('span').textContent;
        alert(`Em breve: ${videoTitle}\n\nPor favor, entre em contato para mais informações sobre apresentações.`);
    });
});

// =========================
// Smooth reveal animations for cards
// =========================
const cardElements = document.querySelectorAll('.repertoire-card, .performance-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Initially hide cards and observe them
cardElements.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// =========================
// Initialize all animations on page load
// =========================
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for CSS animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// =========================
// Error handling for missing elements
// =========================
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && typeof callback === 'function') {
        callback(element);
    }
}

// =========================
// Accessibility improvements
// =========================
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        if (navLinks && hamburger) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .nav-links a:focus,
    .btn:focus,
    .contact-btn:focus,
    .submit-btn:focus,
    .back-to-top:focus {
        outline: 2px solid #ffd700;
        outline-offset: 2px;
    }
`;
document.head.appendChild(focusStyle);