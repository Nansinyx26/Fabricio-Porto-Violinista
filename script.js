// Performance optimizations
let ticking = false;
let isScrolling = false;

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// AI Assistant Knowledge Base
const aiKnowledgeBase = {
    precos: {
        question: "Quais são os preços dos serviços?",
        answer: "Os valores variam de acordo com o tipo de evento e duração. Para casamentos: R$ 300-500 (cerimônia), R$ 400-700 (cerimônia + coquetel). Para outros eventos, entre R$ 250-600. Entre em contato para um orçamento personalizado!"
    },
    repertorio: {
        question: "Qual é o repertório disponível?",
        answer: "Tenho um repertório diversificado incluindo: Clássico (Bach, Mozart, Vivaldi), Contemporâneo (Einaudi, Max Richter), Popular e Cinema (Disney, trilhas sonoras), e MPB. Posso também preparar músicas específicas mediante solicitação!"
    },
    casamento: {
        question: "Como funciona a apresentação em casamentos?",
        answer: "Posso tocar na entrada da noiva, durante a cerimônia e no coquetel. Repertório inclui Ave Maria, Canon de Pachelbel, músicas românticas personalizadas. Tenho equipamento próprio e experiência em diversos locais."
    },
    disponibilidade: {
        question: "Como verificar disponibilidade?",
        answer: "Para verificar disponibilidade para sua data, entre em contato via WhatsApp ou email. É recomendável agendar com antecedência, especialmente para sábados e datas comemorativas."
    },
    duracao: {
        question: "Qual a duração das apresentações?",
        answer: "A duração varia: Cerimônias (30-45 min), Coquetéis (1-2 horas), Eventos corporativos (1-3 horas). Posso adaptar conforme suas necessidades específicas."
    },
    equipamento: {
        question: "Precisa de equipamento especial?",
        answer: "Tenho violino acústico e elétrico. Para eventos maiores, possuo sistema de som próprio. Para locais muito grandes, pode ser necessário equipamento adicional (incluso no orçamento)."
    },
    locais: {
        question: "Atende em quais locais?",
        answer: "Atendo em toda região de Campinas, Piracicaba, São Paulo e cidades próximas. Para locais mais distantes, incluo taxa de deslocamento no orçamento."
    },
    formacao: {
        question: "Qual sua formação musical?",
        answer: "Formado em Música pela UNIMEP (2015), com experiência em orquestras sinfônicas e como professor. Toco desde os 15 anos e tenho vasta experiência em eventos."
    }
};

// =========================
// DOM Content Loaded
// =========================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeComponents();
    
    // Preload critical elements
    preloadImages();
    
    // Set up intersection observers
    setupIntersectionObservers();
    
    // Initialize AI Assistant
    initializeAIAssistant();
});

// =========================
// Initialize Components
// =========================
function initializeComponents() {
    // Initialize typing effect
    initializeTypingEffect();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize scroll handlers
    initializeScrollHandlers();
    
    // Initialize contact buttons
    initializeContactButtons();
    
    // Add loading class removal
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// =========================
// Preload Images
// =========================
function preloadImages() {
    const images = ['FP.png'];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// =========================
// Enhanced Typing Effect
// =========================
function initializeTypingEffect() {
    const typingTexts = [
        "Violinista Clássico",
        "Artista Apaixonado", 
        "Professor Dedicado",
        "Intérprete Sensível",
        "Músico Profissional"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
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
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
        }

        const speed = isDeleting ? 50 : 100;
        setTimeout(typeWriter, speed);
    }

    typeWriter();
}

// =========================
// Navigation - Enhanced
// =========================
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;

    // Toggle mobile menu
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Smooth scroll navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
}

// =========================
// AI Assistant Implementation
// =========================
function initializeAIAssistant() {
    const aiToggle = document.getElementById('aiToggle');
    const aiChat = document.getElementById('aiChat');
    const aiClose = document.getElementById('aiClose');
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');
    const aiMessages = document.getElementById('aiMessages');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const aiBadge = document.getElementById('aiBadge');
    
    let chatOpen = false;
    
    // Toggle chat
    aiToggle.addEventListener('click', () => {
        chatOpen = !chatOpen;
        aiChat.classList.toggle('active', chatOpen);
        if (chatOpen) {
            aiBadge.style.display = 'none';
            aiInput.focus();
        }
    });
    
    // Close chat
    aiClose.addEventListener('click', () => {
        chatOpen = false;
        aiChat.classList.remove('active');
    });
    
    // Send message
    function sendMessage() {
        const message = aiInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        aiInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addBotMessage(response);
        }, 800);
    }
    
    aiSend.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick questions
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            const knowledge = aiKnowledgeBase[question];
            if (knowledge) {
                addUserMessage(knowledge.question);
                setTimeout(() => {
                    addBotMessage(knowledge.answer);
                }, 500);
            }
        });
    });
    
    function addUserMessage(message) {
        const messageDiv = createMessageElement(message, 'user-message');
        aiMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function addBotMessage(message) {
        const messageDiv = createMessageElement(message, 'bot-message');
        aiMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function createMessageElement(content, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${className}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        
        return messageDiv;
    }
    
    function scrollToBottom() {
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    function generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for keywords and provide appropriate responses
        if (message.includes('preço') || message.includes('valor') || message.includes('custo')) {
            return aiKnowledgeBase.precos.answer;
        }
        
        if (message.includes('repertório') || message.includes('música') || message.includes('tocar')) {
            return aiKnowledgeBase.repertorio.answer;
        }
        
        if (message.includes('casamento') || message.includes('noiva')) {
            return aiKnowledgeBase.casamento.answer;
        }
        
        if (message.includes('disponível') || message.includes('data') || message.includes('agenda')) {
            return aiKnowledgeBase.disponibilidade.answer;
        }
        
        if (message.includes('duração') || message.includes('tempo') || message.includes('quanto tempo')) {
            return aiKnowledgeBase.duracao.answer;
        }
        
        if (message.includes('equipamento') || message.includes('som') || message.includes('amplificação')) {
            return aiKnowledgeBase.equipamento.answer;
        }
        
        if (message.includes('local') || message.includes('região') || message.includes('atende')) {
            return aiKnowledgeBase.locais.answer;
        }
        
        if (message.includes('formação') || message.includes('experiência') || message.includes('curso')) {
            return aiKnowledgeBase.formacao.answer;
        }
        
        if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || message.includes('boa tarde')) {
            return "Olá! Seja bem-vindo(a)! Sou o assistente do Fabricio Porto. Posso ajudar com informações sobre apresentações, repertório, preços e disponibilidade. Como posso ajudar você?";
        }
        
        if (message.includes('obrigad') || message.includes('valeu')) {
            return "Por nada! Foi um prazer ajudar. Se tiver mais dúvidas ou quiser agendar uma apresentação, fique à vontade para entrar em contato diretamente com o Fabricio pelo WhatsApp ou email!";
        }
        
        // Default response
        return "Entendo sua pergunta! Para informações mais específicas, recomendo entrar em contato diretamente com o Fabricio Porto via WhatsApp (19) 99901-1288 ou email fabricioportoviolinista@gmail.com. Posso ajudar com dúvidas sobre repertório, preços, disponibilidade e tipos de apresentação.";
    }
}

// =========================
// Enhanced Scroll Handlers
// =========================
function initializeScrollHandlers() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    // Throttled scroll handler
    const handleScroll = throttle(function() {
        const scrolled = window.pageYOffset;

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

        // Enhanced parallax effect
        updateParallax(scrolled);
        
    }, 16); // ~60fps

    // Back to top functionality
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });
    }

    // Add scroll event listener with passive flag for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Enhanced parallax effect
function updateParallax(scrolled) {
    const fpNote = document.querySelector('.fp-musical-note');
    
    // Only apply parallax on larger screens for performance
    if (window.innerWidth > 768 && fpNote) {
        const parallaxSpeed = 0.03;
        const yPos = scrolled * parallaxSpeed;
        fpNote.style.transform = `translateY(calc(-50% + ${yPos}px))`;
    }
}

// =========================
// Enhanced Intersection Observer
// =========================
function setupIntersectionObservers() {
    // Section observer with better performance
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Add stagger effect for child elements
                    const cards = entry.target.querySelectorAll('.repertoire-card, .performance-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    sectionObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    // Observe sections
    document.querySelectorAll('.section-observer').forEach(section => {
        sectionObserver.observe(section);
    });

    // Card observer for individual animations
    const cardObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * 150;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.filter = 'blur(0)';
                    }, delay);
                    cardObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        }
    );

    // Setup card animations
    const cardElements = document.querySelectorAll('.repertoire-card, .performance-card');
    cardElements.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.filter = 'blur(5px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        cardObserver.observe(card);
    });
}

// =========================
// Enhanced Contact Buttons
// =========================
function initializeContactButtons() {
    // Enhanced ripple effect for contact buttons
    document.querySelectorAll('.contact-btn, .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });

        // Add loading state for external links
        if (button.hasAttribute('target')) {
            button.addEventListener('click', function() {
                const originalText = this.innerHTML;
                const loadingHTML = '<i class="fas fa-spinner fa-spin"></i> Abrindo...';
                this.innerHTML = loadingHTML;
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.pointerEvents = '';
                }, 1500);
            });
        }
    });
}

// Enhanced ripple effect function
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
        animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 800);
}

// Add enhanced ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .contact-btn,
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// =========================
// Performance Monitoring
// =========================
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
}

// =========================
// Enhanced Error Handling
// =========================
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Graceful degradation - ensure basic functionality works
        if (e.error && e.error.message) {
            // Log error but don't break the site
            console.warn('Non-critical error caught, continuing...');
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault(); // Prevent the default browser behavior
    });
}

// =========================
// Enhanced Accessibility
// =========================
function enhanceAccessibility() {
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Space or Enter to activate buttons
        if (e.key === ' ' || e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('contact-btn') || 
                activeElement.classList.contains('btn') ||
                activeElement.classList.contains('ai-toggle')) {
                e.preventDefault();
                activeElement.click();
            }
        }
        
        // Escape to close AI chat
        if (e.key === 'Escape') {
            const aiChat = document.getElementById('aiChat');
            if (aiChat && aiChat.classList.contains('active')) {
                aiChat.classList.remove('active');
            }
        }
    });

    // Focus management for mobile menu
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                const firstLink = this.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });
    }
    
    // ARIA labels and announcements
    const aiToggle = document.getElementById('aiToggle');
    if (aiToggle) {
        aiToggle.setAttribute('aria-label', 'Abrir assistente virtual');
        aiToggle.setAttribute('role', 'button');
    }
}

// =========================
// Enhanced Resize Handler
// =========================
const handleResize = debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
        
        // Close AI chat on mobile to desktop transition
        const aiChat = document.getElementById('aiChat');
        if (aiChat && window.innerWidth > 1024) {
            aiChat.classList.remove('active');
        }
    }
    
    // Reset parallax transforms on mobile
    if (window.innerWidth <= 768) {
        const fpNote = document.querySelector('.fp-musical-note');
        if (fpNote) {
            fpNote.style.transform = '';
        }
    }
    
    // Adjust AI chat position
    const aiAssistant = document.getElementById('aiAssistant');
    if (aiAssistant && window.innerWidth <= 768) {
        const aiChatElement = document.getElementById('aiChat');
        if (aiChatElement) {
            aiChatElement.style.width = `calc(100vw - 2rem)`;
        }
    }
}, 250);

window.addEventListener('resize', handleResize);

// =========================
// Initialize everything when DOM is ready
// =========================
document.addEventListener('DOMContentLoaded', function() {
    setupErrorHandling();
    enhanceAccessibility();
    measurePerformance();
});

// =========================
// Enhanced Lazy loading for images
// =========================
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// =========================
// Enhanced Page Visibility API
// =========================
function handleVisibilityChange() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
        
        // Pause AI chat auto-responses
        const aiChat = document.getElementById('aiChat');
        if (aiChat) {
            aiChat.setAttribute('data-paused', 'true');
        }
    } else {
        // Resume animations when page is visible
        document.body.style.animationPlayState = 'running';
        
        // Resume AI chat
        const aiChat = document.getElementById('aiChat');
        if (aiChat) {
            aiChat.removeAttribute('data-paused');
        }
    }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

// =========================
// Service Worker Registration (optional)
// =========================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
    // registerServiceWorker(); // Uncomment if you add a service worker
});

// =========================
// Enhanced Memory Management
// =========================
window.addEventListener('beforeunload', function() {
    // Clean up any intervals or timeouts
    // Remove event listeners if needed
    document.body.style.overflow = '';
    
    // Clear AI chat if needed
    const aiMessages = document.getElementById('aiMessages');
    if (aiMessages) {
        // Clear messages to prevent memory leaks
        while (aiMessages.firstChild) {
            aiMessages.removeChild(aiMessages.firstChild);
        }
    }
});

// =========================
// Enhanced Touch Gesture Support
// =========================
function setupTouchGestures() {
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    }, { passive: true });

    function handleGesture() {
        const threshold = 50;
        const diffY = touchStartY - touchEndY;
        const diffX = touchStartX - touchEndX;

        // Swipe up to close mobile menu
        if (diffY > threshold && Math.abs(diffX) < threshold) {
            const navLinks = document.getElementById('navLinks');
            if (navLinks && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Also close AI chat
            const aiChat = document.getElementById('aiChat');
            if (aiChat && aiChat.classList.contains('active')) {
                aiChat.classList.remove('active');
            }
        }
        
        // Swipe right to open AI chat (on mobile)
        if (diffX < -threshold && Math.abs(diffY) < threshold && window.innerWidth <= 768) {
            const aiChat = document.getElementById('aiChat');
            const aiToggle = document.getElementById('aiToggle');
            if (aiChat && aiToggle && !aiChat.classList.contains('active')) {
                aiToggle.click();
            }
        }
    }
}

// =========================
// Enhanced AI Chat Features
// =========================
function enhanceAIChat() {
    // Add typing indicator
    function showTypingIndicator() {
        const aiMessages = document.getElementById('aiMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        return typingDiv;
    }
    
    // Add typing animation CSS
    const typingStyle = document.createElement('style');
    typingStyle.textContent = `
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 8px 0;
        }
        
        .typing-dots span {
            width: 6px;
            height: 6px;
            background: #ffd700;
            border-radius: 50%;
            animation: typingDots 1.5s ease-in-out infinite;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typingDots {
            0%, 60%, 100% {
                opacity: 0.3;
                transform: translateY(0);
            }
            30% {
                opacity: 1;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(typingStyle);
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setupTouchGestures();
    enhanceAIChat();
});

// =========================
// Analytics and User Behavior Tracking (Privacy-Compliant)
// =========================
function trackUserInteraction(action, element) {
    // Simple privacy-compliant analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'User Interaction',
            event_label: element
        });
    }
    
    // Or use localStorage for basic session tracking (no personal data)
    try {
        const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
        interactions.push({
            action: action,
            element: element,
            timestamp: Date.now()
        });
        
        // Keep only last 50 interactions to prevent storage bloat
        if (interactions.length > 50) {
            interactions.splice(0, interactions.length - 50);
        }
        
        localStorage.setItem('user_interactions', JSON.stringify(interactions));
    } catch (e) {
        console.warn('Could not track interaction:', e);
    }
}

// Track important interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            trackUserInteraction('navigation_click', link.textContent);
        });
    });
    
    // Track contact button clicks
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            trackUserInteraction('contact_click', btn.textContent);
        });
    });
    
    // Track AI assistant usage
    const aiToggle = document.getElementById('aiToggle');
    if (aiToggle) {
        aiToggle.addEventListener('click', () => {
            trackUserInteraction('ai_chat_open', 'assistant');
        });
    }
});

// =========================
// Enhanced Musical Notes Animation Control
// =========================
function initializeMusicalNotesControl() {
    const notes = document.querySelectorAll('.musical-note');
    
    // Add hover effects to notes
    notes.forEach(note => {
        note.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.2)';
            this.style.textShadow = '0 0 20px rgba(255, 215, 0, 1)';
        });
        
        note.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.2)', '');
            this.style.textShadow = '0 0 12px rgba(255, 215, 0, 0.6)';
        });
    });
    
    // Reduce notes on low-performance devices
    if (navigator.hardwareConcurrency <= 4 || window.innerWidth <= 480) {
        notes.forEach((note, index) => {
            if (index > 5) {
                note.style.display = 'none';
            }
        });
    }
}

// =========================
// Enhanced Logo Glow Effects
// =========================
function initializeEnhancedLogoEffects() {
    const fpLogo = document.querySelector('.fp-logo');
    const glowEffect = document.querySelector('.glow-effect');
    const pulseRing = document.querySelector('.pulse-ring');
    
    if (!fpLogo) return;
    
    // Interactive glow on hover
    fpLogo.addEventListener('mouseenter', function() {
        this.style.filter = 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.9))';
        if (glowEffect) {
            glowEffect.style.opacity = '0.8';
            glowEffect.style.transform = 'translate(-50%, -50%) scale(1.3)';
        }
        if (pulseRing) {
            pulseRing.style.animationDuration = '1.5s';
        }
    });
    
    fpLogo.addEventListener('mouseleave', function() {
        this.style.filter = 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))';
        if (glowEffect) {
            glowEffect.style.opacity = '';
            glowEffect.style.transform = '';
        }
        if (pulseRing) {
            pulseRing.style.animationDuration = '3s';
        }
    });
    
    // Click effect
    fpLogo.addEventListener('click', function() {
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // Create sparkle effect
        createSparkleEffect(this);
    });
}

// Sparkle effect for logo interaction
function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    const sparkles = 8;
    
    for (let i = 0; i < sparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #ffd700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            animation: sparkleOut${i} 1s ease-out forwards;
        `;
        
        // Create unique animation for each sparkle
        const angle = (360 / sparkles) * i;
        const distance = 50;
        const keyframes = `
            @keyframes sparkleOut${i} {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px) scale(0);
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
            style.remove();
        }, 1000);
    }
}

// =========================
// Enhanced Theme System
// =========================
function initializeThemeSystem() {
    // Detect user's system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
    }
    
    // Add high contrast mode detection
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    if (prefersHighContrast) {
        document.documentElement.classList.add('high-contrast');
    }
}

// =========================
// Progressive Web App Features
// =========================
function initializePWAFeatures() {
    // Add to home screen prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button
        showInstallButton();
    });
    
    function showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.className = 'install-btn';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            color: #000;
            border: none;
            padding: 10px 15px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            transform: translateY(100px);
            transition: all 0.3s ease;
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(installBtn);
        
        setTimeout(() => {
            installBtn.style.transform = 'translateY(0)';
        }, 1000);
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('PWA installed');
                    trackUserInteraction('pwa_install', 'accepted');
                }
                
                deferredPrompt = null;
                installBtn.remove();
            }
        });
        
        // Auto hide after 10 seconds
        setTimeout(() => {
            if (installBtn.parentNode) {
                installBtn.style.transform = 'translateY(100px)';
                setTimeout(() => installBtn.remove(), 300);
            }
        }, 10000);
    }
}

// =========================
// Advanced Error Recovery
// =========================
function initializeErrorRecovery() {
    // Network error handling
    window.addEventListener('online', function() {
        console.log('Connection restored');
        showNotification('Conexão restaurada', 'success');
    });
    
    window.addEventListener('offline', function() {
        console.log('Connection lost');
        showNotification('Sem conexão com a internet', 'warning');
    });
    
    // Show notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Set colors based on type
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(45deg, #ff9800, #f57c00)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}

// =========================
// Initialize All Enhanced Features
// =========================
document.addEventListener('DOMContentLoaded', function() {
    initializeMusicalNotesControl();
    initializeEnhancedLogoEffects();
    initializeThemeSystem();
    initializePWAFeatures();
    initializeErrorRecovery();
});

// =========================
// Cleanup and Optimization
// =========================
// Optimize animations based on device capabilities
function optimizeForDevice() {
    const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                           window.deviceMemory <= 4 || 
                           window.innerWidth <= 480;
    
    if (isLowEndDevice) {
        document.documentElement.classList.add('low-end-device');
        
        // Reduce animation complexity
        const style = document.createElement('style');
        style.textContent = `
            .low-end-device .musical-note:nth-child(n+7) {
                display: none;
            }
            .low-end-device .glow-effect,
            .low-end-device .pulse-ring {
                display: none;
            }
            .low-end-device * {
                animation-duration: 0.3s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Call optimization on load
window.addEventListener('load', optimizeForDevice);

console.log('🎻 Fabricio Porto Website Enhanced - Loaded Successfully!');
