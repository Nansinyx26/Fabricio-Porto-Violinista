// ==========================================================================
// script_mobile.js - Lógicas JavaScript Otimizadas para Dispositivos Móveis
// Este script é carregado condicionalmente apenas em telas menores.
// ==========================================================================

// =========================
// CONFIGURAÇÕES ESPECÍFICAS PARA MOBILE
// =========================
const MOBILE_CONFIG = {
    MOBILE_BREAKPOINT: 768, // Deve ser o mesmo do CSS
    NAVBAR_HEIGHT: 80, // Altura da navbar em pixels (para cálculo de scroll)
    TYPING_SPEED_MOBILE: { // Velocidades ajustadas para o efeito de digitação em mobile
        TYPING: 50,
        DELETING: 25,
        PAUSE: 1000
    }
};

// Variáveis globais para controle de estado (específicas deste script)
let currentScrollY = 0; // Para armazenar a posição do scroll ao bloquear o body

// Cache de elementos DOM (específico para este script para evitar conflitos e otimizar)
const mobileDomCache = {
    navbar: null,
    hamburger: null,
    navLinks: null,
    aiChat: null,
    aiToggle: null,
    aiClose: null,
    aiInput: null,
    aiSend: null,
    aiMessages: null,
    quickBtns: null,
    typingTextElement: null,
    backToTopBtn: null
};

// =========================
// INICIALIZAÇÃO ESPECÍFICA PARA MOBILE
// =========================
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se a largura da tela corresponde ao breakpoint mobile
    const isMobileView = window.innerWidth <= MOBILE_CONFIG.MOBILE_BREAKPOINT;

    // Este script só deve ser executado se a condição mobile for verdadeira
    // (embora já seja carregado condicionalmente pelo index.html)
    if (!isMobileView) {
        console.log('script_mobile.js: Não é um dispositivo móvel, desativando.');
        return;
    }

    initMobileDomCache();
    setupMobileNavigation();
    setupMobileAIAssistant();
    setupMobileScrollHandlers();
    adjustTypingEffectForMobile();
    setupMobileEventListeners();

    console.log('✅ script_mobile.js carregado e inicializado para mobile.');
});

// =========================
// CACHE DE ELEMENTOS DOM PARA MOBILE
// =========================
function initMobileDomCache() {
    mobileDomCache.navbar = document.getElementById('navbar');
    mobileDomCache.hamburger = document.getElementById('hamburger');
    mobileDomCache.navLinks = document.getElementById('navLinks');
    mobileDomCache.aiChat = document.getElementById('aiChat');
    mobileDomCache.aiToggle = document.getElementById('aiToggle');
    mobileDomCache.aiClose = document.getElementById('aiClose');
    mobileDomCache.aiInput = document.getElementById('aiInput');
    mobileDomCache.aiSend = document.getElementById('aiSend');
    mobileDomCache.aiMessages = document.getElementById('aiMessages');
    mobileDomCache.quickBtns = document.querySelectorAll('.quick-btn');
    mobileDomCache.typingTextElement = document.getElementById('typingText');
    mobileDomCache.backToTopBtn = document.getElementById('backToTop');
}

// =========================
// NAVEGAÇÃO MOBILE (HAMBURGUER)
// =========================
// =========================
// NAVEGAÇÃO MOBILE (HAMBURGUER)
// =========================
function setupMobileNavigation() {
    const { hamburger, navLinks } = mobileDomCache;

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', toggleMobileMenu);

        // Fecha o menu ao clicar em um link de navegação
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                closeMobileMenu();
                
                // Smooth scroll para links âncora
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - MOBILE_CONFIG.NAVBAR_HEIGHT;
                        setTimeout(() => {
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }, 300);
                    }
                }
            });
        });

        // Fecha o menu ao clicar fora do menu ou do hamburguer
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active') &&
                !hamburger.contains(event.target) &&
                !navLinks.contains(event.target)) {
                closeMobileMenu();
            }
        });

        // Fecha o menu com ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const { hamburger, navLinks } = mobileDomCache;
    if (!hamburger || !navLinks) return;

    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active', isActive);
    toggleBodyScroll(isActive);
    hamburger.setAttribute('aria-expanded', isActive);

    // Foco no primeiro link quando abre
    if (isActive) {
        setTimeout(() => {
            const firstLink = navLinks.querySelector('a');
            if (firstLink) firstLink.focus();
        }, 300);
    }
}

function closeMobileMenu() {
    const { hamburger, navLinks } = mobileDomCache;
    if (!hamburger || !navLinks) return;

    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    toggleBodyScroll(false);
    hamburger.setAttribute('aria-expanded', false);
}

// =========================
// ASSISTENTE IA MOBILE
// =========================
function setupMobileAIAssistant() {
    const { aiToggle, aiChat, aiClose, aiInput, aiMessages, quickBtns } = mobileDomCache;

    if (!aiToggle || !aiChat) return;

    aiToggle.addEventListener('click', toggleAIChat);
    if (aiClose) aiClose.addEventListener('click', closeAIChat);

    // Otimização para mobile - redimensionamento de teclado
    if (aiInput) {
        aiInput.addEventListener('focus', function() {
            // Pequeno delay para o teclado aparecer antes de rolar
            setTimeout(() => {
                if (aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;
            }, 300);
        });
    }

    // Quick buttons (reutiliza funções do script.js)
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            // Acessa a base de conhecimento e funções do script.js via window
            if (window.aiKnowledgeBase && window.addUserMessage && window.showTypingIndicator && window.addBotMessage && !window.isTyping) {
                const knowledge = window.aiKnowledgeBase[question];
                window.addUserMessage(knowledge.question);
                window.showTypingIndicator();

                setTimeout(() => {
                    window.hideTypingIndicator();
                    window.addBotMessage(knowledge.answer);
                }, MOBILE_CONFIG.TYPING_SPEED_MOBILE.PAUSE); // Usa pausa mobile para resposta
            }
        });
    });

    // Envio de mensagem (reutiliza funções do script.js)
    const aiSend = mobileDomCache.aiSend;
    if (aiSend && aiInput) {
        aiSend.addEventListener('click', function() {
            sendMessageAI(aiInput.value.trim());
        });
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessageAI(aiInput.value.trim());
            }
        });
    }
}

function toggleAIChat() {
    const { aiChat, aiInput } = mobileDomCache;
    if (!aiChat) return;

    const isActive = aiChat.classList.toggle('active');
    aiChat.setAttribute('aria-hidden', !isActive);
    toggleBodyScroll(isActive); // Bloqueia/desbloqueia o scroll do body

    if (isActive && aiInput) {
        setTimeout(() => aiInput.focus(), 300);
    }
}

function closeAIChat() {
    const { aiChat } = mobileDomCache;
    if (!aiChat) return;

    aiChat.classList.remove('active');
    aiChat.setAttribute('aria-hidden', true);
    toggleBodyScroll(false); // Desbloqueia o scroll
}

function sendMessageAI(message) {
    const { aiInput } = mobileDomCache;
    if (!message || window.isTyping) return;

    if (window.addUserMessage && window.showTypingIndicator && window.hideTypingIndicator && window.generateAIResponse && window.addBotMessage) {
        window.addUserMessage(message);
        aiInput.value = '';

        window.showTypingIndicator();

        setTimeout(() => {
            window.hideTypingIndicator();
            const response = window.generateAIResponse(message);
            window.addBotMessage(response);
        }, MOBILE_CONFIG.TYPING_SPEED_MOBILE.PAUSE); // Usa pausa mobile para resposta
    }
}

// =========================
// BLOQUEIO DE SCROLL DO BODY
// =========================
function toggleBodyScroll(shouldBlock) {
    if (shouldBlock) {
        currentScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${currentScrollY}px`;
        document.body.style.width = '100%';
        document.body.classList.add('ai-chat-open'); // Adiciona classe para correção de iOS
    } else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('ai-chat-open');
        window.scrollTo(0, currentScrollY);
    }
}

// =========================
// AJUSTE DO EFEITO DE DIGITAÇÃO
// =========================
function adjustTypingEffectForMobile() {
    // Se o objeto CONFIG global existe e tem as propriedades de velocidade
    if (window.CONFIG && window.CONFIG.TYPING_SPEED) {
        window.CONFIG.TYPING_SPEED.TYPING = MOBILE_CONFIG.TYPING_SPEED_MOBILE.TYPING;
        window.CONFIG.TYPING_SPEED.DELETING = MOBILE_CONFIG.TYPING_SPEED_MOBILE.DELETING;
        window.CONFIG.TYPING_SPEED.PAUSE = MOBILE_CONFIG.TYPING_SPEED_MOBILE.PAUSE;
        // Não é necessário reiniciar o typeWriter aqui, pois ele lerá as novas configurações
        // na próxima iteração, assumindo que ele usa window.CONFIG.
    }
}

// =========================
// SCROLL HANDLERS MOBILE
// =========================
function setupMobileScrollHandlers() {
    const { navbar, backToTopBtn } = mobileDomCache;

    const handleScroll = () => {
        const scrolled = window.scrollY;

        // Atualiza navbar
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled > 50); // Menor threshold para mobile
        }

        // Atualiza botão "Voltar ao topo"
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrolled > 300); // Menor threshold para mobile
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// =========================
// EVENT LISTENERS GERAIS PARA MOBILE
// =========================
function setupMobileEventListeners() {
    // Otimização de performance com Visibility API (reforço, pois já está no script.js)
    document.addEventListener('visibilitychange', function() {
        const isHidden = document.hidden;
        // Apenas elementos que ainda podem ter animação em mobile (ex: pulse-ring)
        const animatedElements = document.querySelectorAll('.pulse-ring'); 

        if (isHidden) {
            animatedElements.forEach(element => element.style.animationPlayState = 'paused');
        } else {
            animatedElements.forEach(element => element.style.animationPlayState = 'running');
        }
    });

    // Orientação para mobile (reforço, pois já está no script.js)
    window.addEventListener('orientationchange', function() {
        // Atualiza a variável --vh para corrigir o viewport height em mobile
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    // Feedback tátil para botões em mobile (já no script.js, mas pode ser reforçado aqui se necessário)
    document.querySelectorAll('.contact-btn, .btn, .quick-btn, .ai-toggle, .ai-close, .ai-input button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });

        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
    });
}
