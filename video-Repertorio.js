// =========================
// REPERTÓRIO MUSICAL
// =========================

(function() {
    'use strict';

    // Base de dados de músicas
    const musicDatabase = [
        {
            id: 1,
            title: "Pachelbel - Canon",
            videoId: "Nx5F1BdkTLY",
            thumbnail: "https://img.youtube.com/vi/Nx5F1BdkTLY/maxresdefault.jpg"
        }
        // Adicione mais músicas aqui seguindo o mesmo formato:
        // {
        //     id: 2,
        //     title: "Nome da Música",
        //     videoId: "ID_DO_VIDEO",
        //     thumbnail: "https://img.youtube.com/vi/ID_DO_VIDEO/maxresdefault.jpg"
        // }
    ];

    // Cache de elementos
    const elements = {
        searchInput: null,
        autocompleteList: null,
        musicGrid: null,
        noResults: null,
        videoModal: null,
        videoPlayer: null,
        videoTitle: null,
        closeBtn: null
    };

    // Estado
    let currentVideoId = null;
    let filteredMusic = [...musicDatabase];
    let autocompleteIndex = -1;

    // Inicialização
    function init() {
        cacheElements();
        renderMusicGrid(musicDatabase);
        setupEventListeners();
        console.log('✅ Repertório inicializado com', musicDatabase.length, 'músicas');
    }

    // Cache de elementos DOM
    function cacheElements() {
        elements.searchInput = document.getElementById('searchInput');
        elements.autocompleteList = document.getElementById('autocompleteList');
        elements.musicGrid = document.getElementById('musicGrid');
        elements.noResults = document.getElementById('noResults');
        elements.videoModal = document.getElementById('videoModal');
        elements.videoPlayer = document.getElementById('videoPlayer');
        elements.videoTitle = document.getElementById('videoTitle');
        elements.closeBtn = document.getElementById('closeVideo');
    }

    // Setup de Event Listeners
    function setupEventListeners() {
        // Pesquisa
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', handleSearch);
            elements.searchInput.addEventListener('keydown', handleKeyNavigation);
            elements.searchInput.addEventListener('blur', () => {
                setTimeout(() => hideAutocomplete(), 200);
            });
        }

        // Fechar modal
        if (elements.closeBtn) {
            elements.closeBtn.addEventListener('click', closeVideoModal);
        }

        if (elements.videoModal) {
            elements.videoModal.addEventListener('click', (e) => {
                if (e.target === elements.videoModal || e.target.classList.contains('video-modal-overlay')) {
                    closeVideoModal();
                }
            });
        }

        // Tecla ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.videoModal?.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }

    // Renderizar grid de músicas
    function renderMusicGrid(musicList) {
        if (!elements.musicGrid) return;

        elements.musicGrid.innerHTML = '';
        filteredMusic = musicList;

        if (musicList.length === 0) {
            showNoResults();
            return;
        }

        hideNoResults();

        musicList.forEach((music, index) => {
            const card = createMusicCard(music, index);
            elements.musicGrid.appendChild(card);
        });
    }

    // Criar card de música
    function createMusicCard(music, index) {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.setAttribute('role', 'listitem');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Tocar ${music.title}`);

        card.innerHTML = `
            <div class="music-thumbnail">
                <img src="${music.thumbnail}" alt="${music.title}" loading="lazy">
                <div class="play-overlay">
                    <div class="play-icon">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
            </div>
            <div class="music-info">
                <h3 class="music-title">${music.title}</h3>
            </div>
        `;

        // Event listeners
        card.addEventListener('click', () => openVideoModal(music));
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openVideoModal(music);
            }
        });

        return card;
    }

    // Busca e filtro
    function handleSearch(e) {
        const query = e.target.value.trim().toLowerCase();

        if (query.length === 0) {
            renderMusicGrid(musicDatabase);
            hideAutocomplete();
            return;
        }

        // Filtrar músicas
        const filtered = musicDatabase.filter(music => 
            music.title.toLowerCase().includes(query)
        );

        renderMusicGrid(filtered);
        showAutocomplete(filtered, query);
    }

    // Mostrar autocomplete
    function showAutocomplete(results, query) {
        if (!elements.autocompleteList || results.length === 0) {
            hideAutocomplete();
            return;
        }

        elements.autocompleteList.innerHTML = '';
        autocompleteIndex = -1;

        results.slice(0, 5).forEach((music, index) => {
            const item = createAutocompleteItem(music, query, index);
            elements.autocompleteList.appendChild(item);
        });

        elements.autocompleteList.classList.add('show');
        elements.autocompleteList.setAttribute('aria-hidden', 'false');
    }

    // Criar item de autocomplete
    function createAutocompleteItem(music, query, index) {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.setAttribute('role', 'option');
        item.setAttribute('data-index', index);

        // Destacar texto correspondente
        const title = music.title;
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        const highlightedTitle = title.replace(regex, '<mark>$1</mark>');

        item.innerHTML = `
            <i class="fas fa-music"></i>
            <span>${highlightedTitle}</span>
        `;

        item.addEventListener('click', () => {
            elements.searchInput.value = music.title;
            hideAutocomplete();
            renderMusicGrid([music]);
        });

        return item;
    }

    // Navegação por teclado no autocomplete
    function handleKeyNavigation(e) {
        const items = elements.autocompleteList?.querySelectorAll('.autocomplete-item');
        if (!items || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            autocompleteIndex = Math.min(autocompleteIndex + 1, items.length - 1);
            updateAutocompleteSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            autocompleteIndex = Math.max(autocompleteIndex - 1, -1);
            updateAutocompleteSelection(items);
        } else if (e.key === 'Enter' && autocompleteIndex >= 0) {
            e.preventDefault();
            items[autocompleteIndex].click();
        }
    }

    // Atualizar seleção do autocomplete
    function updateAutocompleteSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === autocompleteIndex);
        });

        if (autocompleteIndex >= 0 && items[autocompleteIndex]) {
            items[autocompleteIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // Esconder autocomplete
    function hideAutocomplete() {
        if (elements.autocompleteList) {
            elements.autocompleteList.classList.remove('show');
            elements.autocompleteList.setAttribute('aria-hidden', 'true');
            autocompleteIndex = -1;
        }
    }

    // Mostrar/esconder mensagem de sem resultados
    function showNoResults() {
        if (elements.noResults) {
            elements.noResults.style.display = 'block';
        }
    }

    function hideNoResults() {
        if (elements.noResults) {
            elements.noResults.style.display = 'none';
        }
    }

    // Abrir modal de vídeo
    function openVideoModal(music) {
        if (!elements.videoModal || !elements.videoPlayer) return;

        currentVideoId = music.videoId;

        // Construir URL do YouTube com autoplay
        const embedUrl = `https://www.youtube.com/embed/${music.videoId}?autoplay=1&rel=0&modestbranding=1`;
        
        elements.videoPlayer.src = embedUrl;
        elements.videoTitle.textContent = music.title;
        elements.videoModal.classList.add('active');
        elements.videoModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Focar no botão de fechar
        setTimeout(() => {
            elements.closeBtn?.focus();
        }, 300);

        // Analytics (se disponível)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_play', {
                'event_category': 'Repertório',
                'event_label': music.title,
                'video_id': music.videoId
            });
        }
    }

    // Fechar modal de vídeo
    function closeVideoModal() {
        if (!elements.videoModal || !elements.videoPlayer) return;

        elements.videoModal.classList.remove('active');
        elements.videoModal.setAttribute('aria-hidden', 'true');
        elements.videoPlayer.src = '';
        document.body.classList.remove('modal-open');
        currentVideoId = null;

        // Retornar foco para o input de busca
        elements.searchInput?.focus();
    }

    // Utilitários
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expor funções globalmente se necessário
    window.RepertoireManager = {
        addMusic: function(music) {
            if (music.id && music.title && music.videoId) {
                musicDatabase.push(music);
                renderMusicGrid(musicDatabase);
                console.log('✅ Música adicionada:', music.title);
            }
        },
        removeMusic: function(id) {
            const index = musicDatabase.findIndex(m => m.id === id);
            if (index !== -1) {
                musicDatabase.splice(index, 1);
                renderMusicGrid(musicDatabase);
                console.log('✅ Música removida');
            }
        },
        getMusicDatabase: function() {
            return [...musicDatabase];
        }
    };

})();