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
    
    // Initialize AI Assistant
    initializeAIAssistant();
    
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
// AI Assistant - Código Completo
// =========================
function initializeAIAssistant() {
    const aiToggle = document.getElementById('aiToggle');
    const aiChat = document.getElementById('aiChat');
    const aiClose = document.getElementById('aiClose');
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');
    const aiMessages = document.getElementById('aiMessages');
    const aiBadge = document.getElementById('aiBadge');
    const quickBtns = document.querySelectorAll('.quick-btn');

    // Respostas do assistente
    const aiResponses = {
        precos: "Os preços variam conforme o tipo de evento e duração. Para casamentos: R$ 800-1200, Festas de debutante: R$ 600-900, Aniversários: R$ 400-700. Entre em contato para um orçamento personalizado!",
        repertorio: "Meu repertório inclui música clássica (Bach, Mozart, Vivaldi), contemporânea (Einaudi, Max Richter), popular brasileira e trilhas sonoras. Posso personalizar a seleção musical para seu evento especial!",
        casamento: "Para casamentos, toco na cerimônia religiosa, civil ou entrada dos noivos. Repertório inclui Canon de Pachelbel, Ave Maria, e músicas especiais do casal. Atendo toda região de Americana/SP e arredores.",
        disponibilidade: "Para verificar disponibilidade, preciso saber a data, horário e local do evento. Atendo finais de semana e alguns dias úteis. Entre em contato via WhatsApp para confirmar sua data!",
        default: "Olá! Posso ajudar com informações sobre apresentações, repertório, preços e disponibilidade. Fabricio Porto é violinista profissional há mais de 10 anos, atendendo eventos em toda região. Como posso ajudar você?"
    };

    let chatOpen = false;
    let messageCount = 1;

    // Toggle chat
    aiToggle.addEventListener('click', function() {
        chatOpen = !chatOpen;
        if (chatOpen) {
            aiChat.classList.add('active');
            aiBadge.style.display = 'none';
            aiInput.focus();
        } else {
            aiChat.classList.remove('active');
        }
    });

    // Close chat
    aiClose.addEventListener('click', function() {
        aiChat.classList.remove('active');
        chatOpen = false;
    });

    // Quick buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            const questionText = this.textContent;
            
            // Add user message
            addMessage(questionText, 'user');
            
            // Add bot response
            setTimeout(() => {
                const response = aiResponses[question] || aiResponses.default;
                addMessage(response, 'bot');
            }, 500);
        });
    });

    // Send message
    function sendMessage() {
        const message = aiInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        aiInput.value = '';
        
        // Generate bot response
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, 800);
    }

    // Send button click
    aiSend.addEventListener('click', sendMessage);

    // Enter key to send
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}-message`;
        
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${timeStr}</div>
        `;
        
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        // Update message count
        if (sender === 'bot') {
            messageCount++;
            if (!chatOpen) {
                aiBadge.textContent = messageCount;
                aiBadge.style.display = 'flex';
            }
        }
    }

    // Generate response based on user input
    function generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo')) {
            return aiResponses.precos;
        }
        
        if (lowerMessage.includes('música') || lowerMessage.includes('repertório') || lowerMessage.includes('tocar')) {
            return aiResponses.repertorio;
        }
        
        if (lowerMessage.includes('casamento') || lowerMessage.includes('cerimônia') || lowerMessage.includes('noivo')) {
            return aiResponses.casamento;
        }
        
        if (lowerMessage.includes('disponível') || lowerMessage.includes('data') || lowerMessage.includes('quando')) {
            return aiResponses.disponibilidade;
        }
        
        if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia')) {
            return "Olá! Bem-vindo! Sou o assistente do Fabricio Porto. Estou aqui para ajudar com informações sobre apresentações musicais. O que gostaria de saber?";
        }
        
        if (lowerMessage.includes('obrigado') || lowerMessage.includes('obrigada')) {
            return "De nada! Fico feliz em ajudar. Se tiver mais dúvidas sobre os serviços do Fabricio Porto, é só perguntar!";
        }
        
        return aiResponses.default;
    }

    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (!aiToggle.contains(e.target) && !aiChat.contains(e.target) && chatOpen) {
            aiChat.classList.remove('active');
            chatOpen = false;
        }
    });

    // Welcome message after 3 seconds if chat not opened
    setTimeout(() => {
        if (!chatOpen) {
            messageCount++;
            aiBadge.textContent = messageCount;
            aiBadge.style.display = 'flex';
            
            // Add welcome message
            addMessage("👋 Olá! Precisa de informações sobre apresentações musicais? Clique aqui para conversar!", 'bot');
        }
    }, 3000);
}

// =========================
// Typing Effect - Optimized
// =========================
function initializeTypingEffect() {
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
            setTimeout(() => isDeleting = true, 1500);
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
// Navigation - Optimized
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
// Scroll Handlers - Optimized
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

        // Simplified parallax effect
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

// Simplified parallax effect
function updateParallax(scrolled) {
    const fpNote = document.querySelector('.fp-musical-note');
    
    // Only apply parallax on larger screens for performance
    if (window.innerWidth > 768 && fpNote) {
        const parallaxSpeed = 0.05;
        const yPos = scrolled * parallaxSpeed;
        fpNote.style.transform = `translateY(calc(-50% + ${yPos}px))`;
    }
}

// =========================
// Intersection Observer - Optimized
// =========================
function setupIntersectionObservers() {
    // Section observer with better performance
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve once visible for performance
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

    // Card observer for staggered animations
    const cardObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * 100;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
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
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
}

// =========================
// Contact Buttons - Optimized
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
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.pointerEvents = '';
                }, 1000);
            });
        }
    });
}

// Ripple effect function
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
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Add ripple animation CSS
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
// Error Handling
// =========================
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Graceful degradation - ensure basic functionality works
        if (e.error && e.error.message) {
            // Log error but don't break the site
        }
    });
}

// =========================
// Accessibility Enhancements
// =========================
function enhanceAccessibility() {
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Space or Enter to activate buttons
        if (e.key === ' ' || e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('contact-btn') || 
                activeElement.classList.contains('btn')) {
                e.preventDefault();
                activeElement.click();
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
}

// =========================
// Resize Handler - Optimized
// =========================
const handleResize = debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Reset parallax transforms on mobile
    if (window.innerWidth <= 768) {
        const fpNote = document.querySelector('.fp-musical-note');
        if (fpNote) {
            fpNote.style.transform = '';
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
// Lazy loading for images
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
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// =========================
// Page Visibility API for performance
// =========================
function handleVisibilityChange() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page is visible
        document.body.style.animationPlayState = 'running';
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
// Memory Management
// =========================
window.addEventListener('beforeunload', function() {
    // Clean up any intervals or timeouts
    // Remove event listeners if needed
    document.body.style.overflow = '';
});

// =========================
// Touch Gesture Support
// =========================
function setupTouchGestures() {
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
    }, { passive: true });

    function handleGesture() {
        const threshold = 50;
        const diff = touchStartY - touchEndY;

        // Swipe up to close mobile menu
        if (diff > threshold) {
            const navLinks = document.getElementById('navLinks');
            if (navLinks && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    }
}

setupTouchGestures();

// =========================
// Enhanced AI Assistant Features
// =========================
function initializeAdvancedAIFeatures() {
    const aiMessages = document.getElementById('aiMessages');
    
    // Auto-scroll to bottom when new message arrives
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                aiMessages.scrollTop = aiMessages.scrollHeight;
            }
        });
    });
    
    if (aiMessages) {
        observer.observe(aiMessages, { childList: true });
    }
    
    // Typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        // Add typing animation CSS
        const typingStyle = document.createElement('style');
        typingStyle.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 8px 0;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #d4af37;
                animation: typing 1.4s infinite;
            }
            
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typing {
                0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
                30% { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(typingStyle);
        
        return typingDiv;
    }
    
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Enhanced message sending with typing indicator
    window.sendMessageWithTyping = function(message) {
        const typingIndicator = showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            // Add actual bot response logic here
        }, 1000);
    };
}

// =========================
// Smooth Animations
// =========================
function initializeSmoothAnimations() {
    // Add smooth hover effects
    const cards = document.querySelectorAll('.repertoire-card, .performance-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add smooth transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .btn, .contact-btn, .quick-btn');
    
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
}

// =========================
// Initialize All Advanced Features
// =========================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced features after main initialization
    setTimeout(() => {
        initializeAdvancedAIFeatures();
        initializeSmoothAnimations();
    }, 500);
});

// =========================
// Browser Compatibility Checks
// =========================
function checkBrowserCompatibility() {
    // Check for required features
    const requiredFeatures = [
        'IntersectionObserver',
        'fetch',
        'Promise'
    ];
    
    const unsupportedFeatures = requiredFeatures.filter(feature => !(feature in window));
    
    if (unsupportedFeatures.length > 0) {
        console.warn('Some features may not work in this browser:', unsupportedFeatures);
        // Provide fallbacks or polyfills if needed
    }
}

// Initialize compatibility check
checkBrowserCompatibility();
