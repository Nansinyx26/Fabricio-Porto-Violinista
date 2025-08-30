// =========================
// CONFIGURAÇÕES GLOBAIS OTIMIZADAS
// =========================

const CONFIG = {
    SCROLL_THROTTLE: 16, // ~60fps
    DEBOUNCE_DELAY: 250,
    TYPING_SPEED: {
        TYPING: 80,
        DELETING: 40,
        PAUSE: 1500
    },
    MOBILE_BREAKPOINT: 768,
    ANIMATION_DELAYS: {
        CARD_STAGGER: 100,
        SECTION_DELAY: 50
    }
};

// Variables globais
let ticking = false;
let isScrolling = false;
let isMobile = false;
let isLowEndDevice = false;
let typingTimeout = null;

// =========================
// DETECÇÃO DE DISPOSITIVO OTIMIZADA
// =========================
function detectDevice() {
    isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    isLowEndDevice = navigator.hardwareConcurrency <= 4 ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        window.innerWidth <= 480;

    // Define CSS properties
    document.documentElement.style.setProperty('--is-mobile', isMobile ? '1' : '0');

    if (isLowEndDevice) {
        document.documentElement.classList.add('low-end-device');
    }
}

// =========================
// UTILITY FUNCTIONS
// =========================
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

// =========================
// CONHECIMENTO DA IA - SIMPLIFICADO
// =========================
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
    }
};

// =========================
// INICIALIZAÇÃO PRINCIPAL - CORRIGIDA
// =========================
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Detectar dispositivo
        detectDevice();

        // Remover loading IMEDIATAMENTE
        hideLoadingIndicator();

        // Inicializar componentes
        initializeComponents();

        // Configurar observadores
        setupIntersectionObservers();

        // Configurar eventos
        setupEventListeners();

        console.log('✅ Website inicializado com sucesso');
    } catch (error) {
        console.error('Erro na inicialização:', error);
        hideLoadingIndicator(); // Garante que loading seja removido mesmo com erro
    }
});

// =========================
// LOADING - CORRIGIDO
// =========================
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
        setTimeout(() => {
            if (loadingIndicator.parentNode) {
                loadingIndicator.remove();
            }
        }, 300);
    }
    document.body.classList.add('loaded');
}

// =========================
// INICIALIZAÇÃO DE COMPONENTES - SIMPLIFICADA
// =========================
function initializeComponents() {
    initializeTypingEffect();
    initializeNavigation();
    initializeScrollHandlers();
    initializeContactButtons();
    initializeAIAssistant();
    initializeMusicalNotes();
}

// =========================
// EFEITO DE DIGITAÇÃO - CORRIGIDO
// =========================
function initializeTypingEffect() {
    const typingTexts = [
        "Violinista Clássico",
        "Artista Apaixonado",
        "Professor Dedicado",
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

// =========================
// NAVEGAÇÃO - SIMPLIFICADA
// =========================
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

    // Navegação suave
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
            closeMobileMenu();
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (hamburger && navLinks &&
            !hamburger.contains(e.target) &&
            !navLinks.contains(e.target)) {
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

    // Prevenir scroll
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
// ASSISTENTE IA - CORRIGIDO
// =========================
function initializeAIAssistant() {
    const aiToggle = document.getElementById('aiToggle');
    const aiChat = document.getElementById('aiChat');
    const aiClose = document.getElementById('aiClose');
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');
    const aiMessages = document.getElementById('aiMessages');
    const quickBtns = document.querySelectorAll('.quick-btn');

    let chatOpen = false;
    let isTyping = false;

    if (!aiToggle || !aiChat) return;

    // Toggle chat
    aiToggle.addEventListener('click', function() {
        chatOpen = !chatOpen;
        aiChat.classList.toggle('active', chatOpen);

        if (chatOpen) {
            setTimeout(() => {
                if (aiInput) aiInput.focus();
            }, 300);

            if (isMobile) {
                document.body.classList.add('ai-chat-open');
            }
        } else {
            document.body.classList.remove('ai-chat-open');
        }
    });

    // Close chat
    if (aiClose) {
        aiClose.addEventListener('click', function() {
            chatOpen = false;
            aiChat.classList.remove('active');
            document.body.classList.remove('ai-chat-open');
        });
    }

    // Send message
    if (aiSend && aiInput) {
        aiSend.addEventListener('click', sendMessage);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Quick buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            const knowledge = aiKnowledgeBase[question];
            if (knowledge && !isTyping) {
                addUserMessage(knowledge.question);
                showTypingIndicator();
                setTimeout(() => {
                    hideTypingIndicator();
                    addBotMessage(knowledge.answer);
                }, 1000);
            }
        });
    });

    function sendMessage() {
        const message = aiInput.value.trim();
        if (!message || isTyping) return;

        addUserMessage(message);
        aiInput.value = '';

        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateAIResponse(message);
            addBotMessage(response);
        }, 1200);
    }

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
        requestAnimationFrame(() => {
            aiMessages.scrollTop = aiMessages.scrollHeight;
        });
    }

    function showTypingIndicator() {
        if (isTyping) return;
        isTyping = true;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        aiMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        isTyping = false;
    }

    function generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Keywords mapping
        const keywords = {
            'preço': 'precos',
            'valor': 'precos',
            'custo': 'precos',
            'repertório': 'repertorio',
            'música': 'repertorio',
            'tocar': 'repertorio',
            'casamento': 'casamento',
            'noiva': 'casamento',
            'disponível': 'disponibilidade',
            'data': 'disponibilidade',
            'agenda': 'disponibilidade'
        };

        for (const [keyword, category] of Object.entries(keywords)) {
            if (message.includes(keyword)) {
                return aiKnowledgeBase[category].answer;
            }
        }

        // Saudações
        if (/^(olá|oi|bom dia|boa tarde|boa noite)/.test(message)) {
            return "Olá! Seja bem-vindo(a)! Sou o assistente do Fabricio Porto. Posso ajudar com informações sobre apresentações, repertório, preços e disponibilidade. Como posso ajudar você?";
        }

        // Agradecimentos
        if (message.includes('obrigad') || message.includes('valeu')) {
            return "Por nada! Foi um prazer ajudar. Se tiver mais dúvidas ou quiser agendar uma apresentação, entre em contato diretamente com o Fabricio!";
        }

        // Resposta padrão
        return "Entendo sua pergunta! Para informações mais específicas, recomendo entrar em contato diretamente com o Fabricio Porto via WhatsApp (19) 99901-1288 ou email fabricioportoviolinista@gmail.com.";
    }
}

// =========================
// SCROLL HANDLERS - OTIMIZADOS
// =========================
function initializeScrollHandlers() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = throttle(function() {
        const scrolled = window.pageYOffset;

        // Update navbar
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled > 100);
        }

        // Update back to top button
        if (backToTop) {
            backToTop.classList.toggle('visible', scrolled > 500);
        }

        // Parallax apenas em desktop
        if (!isMobile && window.innerWidth > CONFIG.MOBILE_BREAKPOINT) {
            updateParallax(scrolled);
        }
    }, CONFIG.SCROLL_THROTTLE);

    // Back to top
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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
// INTERSECTION OBSERVERS - CORRIGIDOS
// =========================
function setupIntersectionObservers() {
    if (!window.IntersectionObserver) {
        // Fallback para browsers antigos
        document.querySelectorAll('.section-observer').forEach(section => {
            section.classList.add('visible');
        });
        return;
    }

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animar cards
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
        }
    );

    // Observar seções
    document.querySelectorAll('.section-observer').forEach(section => {
        sectionObserver.observe(section);
    });

    // Preparar cards para animação
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
// BOTÕES DE CONTATO - CORRIGIDOS
// =========================
function initializeContactButtons() {
    document.querySelectorAll('.contact-btn, .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });
}

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
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// =========================
// NOTAS MUSICAIS - OTIMIZADAS
// =========================
function initializeMusicalNotes() {
    const notes = document.querySelectorAll('.musical-note');

    notes.forEach((note, index) => {
        const delay = index * 2;
        note.style.animationDelay = `${delay}s`;

        if (isMobile) {
            note.style.animationDuration = '25s';
            note.style.opacity = '0.4';

            // Esconder notas extras em dispositivos pequenos
            if (isLowEndDevice && index > 3) {
                note.style.display = 'none';
            }
        }
    });
}

// =========================
// EVENT LISTENERS PRINCIPAIS
// =========================
function setupEventListeners() {
    // Resize handler
    const handleResize = debounce(function() {
        const wasMobile = isMobile;
        detectDevice();

        if (wasMobile && !isMobile) {
            closeMobileMenu();
            closeAIChat();
        }

        reconfigureForDevice();
    }, CONFIG.DEBOUNCE_DELAY);

    window.addEventListener('resize', handleResize);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeAIChat();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const aiToggle = document.getElementById('aiToggle');
            if (aiToggle) aiToggle.click();
        }
    });

    // Visibility API para otimização
    document.addEventListener('visibilitychange', function() {
        const isHidden = document.hidden;

        // Pausar animações quando página não está visível
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

            if (isLowEndDevice && index > 3) {
                note.style.display = 'none';
            }
        } else {
            note.style.animationDuration = '15s';
            note.style.opacity = '0.6';
            note.style.display = '';
        }
    });
}

function closeAIChat() {
    const aiChat = document.getElementById('aiChat');
    if (aiChat) {
        aiChat.classList.remove('active');
        document.body.classList.remove('ai-chat-open');
    }
}

// =========================
// CLEANUP - IMPORTANTE
// =========================
window.addEventListener('beforeunload', function() {
    // Limpar timeouts
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    // Restaurar overflow
    document.body.style.overflow = '';
    document.body.classList.remove('ai-chat-open');
});

// =========================
// FALLBACKS E POLYFILLS
// =========================
function setupFallbacks() {
    // Fallback para CSS.supports
    if (typeof CSS === 'undefined' || !CSS.supports) {
        window.CSS = {
            supports: function() { return false; }
        };
    }

    // Fallback para requestAnimationFrame
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 16);
        };
    }
}

// =========================
// INICIALIZAÇÃO FINAL SEGURA
// =========================
(function() {
    // Setup inicial
    setupFallbacks();

    // Garantir que o loading seja removido mesmo se houver problemas
    setTimeout(hideLoadingIndicator, 100);

    // Log de inicialização
    console.log('🎻 Fabricio Porto Website - Carregado com sucesso!');
})();
