// Performance optimizations
let ticking = false;
let isScrolling = false;
let isMobile = window.innerWidth <= 768;
let touchStartX = 0;
let touchStartY = 0;

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

// Detect mobile device changes
function updateDeviceType() {
    isMobile = window.innerWidth <= 768;
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
    
    // Setup touch gestures for mobile
    setupTouchGestures();
    
    // Setup device orientation handling
    setupOrientationHandling();
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
    
    // Setup accessibility enhancements
    setupAccessibility();
    
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
        img.onerror = function() {
            console.warn(`Failed to load image: ${src}`);
        };
    });
}

// =========================
// AI Assistant - Mobile Optimized
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

    if (!aiToggle || !aiChat) return;

    // AI Responses
    const aiResponses = {
        precos: "Os preços variam conforme o tipo de evento e duração. Para casamentos: R$ 800-1200, Festas de debutante: R$ 600-900, Aniversários: R$ 400-700. Entre em contato para um orçamento personalizado!",
        repertorio: "Meu repertório inclui música clássica (Bach, Mozart, Vivaldi), contemporânea (Einaudi, Max Richter), popular brasileira e trilhas sonoras. Posso personalizar a seleção musical para seu evento especial!",
        casamento: "Para casamentos, toco na cerimônia religiosa, civil ou entrada dos noivos. Repertório inclui Canon de Pachelbel, Ave Maria, e músicas especiais do casal. Atendo toda região de Americana/SP e arredores.",
        disponibilidade: "Para verificar disponibilidade, preciso saber a data, horário e local do evento. Atendo finais de semana e alguns dias úteis. Entre em contato via WhatsApp para confirmar sua data!",
        default: "Olá! Posso ajudar com informações sobre apresentações, repertório, preços e disponibilidade. Fabricio Porto é violinista profissional há mais de 10 anos, atendendo eventos em toda região. Como posso ajudar você?"
    };

    let chatOpen = false;
    let messageCount = 1;
    let isTyping = false;

    // Prevent body scroll when chat is open on mobile
    function toggleBodyScroll(disable) {
        if (isMobile) {
            document.body.style.overflow = disable ? 'hidden' : '';
        }
    }

    // Toggle chat with improved mobile handling
    aiToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        chatOpen = !chatOpen;
        
        if (chatOpen) {
            aiChat.classList.add('active');
            aiBadge.style.display = 'none';
            toggleBodyScroll(true);
            
            // Focus input on desktop, but not on mobile to prevent keyboard issues
            if (!isMobile) {
                setTimeout(() => aiInput.focus(), 300);
            }
        } else {
            aiChat.classList.remove('active');
            toggleBodyScroll(false);
        }
    });

    // Close chat
    aiClose.addEventListener('click', function(e) {
        e.preventDefault();
        aiChat.classList.remove('active');
        chatOpen = false;
        toggleBodyScroll(false);
    });

    // Quick buttons with better mobile interaction
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (isTyping) return;
            
            const question = this.dataset.question;
            const questionText = this.textContent;
            
            // Add user message
            addMessage(questionText, 'user');
            
            // Show typing indicator and add response
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                const response = aiResponses[question] || aiResponses.default;
                addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000); // Random delay for more natural feeling
        });
    });

    // Send message with improved mobile handling
    function sendMessage() {
        const message = aiInput.value.trim();
        if (!message || isTyping) return;

        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        aiInput.value = '';
        
        // Show typing and generate response
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, 1200 + Math.random() * 800);
    }

    // Send button with touch optimization
    if (aiSend) {
        aiSend.addEventListener('click', function(e) {
            e.preventDefault();
            sendMessage();
        });
    }

    // Enter key handling with mobile considerations
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
                
                // Blur input on mobile to hide keyboard
                if (isMobile) {
                    this.blur();
                }
            }
        });

        // Prevent zoom on iOS double-tap
        aiInput.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.focus();
        });
    }

    // Typing indicator functions
    function showTypingIndicator() {
        if (isTyping) return;
        isTyping = true;
        
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
        scrollToBottom();
        
        // Add typing animation if not already present
        if (!document.getElementById('typing-style')) {
            const typingStyle = document.createElement('style');
            typingStyle.id = 'typing-style';
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
        }
    }
    
    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
        isTyping = false;
    }

    // Add message with improved mobile handling
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}-message`;
        
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
        
        messageDiv.innerHTML = `
            <div class="message-content">${escapeHtml(content)}</div>
            <div class="message-time">${timeStr}</div>
        `;
        
        aiMessages.appendChild(messageDiv);
        scrollToBottom();
        
        // Update message count
        if (sender === 'bot') {
            messageCount++;
            if (!chatOpen) {
                aiBadge.textContent = messageCount;
                aiBadge.style.display = 'flex';
            }
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Smooth scroll to bottom with mobile optimization
    function scrollToBottom() {
        if (aiMessages) {
            requestAnimationFrame(() => {
                aiMessages.scrollTop = aiMessages.scrollHeight;
            });
        }
    }

    // Enhanced response generation
    function generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        const keywords = {
            precos: ['preço', 'valor', 'custo', 'quanto', 'custa', 'cobrar'],
            repertorio: ['música', 'repertório', 'tocar', 'canção', 'song'],
            casamento: ['casamento', 'cerimônia', 'noivo', 'noiva', 'wedding'],
            disponibilidade: ['disponível', 'data', 'quando', 'dia', 'horário']
        };

        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(word => lowerMessage.includes(word))) {
                return aiResponses[key];
            }
        }

        const greetings = ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'];
        if (greetings.some(greeting => lowerMessage.includes(greeting))) {
            return "Olá! Bem-vindo! Sou o assistente do Fabricio Porto. Estou aqui para ajudar com informações sobre apresentações musicais. O que gostaria de saber?";
        }
        
        const thanks = ['obrigado', 'obrigada', 'valeu', 'thanks'];
        if (thanks.some(thank => lowerMessage.includes(thank))) {
            return "De nada! Fico feliz em ajudar. Se tiver mais dúvidas sobre os serviços do Fabricio Porto, é só perguntar!";
        }
        
        return aiResponses.default;
    }

    // Close chat when clicking outside (mobile-friendly)
    document.addEventListener('click', function(e) {
        if (chatOpen && !aiToggle.contains(e.target) && !aiChat.contains(e.target)) {
            aiChat.classList.remove('active');
            chatOpen = false;
            toggleBodyScroll(false);
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && chatOpen) {
            aiChat.classList.remove('active');
            chatOpen = false;
            toggleBodyScroll(false);
        }
    });

    // Welcome message with mobile consideration
    setTimeout(() => {
        if (!chatOpen) {
            messageCount++;
            aiBadge.textContent = messageCount;
            aiBadge.style.display = 'flex';
            addMessage("👋 Olá! Precisa de informações sobre apresentações musicais? Clique aqui para conversar!", 'bot');
        }
    }, 3000);

    // Handle orientation change for mobile
    window.addEventListener('orientationchange', function() {
        if (chatOpen && isMobile) {
            setTimeout(() => {
                scrollToBottom();
            }, 500);
        }
    });
}

// =========================
// Typing Effect - Mobile Optimized
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
    let isVisible = true;
    const typingElement = document.getElementById('typingText');

    if (!typingElement) return;

    // Pause typing when page is not visible for performance
    document.addEventListener('visibilitychange', function() {
        isVisible = !document.hidden;
    });

    function typeWriter() {
        if (!isVisible) {
            setTimeout(typeWriter, 100);
            return;
        }

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
// Navigation - Mobile Optimized
// =========================
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;

    // Toggle mobile menu with improved accessibility
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Touch-friendly navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const offsetTop = target.offsetTop - navHeight - 10;
                
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }

            closeMobileMenu();
        });
    });

    // Improved outside click handling for mobile
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    document.addEventListener('click', handleOutsideClick);
    
    function handleOutsideClick(e) {
        if (navLinks.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    }

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // Handle swipe gestures to close menu
    let touchStartY = 0;
    navLinks.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    navLinks.addEventListener('touchmove', function(e) {
        if (this.classList.contains('active')) {
            const touchY = e.touches[0].clientY;
            const diff = touchStartY - touchY;
            
            if (diff > 100) { // Swipe up to close
                closeMobileMenu();
            }
        }
    }, { passive: true });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;
    
    const isActive = navLinks.classList.contains('active');
    
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Manage body scroll and focus
    if (!isActive) {
        document.body.style.overflow = 'hidden';
        // Focus first link for accessibility
        const firstLink = navLinks.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    } else {
        document.body.style.overflow = '';
    }
    
    // Update ARIA attributes for accessibility
    hamburger.setAttribute('aria-expanded', !isActive);
    navLinks.setAttribute('aria-hidden', isActive);
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
    
    // Update ARIA attributes
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.setAttribute('aria-hidden', 'true');
}

// =========================
// Scroll Handlers - Mobile Optimized
// =========================
function initializeScrollHandlers() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    let lastScrollY = window.pageYOffset;
    let scrollDirection = 'up';

    // Optimized scroll handler with direction detection
    const handleScroll = throttle(function() {
        const scrolled = window.pageYOffset;
        scrollDirection = scrolled > lastScrollY ? 'down' : 'up';
        lastScrollY = scrolled;

        // Update navbar with hide/show on mobile
        if (navbar) {
            if (scrolled > 100) {
                navbar.classList.add('scrolled');
                
                // Hide navbar when scrolling down on mobile for more space
                if (isMobile && scrollDirection === 'down' && scrolled > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.transform = 'translateY(0)';
            }
        }

        // Update back to top button
        if (backToTop) {
            if (scrolled > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Simplified parallax for performance
        if (!isMobile) {
            updateParallax(scrolled);
        }
        
    }, 16); // ~60fps

    // Back to top with smooth animation
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            
            const scrollToTop = () => {
                const scrolled = window.pageYOffset;
                if (scrolled > 0) {
                    window.scrollTo(0, scrolled - scrolled / 8);
                    requestAnimationFrame(scrollToTop);
                }
            };
            
            scrollToTop();
        });
    }

    // Add scroll event listener with passive flag
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Optimized parallax effect
function updateParallax(scrolled) {
    const fpNote = document.querySelector('.fp-musical-note');
    
    if (fpNote && window.innerWidth > 768) {
        const parallaxSpeed = 0.03;
        const yPos = scrolled * parallaxSpeed;
        fpNote.style.transform = `translateY(calc(-50% + ${yPos}px))`;
    }
}

// =========================
// Intersection Observer - Optimized
// =========================
function setupIntersectionObservers() {
    // Enhanced section observer
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    sectionObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: isMobile ? 0.05 : 0.1,
            rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
        }
    );

    // Observe sections
    document.querySelectorAll('.section-observer').forEach(section => {
        sectionObserver.observe(section);
    });

    // Staggered card animations
    const cardObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = isMobile ? index * 50 : index * 100;
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
            rootMargin: '0px 0px -20px 0px'
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

    // Image lazy loading observer
    const imageObserver = new IntersectionObserver(
        (entries) => {
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
        }
    );

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// =========================
// Contact Buttons - Mobile Optimized
// =========================
function initializeContactButtons() {
    document.querySelectorAll('.contact-btn, .btn').forEach(button => {
        // Enhanced touch feedback
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });

        button.addEventListener('touchend', function(e) {
            this.style.transform = '';
        }, { passive: true });

        // Ripple effect
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });

        // Loading state for external links
        if (button.hasAttribute('target') || button.href) {
            button.addEventListener('click', function(e) {
                const isExternal = this.hasAttribute('target') || 
                                 this.href.startsWith('http') || 
                                 this.href.startsWith('mailto') || 
                                 this.href.startsWith('tel');
                
                if (isExternal) {
                    const originalContent = this.innerHTML;
                    const icon = this.querySelector('i');
                    
                    if (icon) {
                        icon.className = 'fas fa-spinner fa-spin';
                    }
                    
                    this.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        this.innerHTML = originalContent;
                        this.style.pointerEvents = '';
                    }, 1500);
                }
            });
        }
    });
}

// Enhanced ripple effect
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    let x, y;
    if (event.type === 'touchstart' || event.type === 'touchend') {
        const touch = event.touches[0] || event.changedTouches[0];
        x = touch.clientX - rect.left - size / 2;
        y = touch.clientY - rect.top - size / 2;
    } else {
        x = event.clientX - rect.left - size / 2;
        y = event.clientY - rect.top - size / 2;
    }
    
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

// =========================
// Touch Gestures - Mobile
// =========================
function setupTouchGestures() {
    if (!isMobile) return;

    let isScrolling = false;
    
    // Prevent pull-to-refresh on some mobile browsers
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (!isScrolling && e.touches.length === 1) {
            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
            
            if (deltaX > deltaY) {
                // Horizontal swipe detected
                isScrolling = true;
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        isScrolling = false;
    }, { passive: true });

    // Swipe gestures for navigation
    let swipeStartX = 0;
    let swipeStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        const swipeEndX = e.changedTouches[0].clientX;
        const swipeEndY = e.changedTouches[0].clientY;
        
        const diffX = swipeStartX - swipeEndX;
        const diffY = swipeStartY - swipeEndY;
        
        const threshold = 100;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > threshold) {
                // Horizontal swipe
                if (diffX > 0) {
                    // Swipe left - could trigger next section
                    console.log('Swipe left detected');
                } else {
                    // Swipe right - could trigger previous section
                    console.log('Swipe right detected');
                }
            }
        } else if (Math.abs(diffY) > threshold) {
            // Vertical swipe
            const navLinks = document.getElementById('navLinks');
            if (diffY > 0 && navLinks && navLinks.classList.contains('active')) {
                // Swipe up - close mobile menu
                closeMobileMenu();
            }
        }
    }, { passive: true });
}

// =========================
// Device Orientation Handling
// =========================
function setupOrientationHandling() {
    let orientationTimeout;

    function handleOrientationChange() {
        clearTimeout(orientationTimeout);
        
        orientationTimeout = setTimeout(() => {
            updateDeviceType();
            
            // Close mobile menu on orientation change
            closeMobileMenu();
            
            // Adjust AI chat position
            const aiChat = document.getElementById('aiChat');
            if (aiChat && aiChat.classList.contains('active')) {
                // Briefly hide and show to recalculate position
                aiChat.style.display = 'none';
                requestAnimationFrame(() => {
                    aiChat.style.display = 'flex';
                });
            }
            
            // Recalculate viewport height for mobile
            if (isMobile) {
                document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
            }
            
        }, 300);
    }

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', debounce(handleOrientationChange, 250));
    
    // Initial viewport height calculation
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

// =========================
// Accessibility Enhancements
// =========================
function setupAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        
        // Space or Enter to activate buttons
        if (e.key === ' ' || e.key === 'Enter') {
            if (activeElement.classList.contains('contact-btn') || 
                activeElement.classList.contains('btn') ||
                activeElement.classList.contains('quick-btn')) {
                e.preventDefault();
                activeElement.click();
            }
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            // Ensure visible focus indicators
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Focus management for mobile menu
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                const firstLink = this.querySelector('a');
                if (firstLink && !isMobile) firstLink.focus();
            }
        });
    }
    
    // ARIA live region for dynamic content announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(liveRegion);
    
    // Function to announce messages to screen readers
    window.announceToScreenReader = function(message) {
        liveRegion.textContent = message;
        setTimeout(() => liveRegion.textContent = '', 1000);
    };
}

// =========================
// Performance Monitoring
// =========================
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }
                
                // Monitor memory usage on mobile
                if (isMobile && 'memory' in performance) {
                    console.log('Memory Usage:', performance.memory.usedJSHeapSize / 1048576, 'MB');
                }
            }, 1000);
        });
    }
    
    // Monitor long tasks that could impact performance
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry.duration, 'ms');
                    }
                }
            });
            observer.observe({entryTypes: ['longtask']});
        } catch (e) {
            // PerformanceObserver not supported
        }
    }
}

// =========================
// Error Handling & Fallbacks
// =========================
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        
        // Graceful degradation
        if (e.error && e.error.message) {
            // Hide problematic animations on error
            const animations = document.querySelectorAll('.musical-note, .pulse-ring');
            animations.forEach(el => el.style.display = 'none');
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault();
    });
    
    // Fallback for critical functionality
    setTimeout(() => {
        // Ensure navigation works even if JavaScript fails
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        if (hamburger && navLinks && !hamburger.onclick) {
            // Fallback click handler
            hamburger.onclick = function() {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            };
        }
    }, 2000);
}

// =========================
// Image Lazy Loading Fallback
// =========================
function setupImageHandling() {
    // Enhanced image loading with error handling
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
    
    // Intersection Observer for lazy loading (if supported)
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
    } else {
        // Fallback for browsers without Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// =========================
// Resize Handler - Enhanced
// =========================
const handleResize = debounce(function() {
    const oldIsMobile = isMobile;
    updateDeviceType();
    
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Reset styles when switching between mobile/desktop
    if (oldIsMobile !== isMobile) {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.style.transform = '';
        }
        
        // Reset parallax on mobile
        const fpNote = document.querySelector('.fp-musical-note');
        if (fpNote && isMobile) {
            fpNote.style.transform = '';
        }
        
        // Adjust AI chat if open
        const aiChat = document.getElementById('aiChat');
        if (aiChat && aiChat.classList.contains('active')) {
            // Recalculate position
            setTimeout(() => {
                aiChat.style.display = 'none';
                requestAnimationFrame(() => {
                    aiChat.style.display = 'flex';
                });
            }, 100);
        }
    }
    
    // Update viewport height for mobile browsers
    if (isMobile) {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
}, 250);

window.addEventListener('resize', handleResize);

// =========================
// Page Visibility Optimization
// =========================
function handleVisibilityChange() {
    if (document.hidden) {
        // Pause expensive operations when page is not visible
        document.body.classList.add('page-hidden');
        
        // Pause CSS animations
        const style = document.createElement('style');
        style.id = 'pause-animations';
        style.textContent = `
            *, *::before, *::after {
                animation-play-state: paused !important;
                transition-duration: 0s !important;
            }
        `;
        document.head.appendChild(style);
    } else {
        // Resume operations when page becomes visible
        document.body.classList.remove('page-hidden');
        
        // Resume animations
        const pauseStyle = document.getElementById('pause-animations');
        if (pauseStyle) {
            pauseStyle.remove();
        }
    }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

// =========================
// Smooth Scroll Polyfill for older browsers
// =========================
function setupSmoothScrollPolyfill() {
    // Check if smooth scroll is supported
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Add polyfill for smooth scroll
        const smoothScrollTo = (element, to, duration) => {
            const start = element.scrollTop;
            const change = to - start;
            const startDate = +new Date();
            
            const easeInOutQuart = (t, b, c, d) => {
                t /= d/2;
                if (t < 1) return c/2*t*t*t*t + b;
                t -= 2;
                return -c/2 * (t*t*t*t - 2) + b;
            };
            
            const animateScroll = () => {
                const currentDate = +new Date();
                const currentTime = currentDate - startDate;
                element.scrollTop = parseInt(easeInOutQuart(currentTime, start, change, duration));
                if (currentTime < duration) {
                    requestAnimationFrame(animateScroll);
                } else {
                    element.scrollTop = to;
                }
            };
            
            animateScroll();
        };
        
        // Override scroll behavior
        window.scrollTo = function(options) {
            if (typeof options === 'object' && options.behavior === 'smooth') {
                smoothScrollTo(document.documentElement, options.top || 0, 600);
            } else {
                window.scroll.apply(window, arguments);
            }
        };
    }
}

// =========================
// Memory Management
// =========================
function setupMemoryManagement() {
    let observers = [];
    let timeouts = [];
    let intervals = [];
    
    // Track observers for cleanup
    const originalObserve = IntersectionObserver.prototype.observe;
    IntersectionObserver.prototype.observe = function(...args) {
        observers.push(this);
        return originalObserve.apply(this, args);
    };
    
    // Track timeouts
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(...args) {
        const id = originalSetTimeout.apply(window, args);
        timeouts.push(id);
        return id;
    };
    
    // Track intervals
    const originalSetInterval = window.setInterval;
    window.setInterval = function(...args) {
        const id = originalSetInterval.apply(window, args);
        intervals.push(id);
        return id;
    };
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        // Disconnect observers
        observers.forEach(observer => {
            try { observer.disconnect(); } catch(e) {}
        });
        
        // Clear timeouts
        timeouts.forEach(id => clearTimeout(id));
        
        // Clear intervals
        intervals.forEach(id => clearInterval(id));
        
        // Reset body overflow
        document.body.style.overflow = '';
        
        // Clear any remaining event listeners
        observers = [];
        timeouts = [];
        intervals = [];
    });
}

// =========================
// Network Status Handling
// =========================
function setupNetworkHandling() {
    if ('onLine' in navigator) {
        function handleOnlineStatus() {
            if (!navigator.onLine) {
                // Show offline message
                const offlineMsg = document.createElement('div');
                offlineMsg.id = 'offline-message';
                offlineMsg.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 80px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(255, 193, 7, 0.9);
                        color: #000;
                        padding: 10px 20px;
                        border-radius: 5px;
                        z-index: 10000;
                        font-size: 14px;
                        backdrop-filter: blur(10px);
                    ">
                        📶 Você está offline. Algumas funcionalidades podem não funcionar.
                    </div>
                `;
                document.body.appendChild(offlineMsg);
                
                setTimeout(() => {
                    if (offlineMsg.parentNode) {
                        offlineMsg.remove();
                    }
                }, 5000);
            } else {
                // Remove offline message
                const offlineMsg = document.getElementById('offline-message');
                if (offlineMsg) {
                    offlineMsg.remove();
                }
            }
        }
        
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
    }
}

// =========================
// Advanced Mobile Optimizations
// =========================
function setupAdvancedMobileOptimizations() {
    if (!isMobile) return;
    
    // Prevent bounce effect on iOS
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            const target = e.target;
            const scrollableParent = findScrollableParent(target);
            
            if (!scrollableParent || scrollableParent === document.body) {
                // Prevent overscroll
                if (window.scrollY <= 0) {
                    e.preventDefault();
                }
            }
        }
    }, { passive: false });
    
    function findScrollableParent(node) {
        if (node === null) return null;
        
        const overflowY = window.getComputedStyle(node).overflowY;
        const isScrollable = overflowY === 'scroll' || overflowY === 'auto';
        
        if (isScrollable && node.scrollHeight > node.clientHeight) {
            return node;
        }
        
        return findScrollableParent(node.parentNode);
    }
    
    // Optimize touch events
    let passiveSupported = false;
    try {
        const options = {
            get passive() {
                passiveSupported = true;
                return false;
            }
        };
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
    } catch(err) {
        passiveSupported = false;
    }
    
    // Add touch-action CSS for better performance
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        .ai-chat, .nav-links {
            touch-action: pan-y;
        }
        .ai-toggle, .contact-btn, .btn {
            touch-action: manipulation;
        }
    `;
    document.head.appendChild(touchStyle);
    
    // Optimize for high DPI displays
    if (window.devicePixelRatio > 1) {
        document.body.classList.add('high-dpi');
    }
}

// =========================
// Initialize All Features
// =========================
document.addEventListener('DOMContentLoaded', function() {
    // Core initialization
    try {
        setupErrorHandling();
        setupMemoryManagement();
        initializePerformanceMonitoring();
        
        // UI initialization
        setupSmoothScrollPolyfill();
        setupImageHandling();
        setupNetworkHandling();
        setupAdvancedMobileOptimizations();
        
        console.log('Website initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        // Ensure basic functionality works even if advanced features fail
        setupBasicFallbacks();
    }
});

// =========================
// Basic Fallbacks
// =========================
function setupBasicFallbacks() {
    // Ensure navigation works
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Ensure smooth scrolling works
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// =========================
// Service Worker Registration (Optional)
// =========================
function registerServiceWorker() {
    if ('serviceWorker' in navigator && 'caches' in window) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration.scope);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Uncomment to enable service worker
// registerServiceWorker();

// =========================
// Export functions for testing (if needed)
// =========================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        toggleMobileMenu,
        closeMobileMenu
    };
}
