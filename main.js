// =========================
// DADOS DOS PARCEIROS - EDITÁVEL
// =========================

const partnersData = [
    {
        id: 1,
        name: "Maria Silva",
        role: "Pianista e Arranjadora",
        photo: "maria-silva.jpg", // Coloque a URL da foto aqui
        description: "Especialista em música clássica e popular, com mais de 15 anos de experiência em arranjos musicais para violino e piano.",
        link: "https://example.com/maria-silva", // Link para portfolio/site
        active: true
    },
    {
        id: 2,
        name: "João Santos",
        role: "Fotógrafo de Eventos",
        photo: "joao-santos.jpg",
        description: "Fotógrafo profissional especializado em capturar momentos únicos durante apresentações musicais e eventos corporativos.",
        link: "https://example.com/joao-santos",
        active: true
    },
    {
        id: 3,
        name: "Ana Costa",
        role: "Produtora Musical",
        photo: "ana-costa.jpg",
        description: "Produtora experiente na organização de eventos musicais, casamentos e apresentações corporativas de alto nível.",
        link: "https://example.com/ana-costa",
        active: true
    }
   
    
];

// =========================
// CONFIGURAÇÕES
// =========================

const CONFIG_PARTNERS = {
    ANIMATION_DELAY: 200, // Delay entre animações dos cards
    LOADING_MIN_TIME: 800, // Tempo mínimo de loading
    CARD_ANIMATION_DURATION: 600, // Duração da animação dos cards
    INTERSECTION_THRESHOLD: 0.1 // Threshold do Intersection Observer
};

// =========================
// VARIÁVEIS GLOBAIS
// =========================

let partnersLoaded = false;
let partnersObserver = null;

// =========================
// INICIALIZAÇÃO
// =========================

document.addEventListener('DOMContentLoaded', function() {
    initializePartners();
    setupPartnersObserver();
});

// =========================
// FUNÇÕES PRINCIPAIS
// =========================

/**
 * Inicializa a seção de parceiros
 */
function initializePartners() {
    try {
        // Verificar se os elementos existem
        const partnersGrid = document.getElementById('partnersGrid');
        const partnersLoading = document.getElementById('partnersLoading');
        const partnersEmpty = document.getElementById('partnersEmpty');

        if (!partnersGrid || !partnersLoading || !partnersEmpty) {
            console.warn('Elementos da seção parceiros não encontrados');
            return;
        }

        // Mostrar loading inicialmente
        showPartnersLoading();

        // Carregar parceiros após um pequeno delay para UX
        setTimeout(() => {
            loadPartners();
        }, CONFIG_PARTNERS.LOADING_MIN_TIME);

    } catch (error) {
        console.error('Erro ao inicializar parceiros:', error);
        showPartnersError();
    }
}

/**
 * Carrega e renderiza os parceiros
 */
function loadPartners() {
    try {
        const activePartners = partnersData.filter(partner => partner.active);
        
        if (activePartners.length === 0) {
            showPartnersEmpty();
            return;
        }

        renderPartners(activePartners);
        hidePartnersLoading();
        partnersLoaded = true;

        console.log(`✅ ${activePartners.length} parceiros carregados com sucesso`);

    } catch (error) {
        console.error('Erro ao carregar parceiros:', error);
        showPartnersError();
    }
}

/**
 * Renderiza os cards dos parceiros
 */
function renderPartners(partners) {
    const partnersGrid = document.getElementById('partnersGrid');
    if (!partnersGrid) return;

    partnersGrid.innerHTML = '';

    partners.forEach((partner, index) => {
        const card = createPartnerCard(partner);
        partnersGrid.appendChild(card);

        // Animar cards com delay escalonado
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * CONFIG_PARTNERS.ANIMATION_DELAY);
    });
}

/**
 * Cria um card de parceiro
 */
function createPartnerCard(partner) {
    const card = document.createElement('div');
    card.className = 'partner-card';
    card.setAttribute('data-partner-id', partner.id);

    // Criar estrutura do card
    card.innerHTML = `
        <div class="partner-photo-container">
            <div class="partner-photo-inner">
                ${partner.photo ? `<img src="${partner.photo}" alt="${partner.name}" class="partner-photo" loading="lazy" onerror="handlePartnerPhotoError(this)">` : ''}
                <div class="partner-photo-placeholder">
                    <i class="fas fa-user" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        
        <h3 class="partner-name">${escapeHtml(partner.name)}</h3>
        
        <p class="partner-role">${escapeHtml(partner.role)}</p>
        
        <p class="partner-description">${escapeHtml(partner.description)}</p>
        
        <a href="${partner.link}" 
           class="partner-link" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Saiba mais sobre ${partner.name}">
            <span>Saiba mais</span>
            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
    `;

    // Adicionar event listeners
    addCardEventListeners(card, partner);

    return card;
}

/**
 * Adiciona event listeners ao card
 */
function addCardEventListeners(card, partner) {
    const link = card.querySelector('.partner-link');
    
    if (link) {
        // Analytics/tracking (opcional)
        link.addEventListener('click', function(e) {
            trackPartnerClick(partner);
        });

        // Acessibilidade - Enter key
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
    }

    // Efeito de foco no card inteiro
    card.addEventListener('mouseenter', function() {
        this.classList.add('hover');
    });

    card.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
    });
}

/**
 * Gerencia erro de carregamento de foto
 */
function handlePartnerPhotoError(img) {
    if (img && img.parentNode) {
        img.style.display = 'none';
        const placeholder = img.parentNode.querySelector('.partner-photo-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
}

/**
 * Configura Intersection Observer para animações
 */
function setupPartnersObserver() {
    if (!window.IntersectionObserver) return;

    const partnersSection = document.getElementById('partners');
    if (!partnersSection) return;

    partnersObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !partnersLoaded) {
                    // Força o carregamento se ainda não foi carregado
                    if (!partnersLoaded) {
                        loadPartners();
                    }
                    partnersObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: CONFIG_PARTNERS.INTERSECTION_THRESHOLD,
            rootMargin: '50px 0px'
        }
    );

    partnersObserver.observe(partnersSection);
}

// =========================
// FUNÇÕES DE ESTADO
// =========================

function showPartnersLoading() {
    const loading = document.getElementById('partnersLoading');
    const empty = document.getElementById('partnersEmpty');
    const grid = document.getElementById('partnersGrid');
    
    if (loading) loading.style.display = 'block';
    if (empty) empty.style.display = 'none';
    if (grid) grid.style.display = 'none';
}

function hidePartnersLoading() {
    const loading = document.getElementById('partnersLoading');
    const grid = document.getElementById('partnersGrid');
    
    if (loading) loading.style.display = 'none';
    if (grid) {
        grid.style.display = 'grid';
        // Trigger reflow para animações
        grid.offsetHeight;
    }
}

function showPartnersEmpty() {
    const loading = document.getElementById('partnersLoading');
    const empty = document.getElementById('partnersEmpty');
    const grid = document.getElementById('partnersGrid');
    
    if (loading) loading.style.display = 'none';
    if (empty) empty.style.display = 'block';
    if (grid) grid.style.display = 'none';
}

function showPartnersError() {
    const loading = document.getElementById('partnersLoading');
    const empty = document.getElementById('partnersEmpty');
    const grid = document.getElementById('partnersGrid');
    
    if (loading) {
        loading.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Erro ao carregar parceiros. Tente novamente mais tarde.</p>
            </div>
        `;
    }
    if (empty) empty.style.display = 'none';
    if (grid) grid.style.display = 'none';
}

// =========================
// FUNÇÕES UTILITÁRIAS
// =========================

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Tracking de cliques (opcional - para analytics)
 */
function trackPartnerClick(partner) {
    // Aqui você pode adicionar código de tracking/analytics
    console.log(`Clique no parceiro: ${partner.name}`);
    
    // Exemplo para Google Analytics (se configurado):
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'partner_click', {
    //         partner_name: partner.name,
    //         partner_role: partner.role
    //     });
    // }
}

/**
 * Função pública para adicionar novos parceiros (via console/admin)
 */
function addPartner(partnerData) {
    try {
        const newPartner = {
            id: Date.now(), // ID único baseado em timestamp
            name: partnerData.name || 'Nome não informado',
            role: partnerData.role || 'Função não informada',
            photo: partnerData.photo || '',
            description: partnerData.description || 'Descrição não informada',
            link: partnerData.link || '#',
            active: partnerData.active !== false
        };

        partnersData.push(newPartner);
        
        // Recarregar se já foi carregado
        if (partnersLoaded) {
            loadPartners();
        }

        console.log('✅ Parceiro adicionado:', newPartner);
        return newPartner;

    } catch (error) {
        console.error('Erro ao adicionar parceiro:', error);
        return null;
    }
}

/**
 * Função pública para remover parceiros
 */
function removePartner(partnerId) {
    try {
        const index = partnersData.findIndex(partner => partner.id === partnerId);
        
        if (index === -1) {
            console.warn('Parceiro não encontrado:', partnerId);
            return false;
        }

        const removedPartner = partnersData.splice(index, 1)[0];
        
        // Recarregar se já foi carregado
        if (partnersLoaded) {
            loadPartners();
        }

        console.log('✅ Parceiro removido:', removedPartner);
        return true;

    } catch (error) {
        console.error('Erro ao remover parceiro:', error);
        return false;
    }
}

/**
 * Função pública para atualizar parceiros
 */
function updatePartner(partnerId, updates) {
    try {
        const partner = partnersData.find(p => p.id === partnerId);
        
        if (!partner) {
            console.warn('Parceiro não encontrado:', partnerId);
            return false;
        }

        // Atualizar propriedades
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                partner[key] = updates[key];
            }
        });

        // Recarregar se já foi carregado
        if (partnersLoaded) {
            loadPartners();
        }

        console.log('✅ Parceiro atualizado:', partner);
        return partner;

    } catch (error) {
        console.error('Erro ao atualizar parceiro:', error);
        return null;
    }
}

/**
 * Função pública para listar todos os parceiros
 */
function listPartners() {
    return partnersData.map(partner => ({
        id: partner.id,
        name: partner.name,
        role: partner.role,
        active: partner.active
    }));
}

// =========================
// CLEANUP E PERFORMANCE
// =========================

/**
 * Cleanup ao sair da página
 */
window.addEventListener('beforeunload', function() {
    if (partnersObserver) {
        partnersObserver.disconnect();
        partnersObserver = null;
    }
});

/**
 * Cleanup para SPA (Single Page Applications)
 */
function destroyPartners() {
    if (partnersObserver) {
        partnersObserver.disconnect();
        partnersObserver = null;
    }
    partnersLoaded = false;
}

// =========================
// EXPOSIÇÃO DE FUNÇÕES PÚBLICAS
// =========================

// Expor funções úteis globalmente para facilitar administração
window.PartnersManager = {
    add: addPartner,
    remove: removePartner,
    update: updatePartner,
    list: listPartners,
    reload: loadPartners,
    destroy: destroyPartners,
    data: partnersData // Somente leitura - não modificar diretamente
};

// =========================
// DEBUG E DESENVOLVIMENTO
// =========================

// Função para debug (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugPartners = function() {
        console.log('=== DEBUG PARCEIROS ===');
        console.log('Parceiros carregados:', partnersLoaded);
        console.log('Total de parceiros:', partnersData.length);
        console.log('Parceiros ativos:', partnersData.filter(p => p.active).length);
        console.log('Dados:', partnersData);
        console.log('Observer ativo:', !!partnersObserver);
        console.log('=======================');
    };
}
