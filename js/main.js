// ================================================
// Prime Wear Wholesale - Main JavaScript
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoader();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initScrollToTop();
    initMobileMenu();
    initQuantitySelectors();
});

// ================================================
// Page Loader
// ================================================
function initLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        });
    }
}

// ================================================
// Navigation
// ================================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const cartIcon = document.querySelector('.cart-icon');
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Cart icon click handler
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            Cart.toggleMiniCart();
        });
    }
    
    // Close mini cart when clicking outside
    document.addEventListener('click', (e) => {
        const miniCart = document.querySelector('.mini-cart');
        const cartIcon = document.querySelector('.cart-icon');
        
        if (miniCart && !miniCart.contains(e.target) && !cartIcon?.contains(e.target)) {
            Cart.hideMiniCart();
        }
    });
}

// ================================================
// Scroll Effects
// ================================================
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================================
// Scroll Animations
// ================================================
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ================================================
// Scroll to Top Button
// ================================================
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================================
// Mobile Menu
// ================================================
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (!mobileMenuBtn || !navLinks) return;
    
    // Create navigation overlay if it doesn't exist
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }
    
    // Add close button to nav links if not exists
    let closeBtn = navLinks.querySelector('.mobile-menu-close');
    if (!closeBtn) {
        closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close menu');
        navLinks.insertBefore(closeBtn, navLinks.firstChild);
    }
    
    // Close button click handler
    closeBtn.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
    });
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on overlay
    navOverlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
    });
    
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            navOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    });
    
    // Close menu when pressing escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            navOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Handle window resize - close menu when switching to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            navOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// ================================================
// Quantity Selectors
// ================================================
function initQuantitySelectors() {
    document.querySelectorAll('.product-quantity').forEach(container => {
        const decreaseBtn = container.querySelector('.qty-decrease');
        const increaseBtn = container.querySelector('.qty-increase');
        const input = container.querySelector('.qty-input');
        
        if (!decreaseBtn || !increaseBtn || !input) return;
        
        decreaseBtn.addEventListener('click', () => {
            let value = parseInt(input.value) || 1;
            if (value > 1) {
                input.value = value - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            let value = parseInt(input.value) || 1;
            const max = parseInt(input.max) || 99;
            if (value < max) {
                input.value = value + 1;
            }
        });
    });
}

// ================================================
// Product Card Builder
// ================================================
function createProductCard(product, showQuickAdd = true) {
    const price = Cart.getItemPrice(product);
    const inStock = product.stock > 0;
    const isWholesale = product.type === 'wholesale';
    const moq = product.moq || 1;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            ${product.type === 'wholesale' ? '<span class="product-badge wholesale">Wholesale</span>' : '<span class="product-badge">Retail</span>'}
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="product-overlay">
                    <a href="product.html?id=${product.id}" class="view-details-btn">
                        <i class="fas fa-eye"></i> View Details
                    </a>
                </div>
                ${showQuickAdd ? `
                <div class="product-actions">
                    <button class="product-action-btn" title="Add to Wishlist">&hearts;</button>
                    <button class="product-action-btn" title="Quick View" onclick="quickView(${product.id})">&#128065;</button>
                    <button class="product-action-btn" title="Add to Cart" onclick="quickAddToCart(${product.id})">&#128722;</button>
                </div>
                ` : ''}
            </div>
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <div class="product-pricing">
                    <span class="product-price">GH₵${price.toFixed(2)}</span>
                </div>
                ${!inStock ? `<div class="product-stock out">Out of Stock</div>` : ''}
                <div class="product-quantity" data-moq="${moq}" data-product-id="${product.id}">
                    ${isWholesale ? `<span class="qty-label">Min Order: ${moq}</span>` : ''}
                    <div class="qty-controls">
                        <button class="qty-btn qty-decrease" onclick="updateCardQuantity(${product.id}, -1)">-</button>
                        <input type="number" class="qty-input" id="qty-${product.id}" value="${moq}" min="${moq}" max="${product.stock}" readonly>
                        <button class="qty-btn qty-increase" onclick="updateCardQuantity(${product.id}, 1)">+</button>
                    </div>
                </div>
                <button class="add-to-cart-btn" onclick="addToCartFromCard(${product.id})">
                    ${product.type === 'wholesale' ? 'Add to Cart (Wholesale)' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
}

// ================================================
// Quick Add to Cart
// ================================================
function quickAddToCart(productId) {
    const product = getProductById(productId);
    if (product) {
        Cart.addItem(product, 1);
    }
}

function addToCartFromCard(productId) {
    const product = getProductById(productId);
    if (product) {
        let quantity = 1;
        const qtyInput = document.getElementById(`qty-${productId}`);
        if (qtyInput) {
            quantity = parseInt(qtyInput.value) || (product.moq || 1);
        }
        Cart.addItem(product, quantity);
    }
}

// Update quantity from product card
function updateCardQuantity(productId, change) {
    const product = getProductById(productId);
    if (!product) return;
    
    const qtyInput = document.getElementById(`qty-${productId}`);
    if (!qtyInput) return;
    
    const moq = product.moq || 1;
    let currentQty = parseInt(qtyInput.value) || moq;
    let newQty = currentQty + change;
    
    if (newQty < moq) {
        newQty = moq;
    } else if (newQty > product.stock) {
        newQty = product.stock;
    }
    
    qtyInput.value = newQty;
}

// ================================================
// Quick View Modal
// ================================================
function quickView(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="quick-view-close" onclick="this.closest('.quick-view-modal').remove()">&times;</button>
            <div class="quick-view-image">
                <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
            </div>
            <div class="quick-view-info">
                <span class="product-category">${product.category}</span>
                <h2>${product.name}</h2>
                <div class="product-pricing">
                    <span class="product-price">GH₵${Cart.getItemPrice(product).toFixed(2)}</span>
                </div>
                <p class="quick-view-description">${product.short_description}</p>
                <p>${product.long_description}</p>
                ${product.sizes ? `
                <div class="quick-view-options">
                    <label>Size:</label>
                    <select id="quick-view-size">
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                    </select>
                </div>
                ` : ''}
                ${product.colors ? `
                <div class="quick-view-options">
                    <label>Color:</label>
                    <select id="quick-view-color">
                        ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                    </select>
                </div>
                ` : ''}
                <div class="quick-view-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="this.parentElement.querySelector('.quantity-input').value = Math.max(1, parseInt(this.parentElement.querySelector('.quantity-input').value) - 1)">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="${product.stock}">
                        <button class="quantity-btn" onclick="this.parentElement.querySelector('.quantity-input').value = Math.min(${product.stock}, parseInt(this.parentElement.querySelector('.quantity-input').value) + 1)">+</button>
                    </div>
                    <button class="btn btn-primary" onclick="addToCartWithOptions(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = modal.querySelector('.quick-view-content');
    content.style.cssText = `
        background: white;
        border-radius: 15px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        padding: 30px;
    `;
    
    const closeBtn = modal.querySelector('.quick-view-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 1.5rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
    `;
    
    const imageContainer = modal.querySelector('.quick-view-image');
    imageContainer.style.cssText = 'border-radius: 10px; overflow: hidden;';
    imageContainer.querySelector('img').style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    
    const infoContainer = modal.querySelector('.quick-view-info');
    infoContainer.style.cssText = 'padding: 20px 0;';
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function addToCartWithOptions(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const sizeSelect = document.getElementById('quick-view-size');
    const colorSelect = document.getElementById('quick-view-color');
    const quantityInput = document.querySelector('.quick-view-info .quantity-input');
    
    const size = sizeSelect ? sizeSelect.value : null;
    const color = colorSelect ? colorSelect.value : null;
    const quantity = parseInt(quantityInput?.value) || 1;
    
    Cart.addItem(product, quantity, size, color);
    
    // Close modal
    document.querySelector('.quick-view-modal')?.remove();
}

// ================================================
// Product Filtering and Sorting
// ================================================
function filterProducts(type = 'all', category = 'all') {
    let products = getAllProducts();
    
    if (type !== 'all') {
        products = products.filter(p => p.type === type);
    }
    
    if (category !== 'all') {
        products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    return products;
}

function sortProducts(products, sortBy) {
    switch(sortBy) {
        case 'price-low':
            return [...products].sort((a, b) => Cart.getItemPrice(a) - Cart.getItemPrice(b));
        case 'price-high':
            return [...products].sort((a, b) => Cart.getItemPrice(b) - Cart.getItemPrice(a));
        case 'name-asc':
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return [...products].sort((a, b) => b.name.localeCompare(a.name));
        default:
            return products;
    }
}

// ================================================
// Render Products Grid
// ================================================
function renderProductsGrid(products, container) {
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// ================================================
// Newsletter Form
// ================================================
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            // Simulate subscription
            Cart.showNotification('Thank you for subscribing!');
            form.reset();
        } else {
            Cart.showNotification('Please enter a valid email address', 'error');
        }
    });
}

// ================================================
// Contact Form
// ================================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = form.querySelector('[name="name"]').value;
        const email = form.querySelector('[name="email"]').value;
        const message = form.querySelector('[name="message"]').value;
        
        if (!name || !email || !message) {
            Cart.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Create WhatsApp message for contact
        const whatsappMessage = `*PRIME WEAR WHOLESALE - CONTACT*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Message:* ${message}`;
        const whatsappUrl = `https://wa.me/message/A6Y7H3ZVDOFJO1?text=${whatsappMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        Cart.showNotification('Message sent successfully!');
        form.reset();
    });
}

// ================================================
// Utility Functions
// ================================================
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createProductCard,
        quickAddToCart,
        addToCartFromCard,
        quickView,
        filterProducts,
        sortProducts,
        renderProductsGrid
    };
}
