/**
 * CONTACT-FORM-EMAILJS.JS - FABRICIO PORTO VIOLINISTA
 * Integração de formulário de contato com EmailJS
 * Versão com notificações e confirmação visual
 */

// ============================================
// CONFIGURAÇÃO - SUBSTITUA COM SUAS CREDENCIAIS DO EMAILJS
// ============================================
const EMAILJS_CONFIG = {
    serviceID: 'service_ohh5le8',           // Obtenha em emailjs.com
    templateID_Owner: 'template_eatwnrk',    // Template para você receber
    templateID_Client: 'template_xq1c17j', // Template de confirmação para cliente
    publicKey: 'Z9E4cdnYRHMGW6MCE'             // Sua chave pública
};

// ============================================
// VARIÁVEIS DE CONTROLE
// ============================================
let emailJSLoaded = false;

// ============================================
// FUNÇÃO: CARREGA EMAILJS
// ============================================
function loadEmailJS() {
    return new Promise((resolve, reject) => {
        if (window.emailjs && emailJSLoaded) {
            console.log('EmailJS já carregado');
            resolve();
            return;
        }
        
        console.log('Carregando EmailJS...');
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.type = 'text/javascript';
        
        const timeout = setTimeout(() => {
            reject(new Error('Timeout ao carregar EmailJS'));
        }, 10000);
        
        script.onload = () => {
            clearTimeout(timeout);
            
            if (window.emailjs) {
                try {
                    emailjs.init(EMAILJS_CONFIG.publicKey);
                    emailJSLoaded = true;
                    console.log('EmailJS inicializado com sucesso');
                    resolve();
                } catch (error) {
                    reject(new Error('Erro ao inicializar EmailJS: ' + error.message));
                }
            } else {
                reject(new Error('EmailJS não disponível'));
            }
        };
        
        script.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Falha ao carregar EmailJS'));
        };
        
        document.head.appendChild(script);
    });
}

// ============================================
// FUNÇÃO: VALIDA CONFIGURAÇÃO
// ============================================
function validateConfig() {
    const errors = [];
    
    if (EMAILJS_CONFIG.serviceID === 'SEU_SERVICE_ID' || !EMAILJS_CONFIG.serviceID) {
        errors.push('Service ID não configurado');
    }
    
    if (EMAILJS_CONFIG.templateID_Owner === 'SEU_TEMPLATE_ID' || !EMAILJS_CONFIG.templateID_Owner) {
        errors.push('Template ID não configurado');
    }
    
    if (EMAILJS_CONFIG.publicKey === 'SUA_PUBLIC_KEY' || !EMAILJS_CONFIG.publicKey) {
        errors.push('Public Key não configurada');
    }
    
    if (errors.length > 0) {
        console.error('ERROS DE CONFIGURAÇÃO:', errors);
        showNotification('Configure o EmailJS: ' + errors.join(', '), 'error');
        return false;
    }
    
    console.log('Configuração válida');
    return true;
}

// ============================================
// FUNÇÃO: INICIALIZA FORMULÁRIO
// ============================================
async function initContactForm() {
    console.log('Inicializando formulário de contato...');
    
    const form = document.getElementById('contactForm');
    
    if (!form) {
        console.error('Formulário não encontrado!');
        return;
    }
    
    console.log('Formulário encontrado');
    
    if (!validateConfig()) {
        console.warn('Configure suas credenciais EmailJS no arquivo contact-form-email.js');
        return;
    }
    
    try {
        await loadEmailJS();
        showNotification('Sistema de email pronto!', 'success', 3000);
    } catch (error) {
        console.error('Erro ao carregar EmailJS:', error.message);
        showNotification('Erro ao carregar sistema de email', 'error');
        return;
    }

    form.addEventListener('submit', handleFormSubmit);
    
    console.log('Formulário pronto para envios');
}

// ============================================
// FUNÇÃO: PROCESSA ENVIO DO FORMULÁRIO
// ============================================
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Formulário submetido');
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    if (!submitBtn) {
        console.error('Botão de submit não encontrado');
        return;
    }
    
    const originalText = submitBtn.innerHTML;
    
    if (!window.emailjs || !emailJSLoaded) {
        showNotification('Sistema não inicializado. Recarregue a página.', 'error');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        const formData = collectFormData(form);
        
        if (!formData) {
            throw new Error('Dados do formulário inválidos');
        }
        
        console.log('Enviando emails...');
        
        // Envia email para você (proprietário)
        const responseOwner = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID_Owner,
            formData
        );
        
        console.log('Email para proprietário enviado:', responseOwner);
        
        // Envia email de confirmação para o cliente
        if (EMAILJS_CONFIG.templateID_Client && EMAILJS_CONFIG.templateID_Client !== 'SEU_TEMPLATE_CLIENT') {
            try {
                const responseClient = await emailjs.send(
                    EMAILJS_CONFIG.serviceID,
                    EMAILJS_CONFIG.templateID_Client,
                    formData
                );
                console.log('Email de confirmação enviado:', responseClient);
            } catch (clientError) {
                console.warn('Falha ao enviar confirmação ao cliente:', clientError);
                // Não interrompe o fluxo se só o email de confirmação falhar
            }
        }
        
        console.log('MENSAGEM ENVIADA COM SUCESSO!');
        
        // Notificação de sucesso
        showNotification(
            'Mensagem enviada com sucesso! Entraremos em contato em breve.',
            'success',
            5000
        );
        
        // Reseta formulário
        form.reset();
        
        // Animação de sucesso
        celebrateSuccess();
        
        // Scroll para o topo do formulário
        document.getElementById('contact-form').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
    } catch (error) {
        console.error('ERRO AO ENVIAR:', error);
        
        let errorMsg = 'Erro ao enviar mensagem. ';
        
        if (error.text && error.text.includes('Invalid')) {
            errorMsg += 'Credenciais inválidas do EmailJS.';
        } else if (error.text && error.text.includes('not found')) {
            errorMsg += 'Template não encontrado no EmailJS.';
        } else {
            errorMsg += 'Tente novamente ou entre em contato pelo WhatsApp.';
        }
        
        showNotification(errorMsg, 'error', 8000);
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============================================
// FUNÇÃO: COLETA DADOS DO FORMULÁRIO
// ============================================
function collectFormData(form) {
    try {
        const data = {
            from_name: form.fullName?.value?.trim() || '',
            from_email: form.email?.value?.trim() || '',
            company: form.company?.value?.trim() || 'Não informado',
            phone: form.phone?.value?.trim() || 'Não informado',
            product: form.product?.options[form.product.selectedIndex]?.text || 'Não selecionado',
            message: form.message?.value?.trim() || '',
            to_name: 'Fabricio Porto',
            reply_to: form.email?.value?.trim() || ''
        };
        
        // Validações
        if (!data.from_name) {
            showNotification('Por favor, preencha seu nome', 'error');
            form.fullName.focus();
            return null;
        }
        
        if (!data.from_email) {
            showNotification('Por favor, preencha seu email', 'error');
            form.email.focus();
            return null;
        }
        
        if (!data.message) {
            showNotification('Por favor, escreva uma mensagem', 'error');
            form.message.focus();
            return null;
        }
        
        return data;
        
    } catch (error) {
        console.error('Erro ao coletar dados:', error);
        return null;
    }
}

// ============================================
// FUNÇÃO: MOSTRA NOTIFICAÇÃO FLUTUANTE
// ============================================
function showNotification(message, type = 'info', duration = 7000) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Remove notificação existente
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `form-notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-triangle' : 'info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()" aria-label="Fechar notificação">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove após duração
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('notification-exit');
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// ============================================
// FUNÇÃO: CELEBRA SUCESSO
// ============================================
function celebrateSuccess() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.classList.add('form-success');
        setTimeout(() => form.classList.remove('form-success'), 1000);
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}

console.log('Script de contato carregado - Fabricio Porto Violinista');