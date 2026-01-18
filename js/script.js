// ==========================================================================
// script.js - Lógicas JavaScript Base (para Desktop e Funções Globais)
// ==========================================================================

// =========================
// CONFIGURAÇÕES GLOBAIS
// =========================

const CONFIG = {
    SCROLL_THROTTLE: 16,
    DEBOUNCE_DELAY: 200,
    TYPING_SPEED: { // Velocidades padrão (para desktop, podem ser sobrescritas por script_mobile.js)
        TYPING: 60,
        DELETING: 30,
        PAUSE: 1200
    },
    MOBILE_BREAKPOINT: 768, // Usado para detecção inicial, mas a lógica mobile está em script_mobile.js
    ANIMATION_DELAYS: {
        CARD_STAGGER: 80,
        SECTION_DELAY: 30
    }
};

// Variáveis globais
let ticking = false;
let isScrolling = false;
let isMobile = false; // Será definido por detectDevice()
let isLowEndDevice = false; // Será definido por detectDevice()
let typingTimeout = null;
let resizeTimeout = null;
let isTyping = false; // Estado global para o assistente AI

// Cache para elementos DOM
const domCache = {
    navbar: null,
    hamburger: null,
    navLinks: null,
    aiChat: null,
    aiToggle: null,
    loadingIndicator: null,
    typingTextElement: null, // Adicionado para acesso global
    aiMessages: null, // Adicionado para acesso global
    aiInput: null, // Adicionado para acesso global
};

// =========================
// DETECÇÃO DE DISPOSITIVO AVANÇADA
// =========================

function detectDevice() {
    isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    
    isLowEndDevice = (
        navigator.hardwareConcurrency <= 4 ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        window.innerWidth <= 480 ||
        navigator.connection?.effectiveType === 'slow-2g' ||
        navigator.connection?.effectiveType === '2g'
    );

    const html = document.documentElement;
    html.classList.toggle('mobile-device', isMobile);
    html.classList.toggle('low-end-device', isLowEndDevice);
    html.style.setProperty('--is-mobile', isMobile ? '1' : '0');

    if (isMobile) {
        const vh = window.innerHeight * 0.01;
        html.style.setProperty('--vh', `${vh}px`);
    }
}

// =========================
// UTILITY FUNCTIONS
// =========================

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const debounce = (func, wait) => {
    return function(...args) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const raf = callback => {
    if (!ticking) {
        requestAnimationFrame(() => {
            callback();
            ticking = false;
        });
        ticking = true;
    }
};

// =========================
// CACHE DE ELEMENTOS DOM
// =========================

function initDOMCache() {
    domCache.navbar = document.getElementById('navbar');
    domCache.hamburger = document.getElementById('hamburger');
    domCache.navLinks = document.getElementById('navLinks');
    domCache.aiChat = document.getElementById('aiChat');
    domCache.aiToggle = document.getElementById('aiToggle');
    domCache.loadingIndicator = document.getElementById('loading-indicator');
    domCache.typingTextElement = document.getElementById('typingText');
    domCache.aiMessages = document.getElementById('aiMessages');
    domCache.aiInput = document.getElementById('aiInput');
}

// =========================
// CONHECIMENTO DA IA (EXPOSTO GLOBALMENTE)
// =========================

const aiKnowledgeBase = {
    precos: {
        question: "Quais são os preços dos serviços?",
        answer: "Os valores variam de acordo com o tipo de evento e duração. Para casamentos a partir: R$ 1200 (o cortejo), Para outros eventos, entre em contato para um orçamento personalizado!"
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
// INICIALIZAÇÃO PRINCIPAL
// =========================

document.addEventListener('DOMContentLoaded', function() {
    try {
        detectDevice();
        initDOMCache();
        hideLoadingIndicator();
        initializeComponents();
        setupIntersectionObservers();
        setupEventListeners();
        
        console.log('✅ Website inicializado - Mobile:', isMobile, 'Low-end:', isLowEndDevice);
    } catch (error) {
        console.error('Erro na inicialização:', error);
        hideLoadingIndicator();
    }
});

// =========================
// LOADING
// =========================

function hideLoadingIndicator() {
    const loading = domCache.loadingIndicator || document.getElementById('loading-indicator');
    if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.remove();
        }, 300);
    }
    document.body.classList.add('loaded');
}

// =========================
// INICIALIZAÇÃO DE COMPONENTES
// =========================

function initializeComponents() {
    initializeTypingEffect();
    initializeNavigation(); // Lógica de navegação base (desktop)
    initializeScrollHandlers();
    initializeContactButtons();
    initializeAIAssistant(); // Lógica do assistente AI base (desktop)
    
    // Inicializar notas musicais apenas em desktop ou dispositivos de alta performance
    // A lógica para mobile está em script_mobile.js (escondendo-as)
    if (!isMobile || !isLowEndDevice) {
        initializeMusicalNotes();
    }
}

// =========================
// EFEITO DE DIGITAÇÃO
// =========================

function initializeTypingEffect() {
    const typingTexts = [
        "Violinista Especializado ",
        "Ad libitum Musician",
        "Artista Apaixonado",
        "Professor Dedicado",
        "Músico Profissional",
        "Assessor Musical "

    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeletingText = false; // Renomeado para evitar conflito com isTyping do AI
    const typingElement = domCache.typingTextElement;

    if (!typingElement) return;

    function typeWriter() {
        const currentText = typingTexts[textIndex];
        const cursor = isLowEndDevice ? '' : '|';

        if (isDeletingText) {
            typingElement.textContent = currentText.substring(0, charIndex - 1) + cursor;
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1) + cursor;
            charIndex++;
        }

        if (!isDeletingText && charIndex === currentText.length) {
            typingTimeout = setTimeout(() => isDeletingText = true, CONFIG.TYPING_SPEED.PAUSE);
        } else if (isDeletingText && charIndex === 0) {
            isDeletingText = false;
            textIndex = (textIndex + 1) % typingTexts.length;
        }

        const speed = isDeletingText ? CONFIG.TYPING_SPEED.DELETING : CONFIG.TYPING_SPEED.TYPING;
        typingTimeout = setTimeout(typeWriter, speed);
    }

    typeWriter();
}

// =========================
// NAVEGAÇÃO (Lógica para Desktop)
// =========================

function initializeNavigation() {
    const hamburger = domCache.hamburger;
    const navLinks = domCache.navLinks;

    // Em desktop, o hamburguer deve estar escondido e o navLinks visível
    if (!isMobile) {
        if (hamburger) hamburger.style.display = 'none';
        if (navLinks) navLinks.style.display = 'flex';
    } else {
        // Em mobile, o hamburguer é visível e o navLinks é controlado por script_mobile.js
        if (hamburger) hamburger.style.display = 'flex';
        if (navLinks) navLinks.style.display = ''; // Reset para ser controlado pelo CSS/JS mobile
    }

    // Navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const offsetTop = target.offsetTop - (isMobile ? 60 : 80); // Ajuste para navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: isLowEndDevice ? 'auto' : 'smooth'
                });
            }
            // Em desktop, não há menu para fechar
        });
    });
}

// =========================
// ASSISTENTE IA (Lógica para Desktop)
// =========================

function initializeAIAssistant() {
    const aiToggle = domCache.aiToggle;
    const aiChat = domCache.aiChat;
    const aiClose = document.getElementById('aiClose');
    const aiInput = domCache.aiInput;
    const aiSend = document.getElementById('aiSend');
    const aiMessages = domCache.aiMessages;
    const quickBtns = document.querySelectorAll('.quick-btn');

    let chatOpen = false; // Estado local para desktop

    if (!aiToggle || !aiChat) return;

    // Toggle chat
    aiToggle.addEventListener('click', function() {
        chatOpen = !chatOpen;
        aiChat.classList.toggle('active', chatOpen);
        aiChat.setAttribute('aria-hidden', !chatOpen);

        if (chatOpen) {
            setTimeout(() => {
                if (aiInput) aiInput.focus();
            }, 300);
            document.body.style.overflow = 'hidden'; // Bloqueia scroll em desktop
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close chat
    if (aiClose) {
        aiClose.addEventListener('click', function() {
            chatOpen = false;
            aiChat.classList.remove('active');
            aiChat.setAttribute('aria-hidden', true);
            document.body.style.overflow = '';
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
                }, 1000); // Tempo de resposta padrão para desktop
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
        }, 1200); // Tempo de resposta padrão para desktop
    }
}

// Funções do AI Assistant (EXPOSTAS GLOBALMENTE)
function addUserMessage(message) {
    const messageDiv = createMessageElement(message, 'user-message');
    domCache.aiMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(message) {
    const messageDiv = createMessageElement(message, 'bot-message');
    domCache.aiMessages.appendChild(messageDiv);
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
    raf(() => {
        domCache.aiMessages.scrollTop = domCache.aiMessages.scrollHeight;
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

    domCache.aiMessages.appendChild(typingDiv);
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

    if (/^(olá|oi|bom dia|boa tarde|boa noite)/.test(message)) {
        return "Olá! Seja bem-vindo(a)! Sou o assistente do Fabricio Porto. Posso ajudar com informações sobre apresentações, repertório, preços e disponibilidade. Como posso ajudar você?";
    }

    if (message.includes('obrigado') || message.includes('valeu')) {
        return "Por nada! Foi um prazer ajudar. Se tiver mais dúvidas ou quiser agendar uma apresentação, entre em contato diretamente com o Fabricio!";
    }

    return `Entendo sua pergunta! Para informações mais específicas, recomendo entrar em contato diretamente com o Fabricio Porto pelo WhatsApp (19) 99901-1288 ou pelo e-mail fabricioportoviolinista@gmail.com.`;
}

// EXPOSIÇÃO DE FUNÇÕES GLOBAIS PARA script_mobile.js
window.addUserMessage = addUserMessage;
window.addBotMessage = addBotMessage;
window.showTypingIndicator = showTypingIndicator;
window.hideTypingIndicator = hideTypingIndicator;
window.generateAIResponse = generateAIResponse;
window.aiKnowledgeBase = aiKnowledgeBase;
window.isTyping = isTyping; // Expor o estado de digitação
window.CONFIG = CONFIG; // Expor CONFIG para que script_mobile.js possa ajustar velocidades

// =========================
// SCROLL HANDLERS
// =========================

function initializeScrollHandlers() {
    const navbar = domCache.navbar;
    const backToTop = document.getElementById('backToTop');

    const handleScroll = throttle(function() {
        const scrolled = window.pageYOffset;

        // Update navbar
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled > 100); // Threshold para desktop
        }

        // Update back to top button
        if (backToTop) {
            backToTop.classList.toggle('visible', scrolled > 500); // Threshold para desktop
        }

        // Parallax apenas em desktop com performance
        if (!isMobile && !isLowEndDevice) {
            updateParallax(scrolled);
        }
    }, CONFIG.SCROLL_THROTTLE);

    // Back to top
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: isLowEndDevice ? 'auto' : 'smooth'
            });
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
}

function updateParallax(scrolled) {
    const fpNote = document.querySelector('.fp-musical-note');
    if (fpNote) {
        const parallaxSpeed = 0.015;
        const yPos = scrolled * parallaxSpeed;

        raf(() => {
            fpNote.style.transform = `translateY(calc(-50% + ${yPos}px))`;
        });
    }
}

// =========================
// INTERSECTION OBSERVERS
// =========================

function setupIntersectionObservers() {
    if (!window.IntersectionObserver) {
        document.querySelectorAll('.section-observer').forEach(section => {
            section.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1, // Padrão para desktop
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    const cards = entry.target.querySelectorAll('.repertoire-card, .performance-card');
                    const delay = CONFIG.ANIMATION_DELAYS.CARD_STAGGER;
                    
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * delay);
                    });

                    sectionObserver.unobserve(entry.target);
                }
            });
        }, 
        observerOptions
    );

    document.querySelectorAll('.section-observer').forEach(section => {
        sectionObserver.observe(section);
    });

    setupCardAnimations();
}

function setupCardAnimations() {
    const cardElements = document.querySelectorAll('.repertoire-card, .performance-card');

    cardElements.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease`;
    });
}

// =========================
// BOTÕES DE CONTATO
// =========================

function initializeContactButtons() {
    document.querySelectorAll('.contact-btn, .btn').forEach(button => {
        // Ripple effect apenas em desktop
        if (!isMobile) {
            button.addEventListener('click', function(e) {
                createRippleEffect(this, e);
            });
        }
        // Feedback tátil para mobile é tratado em script_mobile.js
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
// NOTAS MUSICAIS
// =========================

function initializeMusicalNotes() {
    const notes = document.querySelectorAll('.musical-note');
    
    // Notas musicais são visíveis apenas em desktop ou dispositivos de alta performance
    // e são escondidas pelo styles_mobile.css em mobile
    notes.forEach((note, index) => {
        const delay = index * 2; // Padrão para desktop
        note.style.animationDelay = `${delay}s`;
        note.style.animationDuration = '15s';
        note.style.opacity = '0.6';
        note.style.display = ''; // Garante que estejam visíveis se não for mobile
    });
}

// =========================
// EVENT LISTENERS
// =========================

function setupEventListeners() {
    // Resize handler (apenas para re-detectar dispositivo e reconfigurar)
    const handleResize = debounce(function() {
        const wasMobile = isMobile;
        detectDevice(); // Re-detecta se é mobile

        // Se o estado mobile mudou (ex: redimensionar janela do navegador)
        if (wasMobile !== isMobile) {
            // Recarrega assets mobile se necessário (já feito no index.html)
            // Re-inicializa componentes base para se adaptar ao novo estado
            initializeNavigation(); // Reconfigura visibilidade do hamburguer/navlinks
            initializeAIAssistant(); // Reconfigura comportamento do AI (scroll body)
            initializeMusicalNotes(); // Reconfigura visibilidade das notas
        }
    }, CONFIG.DEBOUNCE_DELAY);

    window.addEventListener('resize', handleResize, { passive: true });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Fechar menu/chat em desktop
            if (!isMobile) {
                const aiChat = domCache.aiChat;
                if (aiChat && aiChat.classList.contains('active')) {
                    aiChat.classList.remove('active');
                    aiChat.setAttribute('aria-hidden', true);
                    document.body.style.overflow = '';
                }
            }
            // Lógica para mobile está em script_mobile.js
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const aiToggle = domCache.aiToggle;
            if (aiToggle) aiToggle.click();
        }
    });

    // Otimização de performance com Visibility API
    document.addEventListener('visibilitychange', function() {
        const isHidden = document.hidden;

        // Pausar animações quando página não está visível
        if (isHidden) {
            document.querySelectorAll('.musical-note, .pulse-ring').forEach(element => {
                element.style.animationPlayState = 'paused';
            });
        } else {
            document.querySelectorAll('.musical-note, .pulse-ring').forEach(element => {
                element.style.animationPlayState = 'running';
            });
        }
    });
}

// =========================
// CLEANUP
// =========================

window.addEventListener('beforeunload', function() {
    // Limpar timeouts
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }

    // Restaurar estado do body (para desktop)
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.classList.remove('ai-chat-open'); // Remove classe de fix iOS
});

// =========================
// POLYFILLS E FALLBACKS
// =========================

function setupFallbacks() {
    if (typeof CSS === 'undefined' || !CSS.supports) {
        window.CSS = {
            supports: function() { return false; }
        };
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 16);
        };
    }

    if (typeof Object.assign !== 'function') {
        Object.assign = function(target) {
            for (let i = 1; i < arguments.length; i++) {
                const source = arguments[i];
                for (let key in source) {
                    if (source.hasOwnProperty(key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    }
}

// =========================
// INICIALIZAÇÃO FINAL SEGURA
// =========================

(function() {
    setupFallbacks();
    
    setTimeout(() => {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.remove();
        }
        document.body.classList.add('loaded');
    }, 100);

    console.log('🎻 Fabricio Porto Website - Otimizado para Mobile!');
})();

// =========================
// TRACKING
// =========================

document.addEventListener('DOMContentLoaded', function() {
    const websiteLinks = document.querySelectorAll('a[href*="nansinyx26.github.io"]');
    
    websiteLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_link', {
                    'event_category': 'Engajamento',
                    'event_label': this.href,
                    'device_type': isMobile ? 'mobile' : 'desktop'
                });
            }

            console.log('Click no link do website:', this.href);
        }, { passive: true });
    });
});
// =========================
// DETECÇÃO ESPECÍFICA DO CHROME E SCROLLBAR
// =========================

// Detectar se é Chrome
function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

// Aplicar classe específica para Chrome
if (isChrome()) {
    document.documentElement.classList.add('chrome-browser');
    
    // Função para verificar se precisa de scroll na navegação
    function checkNavScroll() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && window.innerWidth > 768) {
            const isOverflowing = navLinks.scrollWidth > navLinks.clientWidth;
            navLinks.classList.toggle('has-overflow', isOverflowing);
        }
    }
    
    // Verificar no load e resize
    window.addEventListener('load', checkNavScroll);
    window.addEventListener('resize', checkNavScroll);
}
// ===== JAVASCRIPT PARA MARCA D'ÁGUA NANDEV =====
// Adicione este código ao final do seu arquivo script.js

class NandevWatermark {
    constructor() {
        this.init();
    }

    init() {
        this.createWatermark();
        this.setupEventListeners();
        this.createGeometricParticles();
        console.log('🔥 NanDev Watermark Initialized');
    }

    createWatermark() {
        // Verificar se já existe
        if (document.querySelector('.nandev-watermark')) return;

        const watermark = document.createElement('a');
        watermark.href = 'https://www.linkedin.com/in/renan-de-oliveira-farias-66a9b412b/';
        watermark.target = '_blank';
        watermark.rel = 'noopener noreferrer';
        watermark.className = 'nandev-watermark';
        
        watermark.innerHTML = `
            <div class="holographic-overlay"></div>
            <div class="geometric-particles" id="particles"></div>
            
            <div class="cube-container">
                <div class="wireframe-cube">
                    <div class="cube-face front">
                        <div class="wireframe-lines">
                            <div class="inner-line horizontal-line line-1"></div>
                            <div class="inner-line horizontal-line line-2"></div>
                            <div class="inner-line horizontal-line line-3"></div>
                        </div>
                    </div>
                    <div class="cube-face back">
                        <div class="wireframe-lines">
                            <div class="inner-line vertical-line v-line-1"></div>
                            <div class="inner-line vertical-line v-line-2"></div>
                            <div class="inner-line vertical-line v-line-3"></div>
                        </div>
                    </div>
                    <div class="cube-face right">
                        <div class="wireframe-lines">
                            <div class="inner-line horizontal-line line-1"></div>
                            <div class="inner-line horizontal-line line-3"></div>
                        </div>
                    </div>
                    <div class="cube-face left">
                        <div class="wireframe-lines">
                            <div class="inner-line vertical-line v-line-1"></div>
                            <div class="inner-line vertical-line v-line-3"></div>
                        </div>
                    </div>
                    <div class="cube-face top">
                        <div class="wireframe-lines">
                            <div class="inner-line horizontal-line line-2"></div>
                        </div>
                    </div>
                    <div class="cube-face bottom">
                        <div class="wireframe-lines">
                            <div class="inner-line vertical-line v-line-2"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <span class="watermark-text">
                Desenvolvido por <span class="watermark-highlight">Nan</span>dev
            </span>
            <span class="code-symbol">&lt;/&gt;</span>
        `;

        document.body.appendChild(watermark);
    }

    setupEventListeners() {
        // Event listener para clique
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nandev-watermark')) {
                e.preventDefault();
                this.activateMatrix(e.target.closest('.nandev-watermark'));
                // Ainda permitir navegação após efeito
                setTimeout(() => {
                    window.open('https://www.linkedin.com/in/renan-de-oliveira-farias-66a9b412b/', '_blank');
                }, 2000);
            }
        });

        // Efeito de mouse 3D
        document.addEventListener('mousemove', (e) => {
            const watermark = document.querySelector('.nandev-watermark');
            if (!watermark) return;

            const cube = watermark.querySelector('.wireframe-cube');
            if (!cube) return;
            
            const rect = watermark.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / 100;
            const deltaY = (e.clientY - centerY) / 100;
            
            // Usar GSAP se disponível, senão CSS puro
            if (typeof gsap !== 'undefined') {
                gsap.to(cube, {
                    rotationX: deltaY * 5,
                    rotationY: deltaX * 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                cube.style.transform = `rotateX(${deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
            }
        });

        // Controle de teclado
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                const watermark = document.querySelector('.nandev-watermark');
                if (watermark) {
                    this.activateMatrix(watermark);
                }
            }
        });
    }

    createGeometricParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        // Limpar partículas existentes
        container.innerHTML = '';
        
        const particleCount = 6;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.animationDelay = (i * 0.5) + 's';
            particle.style.background = `hsl(${180 + i * 20}, 100%, 60%)`;
            container.appendChild(particle);
        }
    }

    activateMatrix(element) {
        const cube = element.querySelector('.wireframe-cube');
        const faces = element.querySelectorAll('.cube-face');
        const particles = element.querySelectorAll('.particle');
        const text = element.querySelector('.watermark-text');
        
        if (!cube || !faces || !text) return;

        // Usar GSAP se disponível, senão fallback CSS
        if (typeof gsap !== 'undefined') {
            // Animação com GSAP
            gsap.set(cube, { animation: 'none' });
            gsap.to(cube, {
                rotationX: 720,
                rotationY: 720,
                rotationZ: 360,
                duration: 1.5,
                ease: 'power2.inOut'
            });

            gsap.to(text, {
                scale: 1.05,
                textShadow: '0 0 10px rgba(0, 255, 136, 0.8)',
                duration: 0.3
            });

            // Reset após animação
            gsap.to(cube, {
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                duration: 0.5,
                delay: 1.5,
                ease: 'power2.out',
                onComplete: () => {
                    cube.style.animation = 'cubeRotate 8s ease-in-out infinite';
                }
            });

            gsap.to(text, {
                scale: 1,
                textShadow: 'none',
                duration: 0.3,
                delay: 1.8
            });

        } else {
            // Fallback CSS puro
            cube.style.animation = 'cubeRotate 1s ease-in-out 2';
            text.style.transform = 'scale(1.05)';
            text.style.textShadow = '0 0 10px rgba(0, 255, 136, 0.8)';
            text.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                cube.style.animation = 'cubeRotate 8s ease-in-out infinite';
                text.style.transform = 'scale(1)';
                text.style.textShadow = 'none';
            }, 2000);
        }
        
        // Intensificar faces do cubo
        faces.forEach((face, index) => {
            const colors = [
                '0,255,136',    // primary
                '0,153,255',    // secondary  
                '255,0,136',    // accent
                '0,255,136',    // left
                '255,107,53',   // top
                '196,76,255'    // bottom
            ];
            
            const originalShadow = face.style.boxShadow;
            face.style.boxShadow = `inset 0 0 20px rgba(${colors[index]}, 0.8)`;
            face.style.borderWidth = '2px';
            
            setTimeout(() => {
                face.style.boxShadow = originalShadow;
                face.style.borderWidth = '1px';
            }, 1500);
        });
        
        // Acelerar partículas
        particles.forEach(particle => {
            const originalAnimation = particle.style.animation;
            particle.style.animation = 'particleOrbit 2s linear infinite';
            
            setTimeout(() => {
                particle.style.animation = originalAnimation || 'particleOrbit 6s linear infinite';
            }, 2000);
        });
        
        // Criar mini explosão 3D
        this.createMini3DExplosion(element);
    }

    createMini3DExplosion(container) {
        const explosionCount = 8;
        const cubeContainer = container.querySelector('.cube-container');
        if (!cubeContainer) return;
        
        for (let i = 0; i < explosionCount; i++) {
            const fragment = document.createElement('div');
            fragment.style.position = 'absolute';
            fragment.style.width = '2px';
            fragment.style.height = '2px';
            fragment.style.background = `hsl(${i * 45}, 100%, 60%)`;
            fragment.style.borderRadius = '50%';
            fragment.style.left = '50%';
            fragment.style.top = '50%';
            fragment.style.zIndex = '20';
            fragment.style.boxShadow = '0 0 5px currentColor';
            
            const angle = (i / explosionCount) * Math.PI * 2;
            const distance = 15;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            cubeContainer.appendChild(fragment);
            
            // Usar GSAP se disponível
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(fragment, 
                    {
                        scale: 0,
                        opacity: 1,
                        x: -1,
                        y: -1
                    },
                    {
                        scale: 1,
                        opacity: 0,
                        x: x * 1.5,
                        y: y * 1.5,
                        duration: 1,
                        ease: 'power2.out',
                        onComplete: () => fragment.remove()
                    }
                );
            } else {
                // Fallback com CSS animations
                fragment.animate([
                    {
                        transform: 'translate(-50%, -50%) scale(0)',
                        opacity: 1
                    },
                    {
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)`,
                        opacity: 0.7
                    },
                    {
                        transform: `translate(-50%, -50%) translate(${x * 1.5}px, ${y * 1.5}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                
                setTimeout(() => fragment.remove(), 1000);
            }
        }
    }

    // Recriar partículas periodicamente
    recreateParticles() {
        setInterval(() => {
            this.createGeometricParticles();
        }, 15000);
    }
}

// Integração com o sistema existente
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que tudo carregou
    setTimeout(() => {
        const nandevWatermark = new NandevWatermark();
        nandevWatermark.recreateParticles();
    }, 1000);
});

// Fallback caso DOMContentLoaded já tenha disparado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const nandevWatermark = new NandevWatermark();
            nandevWatermark.recreateParticles();
        }, 1000);
    });
} else {
    setTimeout(() => {
        const nandevWatermark = new NandevWatermark();
        nandevWatermark.recreateParticles();
    }, 1000);
}
