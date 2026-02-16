// ================================================
// Prime Wear Wholesale - Cart Functionality
// ================================================

const Cart = {
    // Cart data stored in localStorage
    items: [],
    
    // Initialize cart from localStorage
    init() {
        const savedCart = localStorage.getItem('primeWearCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
        this.updateCartCount();
        return this;
    },
    
    // Save cart to localStorage
    save() {
        localStorage.setItem('primeWearCart', JSON.stringify(this.items));
        this.updateCartCount();
        this.updateMiniCart();
    },
    
    // Add item to cart
    addItem(product, quantity = 1, size = null, color = null) {
        // Check if item already exists in cart with same options
        const existingIndex = this.items.findIndex(item => 
            item.id === product.id && 
            item.size === size && 
            item.color === color
        );
        
        if (existingIndex > -1) {
            // Update quantity if item exists
            this.items[existingIndex].quantity += quantity;
        } else {
            // Add new item to cart
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                wholesale_price: product.wholesale_price,
                image: product.images[0],
                type: product.type,
                category: product.category,
                quantity: quantity,
                size: size,
                color: color,
                stock: product.stock
            });
        }
        
        this.save();
        this.showNotification(`${product.name} added to cart!`);
    },
    
    // Remove item from cart
    removeItem(index) {
        const removedItem = this.items[index];
        this.items.splice(index, 1);
        this.save();
        this.showNotification(`${removedItem.name} removed from cart`);
    },
    
    // Update item quantity
    updateQuantity(index, quantity) {
        if (quantity < 1) {
            this.removeItem(index);
            return;
        }
        
        // Check stock
        if (quantity > this.items[index].stock) {
            this.showNotification(`Only ${this.items[index].stock} items available`, 'error');
            quantity = this.items[index].stock;
        }
        
        this.items[index].quantity = quantity;
        this.save();
        this.updateMiniCart();
    },
    
    // Get price for an item (wholesale or retail)
    getItemPrice(item) {
        if (item.type === 'wholesale' && item.wholesale_price) {
            return item.wholesale_price;
        }
        return item.price;
    },
    
    // Calculate subtotal
    getSubtotal() {
        return this.items.reduce((sum, item) => {
            return sum + (this.getItemPrice(item) * item.quantity);
        }, 0);
    },
    
    // Calculate shipping (free over certain amount)
    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal > 500 ? 0 : 25;
    },
    
    // Calculate total
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    },
    
    // Get total item count
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },
    
    // Update mini cart display
    updateMiniCart() {
        const miniCartItems = document.querySelector('.mini-cart-items');
        if (!miniCartItems) return;
        
        if (this.items.length === 0) {
            miniCartItems.innerHTML = '<p style="text-align: center; padding: 30px; color: var(--text-muted);">Your cart is empty</p>';
            this.updateMiniCartFooter();
            return;
        }
        
        miniCartItems.innerHTML = this.items.map((item, index) => `
            <div class="mini-cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="mini-cart-item-info">
                    <div class="mini-cart-item-name">${item.name}</div>
                    <div class="mini-cart-item-price">${this.getItemPrice(item).toFixed(2)}</div>
                    <div class="mini-cart-item-quantity">Qty: ${item.quantity}${item.size ? ` | Size: ${item.size}` : ''}${item.color ? ` | ${item.color}` : ''}</div>
                </div>
                <button class="mini-cart-item-remove" onclick="Cart.removeItem(${index})">&times;</button>
            </div>
        `).join('');
        
        this.updateMiniCartFooter();
    },
    
    // Update mini cart footer
    updateMiniCartFooter() {
        const miniCartFooter = document.querySelector('.mini-cart-footer');
        if (!miniCartFooter) return;
        
        if (this.items.length === 0) {
            miniCartFooter.innerHTML = '';
            return;
        }
        
        const subtotal = this.getSubtotal();
        
        miniCartFooter.innerHTML = `
            <div class="mini-cart-total">
                <span>Subtotal</span>
                <strong>GH₵ ${subtotal.toFixed(2)}</strong>
            </div>
            <div style="display: flex; gap: 10px;">
                <a href="cart.html" class="btn btn-outline" style="flex: 1; padding: 10px;">View Cart</a>
                <a href="checkout.html" class="btn btn-primary" style="flex: 1; padding: 10px;">Checkout</a>
            </div>
        `;
    },
    
    // Show mini cart dropdown
    showMiniCart() {
        const miniCart = document.querySelector('.mini-cart');
        if (miniCart) {
            miniCart.classList.add('active');
            this.updateMiniCart();
            
            // Create overlay for mobile
            this.createCartOverlay();
        }
    },
    
    // Hide mini cart dropdown
    hideMiniCart() {
        const miniCart = document.querySelector('.mini-cart');
        if (miniCart) {
            miniCart.classList.remove('active');
        }
        
        // Remove overlay
        this.removeCartOverlay();
    },
    
    // Toggle mini cart dropdown
    toggleMiniCart() {
        const miniCart = document.querySelector('.mini-cart');
        if (miniCart) {
            if (miniCart.classList.contains('active')) {
                this.hideMiniCart();
            } else {
                this.showMiniCart();
            }
        }
    },
    
    // Create cart overlay for mobile
    createCartOverlay() {
        // Remove existing overlay first
        this.removeCartOverlay();
        
        // Check if we're on mobile
        if (window.innerWidth <= 768) {
            const overlay = document.createElement('div');
            overlay.className = 'cart-overlay active';
            overlay.id = 'cart-overlay';
            
            // Add inline styles to ensure proper z-index (below mini-cart at 1005)
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1004;
                pointer-events: auto;
                cursor: pointer;
            `;
            
            overlay.addEventListener('click', () => this.hideMiniCart());
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
        }
    },
    
    // Remove cart overlay
    removeCartOverlay() {
        const overlay = document.getElementById('cart-overlay');
        if (overlay) {
            overlay.remove();
        }
        document.body.style.overflow = '';
    },
    
    // Clear entire cart
    clear() {
        this.items = [];
        this.save();
        this.showNotification('Cart cleared');
    },
    
    // Generate order summary for WhatsApp
    generateWhatsappMessage(customerInfo = {}) {
        let message = `*PRIME WEAR WHOLESALE - ORDER*%0A%0A`;
        
        if (customerInfo.name) {
            message += `*Customer:* ${customerInfo.name}%0A`;
        }
        if (customerInfo.phone) {
            message += `*Phone:* ${customerInfo.phone}%0A`;
        }
        if (customerInfo.email) {
            message += `*Email:* ${customerInfo.email}%0A`;
        }
        if (customerInfo.address) {
            message += `*Address:* ${customerInfo.address}%0A`;
        }
        
        message += `%0A*ORDER DETAILS*%0A`;
        message += `━━━━━━━━━━━━━━━━━━━━%0A`;
        
        this.items.forEach((item, index) => {
            message += `${index + 1}. *${item.name}%0A`;
            message += `   Qty: ${item.quantity} x GH₵${this.getItemPrice(item).toFixed(2)}`;
            if (item.size) message += ` (${item.size})`;
            if (item.color) message += ` (${item.color})`;
            message += `%0A`;
            message += `   Subtotal: GH₵${(this.getItemPrice(item) * item.quantity).toFixed(2)}%0A%0A`;
        });
        
        message += `━━━━━━━━━━━━━━━━━━━━%0A`;
        message += `*Subtotal:* GH₵${this.getSubtotal().toFixed(2)}%0A`;
        message += `*Shipping:* ${this.getShipping() === 0 ? 'FREE' : 'GH₵' + this.getShipping().toFixed(2)}%0A`;
        message += `*TOTAL:* GH₵${this.getTotal().toFixed(2)}%0A%0A`;
        message += `*Order Notes:* ${customerInfo.notes || 'None'}`;
        
        return message;
    },
    
    // Show notification
    showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles dynamically
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27AE60' : '#E74C3C'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Cart;
}
