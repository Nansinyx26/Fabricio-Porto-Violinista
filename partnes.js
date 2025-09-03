// =========================
// API PÚBLICA PARA GERENCIAMENTO
// =========================
const PartnersManager = {
    add: function(partnerData) {
        try {
            const newPartner = {
                id: Date.now(),
                name: partnerData.name || 'Nome não informado',
                role: partnerData.role || 'Função não informada',
                photo: partnerData.photo || '',
                description: partnerData.description || 'Descrição não informada',
                link: partnerData.link || '#',
                active: partnerData.active !== false
            };

            partnersData.push(newPartner);

            if (partnersState.loaded) {
                this.reload();
            }

            console.log('✅ Parceiro adicionado:', newPartner);
            return newPartner;
        } catch (error) {
            console.error('Erro ao adicionar parceiro:', error);
            return null;
        }
    },

    update: function(partnerId, updates) {
        try {
            const partner = partnersData.find(p => p.id === partnerId);

            if (!partner) {
                console.warn('Parceiro não encontrado:', partnerId);
                return false;
            }

            Object.keys(updates).forEach(key => {
                if (updates[key] !== undefined) {
                    partner[key] = updates[key];
                }
            });

            if (partnersState.loaded) {
                this.reload();
            }

            console.log('✅ Parceiro atualizado:', partner);
            return partner;
        } catch (error) {
            console.error('Erro ao atualizar parceiro:', error);
            return null;
        }
    },

    remove: function(partnerId) {
        try {
            const index = partnersData.findIndex(partner => partner.id === partnerId);

            if (index === -1) {
                console.warn('Parceiro não encontrado:', partnerId);
                return false;
            }

            const removedPartner = partnersData.splice(index, 1)[0];

            if (partnersState.loaded) {
                this.reload();
            }

            console.log('🗑️ Parceiro removido:', removedPartner);
            return removedPartner;
        } catch (error) {
            console.error('Erro ao remover parceiro:', error);
            return null;
        }
    },

    list: function() {
        return partnersData.map(partner => ({
            id: partner.id,
            name: partner.name,
            role: partner.role,
            active: partner.active
        }));
    },

    reload: function() {
        partnersState.loaded = false;
        partnersState.animationQueue = [];
        loadPartners();
    },

    destroy: function() {
        if (partnersState.observer) {
            partnersState.observer.disconnect();
            partnersState.observer = null;
        }
        partnersState.loaded = false;
        partnersState.animationQueue = [];
    },

    // Getter para dados (somente leitura)
    get data() {
        return [...partnersData]; // Retorna cópia para evitar mutação direta
    }
};
