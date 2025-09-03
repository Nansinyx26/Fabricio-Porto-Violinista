// =========================
// CORE JAVASCRIPT OTIMIZADO - FABRICIO PORTO WEBSITE
// =========================

// Configurações críticas
const CONFIG = {
    SCROLL_THROTTLE: 16,
    DEBOUNCE_DELAY: 250,
    TYPING_SPEED: { TYPING: 80, DELETING: 40, PAUSE: 1500 },
    MOBILE_BREAKPOINT: 768,
    ANIMATION_DELAYS: { CARD_STAGGER: 100, SECTION_DELAY: 50 }
};

// Variáveis globais otimizadas
let ticking = false, isScrolling = false, isMobile = false, isLowEndDevice = false, typingTimeout = null;

// =========================
// DETECÇÃO DE DISPOSITIVO OTIMIZADA
// =========================
function detectDevice() {
    isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    isLowEndDevice = navigator.hardwareConcurrency <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 4) || window.innerWidth <= 480;
    document.documentElement.style.setProperty('--is-mobile', isMobile ? '1' : '0');
    if (isLowEndDevice) document.documentElement.classList.add('low-end-device');
}

// =========================
// UTILITY FUNCTIONS OTIMIZADAS
// =========================
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments, context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// =========================
// INICIALIZAÇÃO CRÍTICA
// =========================
document.addEventListener('DOMContentLoaded', function() {
    try {
        detectDevice();
        hideLoadingIndicator();
        initializeCriticalComponents();
        setupCriticalObservers();
        setupCriticalEvents();
        console.log('✅ Core inicializado');
    } catch (error) {
        console.error('Erro na inicialização:', error);
        hideLoadingIndicator();
    }
});

// =========================
// LOADING OTIMIZADO
// =========================
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
        setTimeout(() => {
            if (loadingIndicator.parentNode) loadingIndicator.remove();
        }, 300);
    }
    document.body.classList.add('loaded');
}

// =========================
// COMPONENTES CRÍTICOS
// =========================
function initializeCriticalComponents() {
    initializeTypingEffect();
    initializeNavigation();
    initializeScrollHandlers();
}

// Efeito de digitação otimizado
function initializeTypingEffect() {
    const typingTexts = ["Violinista ", "Artista Apaixonado", "Professor Dedicado", "Músico Profissional"];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    const typingElement = document.getElementById('typingText');
    
    if (!typingElement) return;
    
    function typeWriter() {
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1) + '|';
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1) + '|';
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typingTimeout = setTimeout(() => isDeleting = true, CONFIG.TYPING_SPEED.PAUSE);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
        }
        
        const speed = isDeleting ? CONFIG.TYPING_SPEED.DELETING : CONFIG.TYPING_SPEED.TYPING;
        typingTimeout = setTimeout(typeWriter, speed);
    }
    
    typeWriter();
}

// Navegação otimizada
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Navegação suave otimizada
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
            closeMobileMenu();
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (hamburger && navLinks && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;
    
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// =========================
// SCROLL HANDLERS OTIMIZADOS
// =========================
function initializeScrollHandlers() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    const handleScroll = throttle(function() {
        const scrolled = window.pageYOffset;
        
        if (navbar) navbar.classList.toggle('scrolled', scrolled > 100);
        if (backToTop) backToTop.classList.toggle('visible', scrolled > 500);
        
        if (!isMobile && window.innerWidth > CONFIG.MOBILE_BREAKPOINT) {
            updateParallax(scrolled);
        }
    }, CONFIG.SCROLL_THROTTLE);
    
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

function updateParallax(scrolled) {
    const fpNote = document.querySelector('.fp-musical-note');
    if (fpNote) {
        const parallaxSpeed = 0.02;
        const yPos = scrolled * parallaxSpeed;
        requestAnimationFrame(() => {
            fpNote.style.transform = `translateY(calc(-50% + ${yPos}px))`;
        });
    }
}

// =========================
// INTERSECTION OBSERVERS CRÍTICOS
// =========================
function setupCriticalObservers() {
    if (!window.IntersectionObserver) {
        document.querySelectorAll('.section-observer').forEach(section => {
            section.classList.add('visible');
        });
        return;
    }
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const cards = entry.target.querySelectorAll('.repertoire-card, .performance-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * CONFIG.ANIMATION_DELAYS.CARD_STAGGER);
                });
                
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.section-observer').forEach(section => {
        sectionObserver.observe(section);
    });
    
    setupCardAnimations();
}

function setupCardAnimations() {
    const cardElements = document.querySelectorAll('.repertoire-card, .performance-card');
    cardElements.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });
}

// =========================
// EVENTOS CRÍTICOS
// =========================
function setupCriticalEvents() {
    // Resize handler otimizado
    const handleResize = debounce(function() {
        const wasMobile = isMobile;
        detectDevice();
        
        if (wasMobile && !isMobile) {
            closeMobileMenu();
        }
        
        reconfigureForDevice();
    }, CONFIG.DEBOUNCE_DELAY);
    
    window.addEventListener('resize', handleResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Visibility API para otimização
    document.addEventListener('visibilitychange', function() {
        const isHidden = document.hidden;
        document.querySelectorAll('.musical-note, .pulse-ring').forEach(element => {
            element.style.animationPlayState = isHidden ? 'paused' : 'running';
        });
    });
}

function reconfigureForDevice() {
    const notes = document.querySelectorAll('.musical-note');
    notes.forEach((note, index) => {
        if (isMobile) {
            note.style.animationDuration = '25s';
            note.style.opacity = '0.4';
            if (isLowEndDevice && index > 3) note.style.display = 'none';
        } else {
            note.style.animationDuration = '15s';
            note.style.opacity = '0.6';
            note.style.display = '';
        }
    });
}

// =========================
// CLEANUP CRÍTICO
// =========================
window.addEventListener('beforeunload', function() {
    if (typingTimeout) clearTimeout(typingTimeout);
    document.body.style.overflow = '';
});

// =========================
// FALLBACKS E POLYFILLS
// =========================
function setupFallbacks() {
    if (typeof CSS === 'undefined' || !CSS.supports) {
        window.CSS = { supports: function() { return false; } };
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 16);
        };
    }
}

// =========================
// INICIALIZAÇÃO FINAL
// =========================
(function() {
    setupFallbacks();
    setTimeout(hideLoadingIndicator, 100);
    console.log('🎻 Fabricio Porto Website - Core carregado!');
})();

// =========================
// LAZY LOADING DE IMAGENS OTIMIZADO
// =========================
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores antigos
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Inicializar lazy loading após DOM carregar
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// =========================
// RIPPLE EFFECT OTIMIZADO
// =========================
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => {
        if (ripple.parentNode) ripple.remove();
    }, 600);
}

// Aplicar ripple effect a botões
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.contact-btn, .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });
});

// =========================
// PERFORMANCE MONITORING
// =========================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugPerformance = function() {
        console.log('=== DEBUG PERFORMANCE ===');
        console.log('Is Mobile:', isMobile);
        console.log('Is Low-end Device:', isLowEndDevice);
        console.log('Viewport:', window.innerWidth + 'x' + window.innerHeight);
        console.log('Connection:', navigator.connection ? navigator.connection.effectiveType : 'Unknown');
        console.log('Memory:', navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'Unknown');
        console.log('Cores:', navigator.hardwareConcurrency || 'Unknown');
        console.log('========================');
    };
}

// CSS Animation with JS Control
const keyframes = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;
const style = document.createElement('style');
style.textContent = keyframes;
document.head.appendChild(style);
