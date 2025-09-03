// =========================
// UTILITIES OTIMIZADAS - FABRICIO PORTO WEBSITE
// =========================

// =========================
// PERFORMANCE UTILITIES
// =========================

// Cache para evitar recálculos
const performanceCache = {
    deviceInfo: null,
    screenSize: null,
    connectionType: null
};

// Throttle otimizado com requestAnimationFrame
function throttleRAF(func) {
    let ticking = false;
    return function(...args) {
        if (!ticking) {
            requestAnimationFrame(() => {
                func.apply(this, args);
                ticking = false;
            });
            ticking = true;
        }
    };
}

// Debounce com cleanup automático
function debounceWithCleanup(func, wait, immediate = false) {
    let timeout;
    const debounced = function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
    
    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };
    
    return debounced;
}

// =========================
// DEVICE DETECTION AVANÇADA
// =========================
function getDeviceInfo() {
    if (performanceCache.deviceInfo) {
        return performanceCache.deviceInfo;
    }

    const info = {
        // Screen info
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        
        // Device capabilities
        cores: navigator.hardwareConcurrency || 4,
        memory: navigator.deviceMemory || 4,
        connectionType: getConnectionType(),
        
        // Device type
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /iPad|Android(?=.*Mobile)/i.test(navigator.userAgent),
        isDesktop: !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        
        // Browser capabilities
        supportsWebP: supportsWebPFormat(),
        supportsIntersectionObserver: 'IntersectionObserver' in window,
        supportsRequestIdleCallback: 'requestIdleCallback' in window,
        
        // Performance classification
        isLowEnd: isLowEndDevice(),
        performanceClass: getPerformanceClass()
    };

    performanceCache.deviceInfo = info;
    return info;
}

function getConnectionType() {
    if (!navigator.connection) return 'unknown';
    return navigator.connection.effectiveType || navigator.connection.type || 'unknown';
}

function supportsWebPFormat() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

function isLowEndDevice() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const connection = getConnectionType();
    
    return (
        cores <= 2 ||
        memory <= 2 ||
        connection === '2g' ||
        connection === 'slow-2g' ||
        window.innerWidth <= 480
    );
}

function getPerformanceClass() {
    const device = getDeviceInfo();
    
    if (device.cores >= 8 && device.memory >= 8 && !device.isMobile) {
        return 'high';
    } else if (device.cores >= 4 && device.memory >= 4) {
        return 'medium';
    } else {
        return 'low';
    }
}

// =========================
// LAZY LOADING UTILITIES
// =========================
class LazyLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.1,
            loadingClass: options.loadingClass || 'loading',
            loadedClass: options.loadedClass || 'loaded',
            errorClass: options.errorClass || 'error'
        };
        
        this.observer = null;
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            // Fallback para browsers antigos
            this.loadAllImages();
            return;
        }

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            }
        );
    }

    observe(element) {
        if (this.observer) {
            this.observer.observe(element);
        } else {
            // Fallback
            this.loadImage(element);
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.classList.add(this.options.loadingClass);
            
            const image = new Image();
            image.onload = () => {
                img.src = img.dataset.src;
                img.classList.remove(this.options.loadingClass);
                img.classList.add(this.options.loadedClass);
                
                // Remove data-src para evitar reprocessamento
                delete img.dataset.src;
            };
            
            image.onerror = () => {
                img.classList.remove(this.options.loadingClass);
                img.classList.add(this.options.errorClass);
            };
            
            image.src = img.dataset.src;
        }
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// =========================
// ANIMATION UTILITIES
// =========================
class AnimationQueue {
    constructor() {
        this.queue = [];
        this.isRunning = false;
    }

    add(element, animationClass, delay = 0) {
        this.queue.push({ element, animationClass, delay });
        if (!this.isRunning) {
            this.process();
        }
    }

    process() {
        if (this.queue.length === 0) {
            this.isRunning = false;
            return;
        }

        this.isRunning = true;
        const { element, animationClass, delay } = this.queue.shift();

        setTimeout(() => {
            if (element && element.parentNode) {
                element.classList.add(animationClass);
            }
            this.process();
        }, delay);
    }

    clear() {
        this.queue = [];
        this.isRunning = false;
    }
}

// =========================
// DOM UTILITIES
// =========================
function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    if (options.textContent) element.textContent = options.textContent;
    
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    if (options.style) {
        Object.assign(element.style, options.style);
    }
    
    if (options.eventListeners) {
        Object.entries(options.eventListeners).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });
    }
    
    return element;
}

function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                clearTimeout(timeoutId);
                resolve(element);
            }
        });

        const timeoutId = setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// =========================
// STORAGE UTILITIES
// =========================
class StorageManager {
    constructor(prefix = 'fp_website_') {
        this.prefix = prefix;
    }

    set(key, value, expiry = null) {
        try {
            const item = {
                value: value,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + expiry : null
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.warn('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    get(key) {
        try {
            const itemStr = localStorage.getItem(this.prefix + key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);
            
            // Verificar expiração
            if (item.expiry && Date.now() > item.expiry) {
                this.remove(key);
                return null;
            }

            return item.value;
        } catch (error) {
            console.warn('Erro ao ler do localStorage:', error);
            return null;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.warn('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.warn('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    size() {
        return Object.keys(localStorage).filter(key => 
            key.startsWith(this.prefix)
        ).length;
    }
}

// =========================
// ERROR HANDLING
// =========================
class ErrorManager {
    constructor(options = {}) {
        this.options = {
            logToConsole: options.logToConsole !== false,
            logToServer: options.logToServer || false,
            maxErrors: options.maxErrors || 50,
            ...options
        };
        
        this.errors = [];
        this.init();
    }

    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise',
                message: event.reason.message || event.reason,
                stack: event.reason.stack
            });
        });
    }

    logError(error) {
        const errorObj = {
            ...error,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.errors.push(errorObj);

        // Manter apenas os últimos erros
        if (this.errors.length > this.options.maxErrors) {
            this.errors = this.errors.slice(-this.options.maxErrors);
        }

        if (this.options.logToConsole) {
            console.error('Error logged:', errorObj);
        }

        if (this.options.logToServer && this.options.serverEndpoint) {
            this.sendToServer(errorObj);
        }
    }

    sendToServer(error) {
        fetch(this.options.serverEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(error)
        }).catch(() => {
            // Silenciar erros de envio para o servidor
        });
    }

    getErrors(limit = 10) {
        return this.errors.slice(-limit);
    }

    clearErrors() {
        this.errors = [];
    }
}

// =========================
// ANALYTICS UTILITIES
// =========================
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
    }

    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                session_duration: Date.now() - this.sessionStart,
                page: window.location.pathname,
                referrer: document.referrer
            }
        };

        this.events.push(event);

        // Enviar para Google Analytics se disponível
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: properties.category || 'General',
                event_label: properties.label,
                value: properties.value
            });
        }

        // Log para desenvolvimento
        if (window.location.hostname === 'localhost') {
            console.log('Analytics:', event);
        }
    }

    trackPageView(page = window.location.pathname) {
        this.track('page_view', {
            category: 'Navigation',
            page: page
        });
    }

    trackUserInteraction(element, action = 'click') {
        const properties = {
            category: 'User Interaction',
            element_id: element.id,
            element_class: element.className,
            element_tag: element.tagName.toLowerCase(),
            action: action
        };

        this.track('user_interaction', properties);
    }

    trackPerformance() {
        if ('performance' in window && 'timing' in performance) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

            this.track('performance', {
                category: 'Performance',
                load_time: loadTime,
                dom_ready: domReady,
                performance_class: getPerformanceClass()
            });
        }
    }
}

// =========================
// INIT UTILITIES
// =========================
function initializeUtilities() {
    // Instâncias globais
    window.lazyLoader = new LazyLoader();
    window.animationQueue = new AnimationQueue();
    window.storage = new StorageManager();
    window.errorManager = new ErrorManager();
    window.analytics = new AnalyticsManager();

    // Auto-track page view
    window.analytics.trackPageView();

    // Performance tracking após carregamento
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.analytics.trackPerformance();
        }, 1000);
    });

    // Auto-track user interactions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn') || 
            e.target.classList.contains('contact-btn') ||
            e.target.classList.contains('partner-link')) {
            window.analytics.trackUserInteraction(e.target, 'click');
        }
    });

    console.log('🛠️ Utilities inicializadas');
}

// =========================
// MATH UTILITIES
// =========================
const MathUtils = {
    clamp: (num, min, max) => Math.min(Math.max(num, min), max),
    lerp: (start, end, t) => start * (1 - t) + end * t,
    map: (value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    },
    random: (min, max) => Math.random() * (max - min) + min,
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};

// =========================
// EXPORT/INIT
// =========================
ready(() => {
    initializeUtilities();
    
    // Injetar informações do dispositivo no CSS
    const deviceInfo = getDeviceInfo();
    document.documentElement.classList.add(`performance-${deviceInfo.performanceClass}`);
    
    if (deviceInfo.isMobile) document.documentElement.classList.add('is-mobile');
    if (deviceInfo.isTablet) document.documentElement.classList.add('is-tablet');
    if (deviceInfo.isLowEnd) document.documentElement.classList.add('is-low-end');
});

// Exposição global para debugging
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugUtils = {
        deviceInfo: getDeviceInfo,
        performanceCache,
        MathUtils
    };
}