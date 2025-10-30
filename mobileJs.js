// ==========================================================================
// mobileJs.js - Lógicas JavaScript Específicas para Mobile
// ==========================================================================

(function() {
    'use strict';

    // Detectar se é mobile
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
        console.log('⚠️ Mobile JS não executado - não é dispositivo móvel');
        return;
    }

    console.log('📱 Mobile JS inicializado');

    // =========================
    // CONFIGURAÇÕES MOBILE
    // =========================
    const MOBILE_CONFIG = {
        TYPING_SPEED: {
            TYPING: 80,      // Mais lento em mobile
            DELETING: 40,
            PAUSE: 1500
        },
        AI_RESPONSE_DELAY: 1500,  // Mais tempo para simular digitação
        SCROLL_THRESHOLD: 80,      // Threshold menor para navbar
        BACK_TO_TOP_THRESHOLD: 400 // Threshold menor para botão
    };

    // =========================
    // CORREÇÃO DO MENU HAMBURGUER
    // =========================
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const navItems = navLinks?.querySelectorAll('a');

        if (!hamburger || !navLinks) {
            console.warn('⚠️ Elementos do menu não encontrados');
            return;
        }

        // Toggle menu
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            
            // Prevenir scroll do body quando menu aberto
            if (isActive) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });

        // Fechar menu ao clicar em link
        navItems?.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });

        console.log('✅ Menu mobile configurado');
    }

    // =========================
    // SCROLL HANDLERS MOBILE
    // =========================
    function initMobileScrollHandlers() {
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('backToTop');

        let lastScroll = 0;
        let ticking = false;

        function handleScroll() {
            const scrolled = window.pageYOffset;

            // Navbar
            if (navbar) {
                navbar.classList.toggle('scrolled', scrolled > MOBILE_CONFIG.SCROLL_THRESHOLD);
            }

            // Back to top
            if (backToTop) {
                backToTop.classList.toggle('visible', scrolled > MOBILE_CONFIG.BACK_TO_TOP_THRESHOLD);
            }

            lastScroll = scrolled;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });

        console.log('✅ Scroll handlers mobile configurados');
    }

    // =========================
    // AI ASSISTANT MOBILE
    // =========================
    function initMobileAIAssistant() {
        const aiToggle = document.getElementById('aiToggle');
        const aiChat = document.getElementById('aiChat');
        const aiClose = document.getElementById('aiClose');
        const aiInput = document.getElementById('aiInput');
        const aiSend = document.getElementById('aiSend');
        const quickBtns = document.querySelectorAll('.quick-btn');

        if (!aiToggle || !aiChat) {
            console.warn('⚠️ AI Assistant não encontrado');
            return;
        }

        let chatOpen = false;

        // Toggle chat
        aiToggle.addEventListener('click', function() {
            chatOpen = !chatOpen;
            aiChat.classList.toggle('active', chatOpen);
            aiChat.setAttribute('aria-hidden', !chatOpen);

            if (chatOpen) {
                document.body.classList.add('ai-chat-open');
                setTimeout(() => aiInput?.focus(), 300);
            } else {
                document.body.classList.remove('ai-chat-open');
            }
        });

        // Close chat
        aiClose?.addEventListener('click', function() {
            chatOpen = false;
            aiChat.classList.remove('active');
            aiChat.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('ai-chat-open');
        });

        // Send message
        function sendMessage() {
            const message = aiInput?.value.trim();
            if (!message || window.isTyping) return;

            window.addUserMessage(message);
            aiInput.value = '';

            window.showTypingIndicator();
            
            setTimeout(() => {
                window.hideTypingIndicator();
                const response = window.generateAIResponse(message);
                window.addBotMessage(response);
            }, MOBILE_CONFIG.AI_RESPONSE_DELAY);
        }

        aiSend?.addEventListener('click', sendMessage);
        aiInput?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Quick buttons
        quickBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const question = this.dataset.question;
                const knowledge = window.aiKnowledgeBase[question];
                
                if (knowledge && !window.isTyping) {
                    window.addUserMessage(knowledge.question);
                    window.showTypingIndicator();
                    
                    setTimeout(() => {
                        window.hideTypingIndicator();
                        window.addBotMessage(knowledge.answer);
                    }, MOBILE_CONFIG.AI_RESPONSE_DELAY);
                }
            });
        });

        console.log('✅ AI Assistant mobile configurado');
    }

    // =========================
    // VIEWPORT HEIGHT FIX (iOS)
    // =========================
    function fixViewportHeight() {
        function setVH() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);

        console.log('✅ Viewport height corrigido');
    }

    // =========================
    // CORREÇÃO DA LOGO MOBILE
    // =========================
    function fixMobileLogo() {
        const fpNote = document.querySelector('.fp-musical-note');
        const fpLogo = document.querySelector('.fp-logo');
        const fpContainer = document.querySelector('.fp-logo-container');

        if (fpNote && fpLogo && fpContainer) {
            // Garantir visibilidade
            fpNote.style.display = 'flex';
            fpNote.style.position = 'static';
            fpNote.style.transform = 'none';
            fpNote.style.margin = '0 auto 2rem';
            fpNote.style.order = '1';
            fpNote.style.width = '100%';
            fpNote.style.justifyContent = 'center';

            fpContainer.style.display = 'flex';
            fpContainer.style.alignItems = 'center';
            fpContainer.style.justifyContent = 'center';
            fpContainer.style.width = '180px';
            fpContainer.style.height = '180px';
            fpContainer.style.margin = '0 auto';

            fpLogo.style.display = 'block';
            fpLogo.style.width = '160px';
            fpLogo.style.height = '160px';
            fpLogo.style.maxWidth = '160px';
            fpLogo.style.maxHeight = '160px';
            fpLogo.style.objectFit = 'contain';
            fpLogo.style.opacity = '1';
            fpLogo.style.visibility = 'visible';

            console.log('✅ Logo mobile corrigida');
        } else {
            console.warn('⚠️ Elementos da logo não encontrados');
        }
    }

    // =========================
    // TOUCH GESTURES
    // =========================
    function initTouchGestures() {
        // Feedback tátil para botões
        const buttons = document.querySelectorAll('.btn, .contact-btn, .quick-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            }, { passive: true });

            btn.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });
        });

        console.log('✅ Touch gestures configurados');
    }

    // =========================
    // PREVENT ZOOM ON INPUT FOCUS (iOS)
    // =========================
    function preventZoomOnInputFocus() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        });

        console.log('✅ Prevenção de zoom configurada');
    }

    // =========================
    // ORIENTAÇÃO
    // =========================
    function handleOrientationChange() {
        window.addEventListener('orientationchange', function() {
            // Recarregar viewport height
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);

            // Ajustar logo se necessário
            fixMobileLogo();
        });

        console.log('✅ Handler de orientação configurado');
    }

    // =========================
    // INICIALIZAÇÃO
    // =========================
    function init() {
        // Aguardar DOM estar completamente carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        try {
            fixViewportHeight();
            fixMobileLogo();
            initMobileMenu();
            initMobileScrollHandlers();
            initMobileAIAssistant();
            initTouchGestures();
            preventZoomOnInputFocus();
            handleOrientationChange();

            console.log('✅ Mobile JS completamente inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar Mobile JS:', error);
        }
    }

    // Iniciar
    init();

    // Cleanup
    window.addEventListener('beforeunload', function() {
        document.body.classList.remove('menu-open', 'ai-chat-open');
    });

})();
