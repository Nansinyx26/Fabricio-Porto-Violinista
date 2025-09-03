
// AI ASSISTANT MODULE - OTIMIZADO
// =========================

// Configurações do AI Assistant
const AI_CONFIG = {
    TYPING_DELAY: 1200,
    MESSAGE_ANIMATION_DURATION: 300,
    SCROLL_DEBOUNCE: 100
};

// Base de conhecimento otimizada
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

// Estado do chat
let chatState = {
    isOpen: false,
    isTyping: false,
    messageCount: 0
};

// =========================
// INICIALIZAÇÃO DO AI ASSISTANT
// =========================
function initializeAIAssistant() {
    const elements = getAIElements();
    if (!elements.aiToggle || !elements.aiChat) return;

    setupEventListeners(elements);
    setupQuickButtons();
    console.log('🤖 AI Assistant inicializado');
}

function getAIElements() {
    return {
        aiToggle: document.getElementById('aiToggle'),
        aiChat: document.getElementById('aiChat'),
        aiClose: document.getElementById('aiClose'),
        aiInput: document.getElementById('aiInput'),
        aiSend: document.getElementById('aiSend'),
        aiMessages: document.getElementById('aiMessages'),
        quickBtns: document.querySelectorAll('.quick-btn')
    };
}

// =========================
// EVENT LISTENERS OTIMIZADOS
// =========================
function setupEventListeners(elements) {
    // Toggle chat
    elements.aiToggle.addEventListener('click', toggleChat);
    
    // Close chat
    if (elements.aiClose) {
        elements.aiClose.addEventListener('click', closeChat);
    }
    
    // Send message
    if (elements.aiSend && elements.aiInput) {
        elements.aiSend.addEventListener('click', sendMessage);
        elements.aiInput.addEventListener('keypress', handleKeypress);
    }
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && chatState.isOpen) {
            closeChat();
        }
    });
    
    // Click outside to close on mobile
    document.addEventListener('click', function(e) {
        if (chatState.isOpen && isMobile) {
            const aiAssistant = document.querySelector('.ai-assistant');
            if (aiAssistant && !aiAssistant.contains(e.target)) {
                closeChat();
            }
        }
    });
}

function setupQuickButtons() {
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            const knowledge = aiKnowledgeBase[question];
            if (knowledge && !chatState.isTyping) {
                handleQuickQuestion(knowledge);
            }
        });
    });
}

function handleKeypress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// =========================
// CONTROLE DO CHAT
// =========================
function toggleChat() {
    if (chatState.isOpen) {
        closeChat();
    } else {
        openChat();
    }
}

function openChat() {
    const aiChat = document.getElementById('aiChat');
    if (!aiChat) return;
    
    chatState.isOpen = true;
    aiChat.classList.add('active');
    
    setTimeout(() => {
        const aiInput = document.getElementById('aiInput');
        if (aiInput) aiInput.focus();
    }, AI_CONFIG.MESSAGE_ANIMATION_DURATION);
    
    if (isMobile) {
        document.body.classList.add('ai-chat-open');
    }
    
    // Primeira mensagem de boas-vindas
    if (chatState.messageCount === 0) {
        setTimeout(() => {
            addBotMessage("Olá! Sou o assistente do Fabricio Porto. Como posso ajudar você hoje?");
        }, 500);
    }
}

function closeChat() {
    const aiChat = document.getElementById('aiChat');
    if (!aiChat) return;
    
    chatState.isOpen = false;
    aiChat.classList.remove('active');
    document.body.classList.remove('ai-chat-open');
}

// =========================
// MENSAGENS
// =========================
function sendMessage() {
    const aiInput = document.getElementById('aiInput');
    const message = aiInput.value.trim();
    
    if (!message || chatState.isTyping) return;
    
    addUserMessage(message);
    aiInput.value = '';
    
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addBotMessage(response);
    }, AI_CONFIG.TYPING_DELAY);
}

function handleQuickQuestion(knowledge) {
    addUserMessage(knowledge.question);
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        addBotMessage(knowledge.answer);
    }, 1000);
}

function addUserMessage(message) {
    const messageDiv = createMessageElement(message, 'user-message');
    appendMessage(messageDiv);
    chatState.messageCount++;
}

function addBotMessage(message) {
    const messageDiv = createMessageElement(message, 'bot-message');
    appendMessage(messageDiv);
    chatState.messageCount++;
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

function appendMessage(messageDiv) {
    const aiMessages = document.getElementById('aiMessages');
    if (!aiMessages) return;
    
    aiMessages.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const aiMessages = document.getElementById('aiMessages');
    if (!aiMessages) return;
    
    requestAnimationFrame(() => {
        aiMessages.scrollTop = aiMessages.scrollHeight;
    });
}

// =========================
// TYPING INDICATOR
// =========================
function showTypingIndicator() {
    if (chatState.isTyping) return;
    
    chatState.isTyping = true;
    
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
    
    appendMessage(typingDiv);
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    chatState.isTyping = false;
}

// =========================
// GERAÇÃO DE RESPOSTAS
// =========================
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Keywords mapping otimizado
    const keywords = {
        'preço': 'precos', 'valor': 'precos', 'custo': 'precos', 'quanto': 'precos',
        'repertório': 'repertorio', 'música': 'repertorio', 'tocar': 'repertorio', 'canção': 'repertorio',
        'casamento': 'casamento', 'noiva': 'casamento', 'cerimônia': 'casamento',
        'disponível': 'disponibilidade', 'data': 'disponibilidade', 'agenda': 'disponibilidade'
    };
    
    // Buscar por keywords
    for (const [keyword, category] of Object.entries(keywords)) {
        if (message.includes(keyword)) {
            return aiKnowledgeBase[category].answer;
        }
    }
    
    // Saudações
    if (/^(olá|oi|bom dia|boa tarde|boa noite|ola)/.test(message)) {
        return "Olá! Seja bem-vindo(a)! Sou o assistente do Fabricio Porto. Posso ajudar com informações sobre apresentações, repertório, preços e disponibilidade. Como posso ajudar você?";
    }
    
    // Agradecimentos
    if (message.includes('obrigad') || message.includes('valeu') || message.includes('obrigada')) {
        return "Por nada! Foi um prazer ajudar. Se tiver mais dúvidas ou quiser agendar uma apresentação, entre em contato diretamente com o Fabricio!";
    }
    
    // Despedidas
    if (message.includes('tchau') || message.includes('até') || message.includes('adeus')) {
        return "Até logo! Foi ótimo conversar com você. Não esqueça de entrar em contato com o Fabricio para agendar sua apresentação!";
    }
    
    // Resposta padrão personalizada
    return `Entendo sua pergunta! Para informações mais específicas sobre "${userMessage}", recomendo entrar em contato diretamente com o Fabricio Porto pelo WhatsApp (19) 99901-1288 ou pelo e-mail fabricioportoviolinista@gmail.com. Ele poderá te ajudar com todos os detalhes!`;
}

// =========================
// MOBILE OPTIMIZATIONS
// =========================
function optimizeForMobile() {
    if (!isMobile) return;
    
    const aiChat = document.getElementById('aiChat');
    if (!aiChat) return;
    
    // Ajustar altura do chat no mobile
    const updateChatHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        if (chatState.isOpen) {
            aiChat.style.height = `calc(var(--vh, 1vh) * 70)`;
        }
    };
    
    window.addEventListener('resize', debounce(updateChatHeight, 150));
    window.addEventListener('orientationchange', updateChatHeight);
    
    updateChatHeight();
}

// =========================
// PERFORMANCE OPTIMIZATIONS
// =========================
function optimizePerformance() {
    // Lazy load do chat apenas quando necessário
    if (chatState.messageCount === 0) {
        const aiMessages = document.getElementById('aiMessages');
        if (aiMessages) {
            aiMessages.style.contain = 'layout style paint';
        }
    }
    
    // Cleanup de mensagens antigas se houver muitas
    if (chatState.messageCount > 50) {
        cleanupOldMessages();
    }
}

function cleanupOldMessages() {
    const aiMessages = document.getElementById('aiMessages');
    if (!aiMessages) return;
    
    const messages = aiMessages.querySelectorAll('.ai-message');
    if (messages.length > 30) {
        for (let i = 0; i < messages.length - 30; i++) {
            messages[i].remove();
        }
        chatState.messageCount = 30;
    }
}

// =========================
// ACCESSIBILITY
// =========================
function enhanceAccessibility() {
    const aiToggle = document.getElementById('aiToggle');
    const aiChat = document.getElementById('aiChat');
    
    if (aiToggle) {
        aiToggle.setAttribute('aria-label', 'Abrir assistente virtual');
        aiToggle.setAttribute('aria-expanded', 'false');
    }
    
    if (aiChat) {
        aiChat.setAttribute('role', 'dialog');
        aiChat.setAttribute('aria-label', 'Chat do assistente virtual');
        aiChat.setAttribute('aria-hidden', 'true');
    }
    
    // Atualizar atributos quando chat abrir/fechar
    const originalToggleChat = toggleChat;
    toggleChat = function() {
        originalToggleChat();
        
        if (aiToggle) {
            aiToggle.setAttribute('aria-expanded', chatState.isOpen.toString());
        }
        if (aiChat) {
            aiChat.setAttribute('aria-hidden', (!chatState.isOpen).toString());
        }
    };
}

// =========================
// ERROR HANDLING
// =========================
function handleChatError(error) {
    console.error('Erro no AI Assistant:', error);
    
    if (chatState.isTyping) {
        hideTypingIndicator();
        addBotMessage("Desculpe, ocorreu um erro. Tente novamente ou entre em contato diretamente pelo WhatsApp (19) 99901-1288.");
    }
}

// =========================
// CSS DINÂMICO PARA TYPING DOTS
// =========================
function injectTypingCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots {
            display: flex;
            gap: 4px;
            align-items: center;
            justify-content: center;
            padding: 5px 0;
        }
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: #d4af37;
            border-radius: 50%;
            animation: typing-bounce 1.4s infinite ease-in-out both;
        }
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        .typing-dots span:nth-child(3) { animation-delay: 0s; }
        @keyframes typing-bounce {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1.2); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
            .typing-dots span { animation: none; opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
}

// =========================
// INICIALIZAÇÃO E CLEANUP
// =========================
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeAIAssistant();
        optimizeForMobile();
        enhanceAccessibility();
        injectTypingCSS();
        
        // Wrap funções principais com error handling
        const originalSendMessage = sendMessage;
        sendMessage = function() {
            try {
                originalSendMessage();
            } catch (error) {
                handleChatError(error);
            }
        };
        
        const originalHandleQuickQuestion = handleQuickQuestion;
        handleQuickQuestion = function(knowledge) {
            try {
                originalHandleQuickQuestion(knowledge);
            } catch (error) {
                handleChatError(error);
            }
        };
        
    } catch (error) {
        console.error('Erro ao inicializar AI Assistant:', error);
    }
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', function() {
    chatState.isOpen = false;
    document.body.classList.remove('ai-chat-open');
});

// =========================
// DEBUGGING (apenas em desenvolvimento)
// =========================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugAI = function() {
        console.log('=== DEBUG AI ASSISTANT ===');
        console.log('Chat State:', chatState);
        console.log('Message Count:', chatState.messageCount);
        console.log('Is Mobile:', isMobile);
        console.log('Knowledge Base:', Object.keys(aiKnowledgeBase));
        console.log('========================');
    };
}