// ================================================
// Prime Wear Wholesale - Checkout Functionality
// ================================================

const Checkout = {
    // WhatsApp number for orders
    whatsappNumber: 'https://wa.me/message/A6Y7H3ZVDOFJO1',
    
    // MTN Mobile Money details
    mtnNumber: '0546269073',
    mtnName: 'PEACE ABRAHAM VENTURES',
    
    // Form validation rules
    validators: {
        name: {
            validate: (value) => value.trim().length >= 2,
            message: 'Please enter your full name'
        },
        phone: {
            validate: (value) => /^[\d\s\-\+]{10,}$/.test(value),
            message: 'Please enter a valid phone number'
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        address: {
            validate: (value) => value.trim().length >= 10,
            message: 'Please enter your complete delivery address'
        },
        mtn_transaction_id: {
            validate: (value) => {
                const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
                if (paymentMethod && paymentMethod.value === 'mtn') {
                    return value.trim().length >= 5;
                }
                return true;
            },
            message: 'Please enter your MTN transaction ID'
        }
    },
    
    // Initialize checkout page
    init() {
        if (this.isCheckoutPage()) {
            this.initForm();
            this.initOrderSummary();
            this.initPaymentMethod();
        }
    },
    
    // Check if current page is checkout
    isCheckoutPage() {
        return window.location.pathname.includes('checkout.html');
    },
    
    // Initialize payment method handling
    initPaymentMethod() {
        const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                this.updatePaymentUI();
            });
        });
        
        // Update total amount display for MTN
        this.updatePaymentUI();
    },
    
    // Update UI based on selected payment method
    updatePaymentUI() {
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked');
        const method = selectedMethod ? selectedMethod.value : 'mtn';
        
        const mtnDetails = document.getElementById('mtn-payment-details');
        const paystackDetails = document.getElementById('paystack-payment-details');
        const checkoutBtnText = document.getElementById('checkout-btn-text');
        const checkoutBtn = document.getElementById('checkout-submit-btn');
        
        // Hide all payment details
        if (mtnDetails) mtnDetails.style.display = 'none';
        if (paystackDetails) paystackDetails.style.display = 'none';
        
        // Update button and show relevant details
        if (method === 'mtn') {
            if (mtnDetails) mtnDetails.style.display = 'block';
            if (checkoutBtnText) checkoutBtnText.textContent = 'Complete Order with MTN';
            checkoutBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> <span id="checkout-btn-text">Complete Order with MTN</span>';
            
            // Update MTN amount
            const total = Cart.getTotal();
            const mtnAmount = document.getElementById('mtn-amount');
            if (mtnAmount) mtnAmount.textContent = `GH₵${total.toFixed(2)}`;
            
            // Generate reference
            const ref = this.generateOrderReference();
            const mtnRef = document.getElementById('mtn-reference');
            if (mtnRef) mtnRef.textContent = ref;
            
        } else if (method === 'paystack') {
            if (paystackDetails) paystackDetails.style.display = 'block';
            if (checkoutBtnText) checkoutBtnText.textContent = 'Pay with Paystack';
            checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> <span id="checkout-btn-text">Pay with Paystack</span>';
            
        }
    },
    
    // Generate order reference
    generateOrderReference() {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `PW${timestamp}${random}`;
    },
    
    // Initialize form handling
    initForm() {
        const form = document.getElementById('checkout-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.processCheckout();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    },
    
    // Validate entire form
    validateForm() {
        const form = document.getElementById('checkout-form');
        if (!form) return false;
        
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly', 'error');
        }
        
        return isValid;
    },
    
    // Validate single field
    validateField(input) {
        const fieldName = input.name;
        const validator = this.validators[fieldName];
        
        if (!validator) return true;
        
        const value = input.value;
        const isValid = validator.validate(value);
        
        if (!isValid) {
            this.showFieldError(input, validator.message);
        } else {
            this.clearFieldError(input);
        }
        
        return isValid;
    },
    
    // Show field error
    showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.add('error');
        
        let errorEl = formGroup.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.cssText = 'color: #E74C3C; font-size: 0.85rem; margin-top: 5px; display: block;';
            formGroup.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        input.style.borderColor = '#E74C3C';
    },
    
    // Clear field error
    clearFieldError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('error');
        
        const errorEl = formGroup.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
        
        input.style.borderColor = '';
    },
    
    // Initialize order summary
    initOrderSummary() {
        this.updateOrderSummary();
    },
    
    // Update order summary display
    updateOrderSummary() {
        const orderItems = document.querySelector('.order-items');
        const subtotalEl = document.querySelector('.order-subtotal');
        const shippingEl = document.querySelector('.order-shipping');
        const totalEl = document.querySelector('.order-total');
        
        if (!orderItems) return;
        
        // Render order items
        if (Cart.items.length === 0) {
            orderItems.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--text-muted);">Your cart is empty</p>';
            return;
        }
        
        orderItems.innerHTML = Cart.items.map((item, index) => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-quantity">Qty: ${item.quantity}${item.size ? ` | ${item.size}` : ''}${item.color ? ` | ${item.color}` : ''}</div>
                </div>
                <div class="order-item-price">GH₵${(Cart.getItemPrice(item) * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
        
        // Update totals
        // Hide shipping row on cart page
        const cartShippingRow = document.querySelector('.cart-shipping-row');
        if (cartShippingRow) {
            cartShippingRow.style.display = 'none';
        }
        if (totalEl) totalEl.textContent = `GH₵${Cart.getTotal().toFixed(2)}`;
    },
    
    // Process checkout
    processCheckout() {
        const form = document.getElementById('checkout-form');
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked');
        const paymentMethod = selectedMethod ? selectedMethod.value : 'mtn';
        
        const customerInfo = {
            name: form.querySelector('[name="name"]').value,
            phone: form.querySelector('[name="phone"]').value,
            email: form.querySelector('[name="email"]').value,
            address: form.querySelector('[name="address"]').value,
            notes: form.querySelector('[name="notes"]').value,
            payment_method: paymentMethod
        };
        
        // Handle based on payment method
        if (paymentMethod === 'mtn') {
            customerInfo.mtn_transaction_id = form.querySelector('[name="mtn_transaction_id"]').value;
            this.processMTNPayment(customerInfo);
        } else if (paymentMethod === 'paystack') {
            this.processPaystackPayment(customerInfo);
        }
    },
    
    // Process WhatsApp order
    processWhatsAppOrder(customerInfo) {
        const message = Cart.generateWhatsappMessage(customerInfo);
        const whatsappUrl = `${this.whatsappNumber}&text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        
        Cart.clear();
        this.showNotification('Order sent successfully! Check WhatsApp to complete your order.');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    },
    
    // Process MTN Mobile Money payment
    processMTNPayment(customerInfo) {
        const message = Cart.generateWhatsappMessage(customerInfo);
        const whatsappUrl = `${this.whatsappNumber}&text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        
        Cart.clear();
        this.showNotification('Payment submitted! We will verify your MTN transaction and confirm your order via WhatsApp.');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
    },
    
    // Process Paystack payment
    processPaystackPayment(customerInfo) {
        const total = Cart.getTotal();
        const reference = this.generateOrderReference();
        
        // Store order info for after payment
        localStorage.setItem('pendingOrder', JSON.stringify({
            customerInfo: customerInfo,
            items: Cart.items,
            total: total,
            reference: reference
        }));
        
        // Show message that Paystack integration is coming soon
        this.showNotification('Paystack payment option is coming soon! For now, please use WhatsApp or MTN Mobile Money.', 'error');
        
        // Alternative: Open WhatsApp with payment info
        const message = Cart.generateWhatsappMessage(customerInfo);
        const whatsappUrl = `${this.whatsappNumber}&text=${message}`;
        
        setTimeout(() => {
            if (confirm('Would you like to complete your order via WhatsApp instead?')) {
                window.open(whatsappUrl, '_blank');
                Cart.clear();
                window.location.href = 'index.html';
            }
        }, 3000);
    },
    
    // Show notification
    showNotification(message, type = 'success') {
        const existing = document.querySelector('.checkout-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `checkout-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
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
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    },
    
    // Submit order to WhatsApp (for the new button)
    submitToWhatsApp() {
        // Validate form first
        if (!this.validateForm()) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        const form = document.getElementById('checkout-form');
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked');
        const paymentMethod = selectedMethod ? selectedMethod.value : 'mtn';
        
        const customerInfo = {
            name: form.querySelector('[name="name"]').value,
            phone: form.querySelector('[name="phone"]').value,
            whatsapp: form.querySelector('[name="whatsapp"]').value,
            email: form.querySelector('[name="email"]').value,
            address: form.querySelector('[name="address"]').value,
            city: form.querySelector('[name="city"]').value,
            region: form.querySelector('[name="region"]').value,
            notes: form.querySelector('[name="notes"]').value,
            payment_method: paymentMethod
        };
        
        // Include MTN transaction ID if selected
        if (paymentMethod === 'mtn') {
            const mtnTransactionId = form.querySelector('[name="mtn_transaction_id"]').value;
            if (!mtnTransactionId || mtnTransactionId.trim().length < 5) {
                this.showNotification('Please enter your MTN transaction ID', 'error');
                return;
            }
            customerInfo.mtn_transaction_id = mtnTransactionId;
        }
        
        // Generate WhatsApp message and open
        const message = Cart.generateWhatsappMessage(customerInfo);
        const whatsappUrl = `${this.whatsappNumber}&text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        
        Cart.clear();
        this.showNotification('Order submitted successfully! Check WhatsApp to complete your order.');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }
};

// Cart page specific functions
const CartPage = {
    // Initialize cart page
    init() {
        if (!this.isCartPage()) return;
        
        this.renderCartTable();
        this.initQuantityHandlers();
        this.initRemoveHandlers();
        this.initCheckoutButton();
    },
    
    // Check if current page is cart
    isCartPage() {
        return window.location.pathname.includes('cart.html');
    },
    
    // Render cart table
    renderCartTable() {
        const cartTableBody = document.querySelector('.cart-table tbody');
        const cartItemsMobile = document.getElementById('cart-items-mobile');
        if (!cartTableBody) return;
        
        if (Cart.items.length === 0) {
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 60px 20px;">
                        <p style="font-size: 1.1rem; margin-bottom: 20px;">Your cart is empty</p>
                        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                    </td>
                </tr>
            `;
            if (cartItemsMobile) {
                cartItemsMobile.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px;">
                        <p style="font-size: 1.1rem; margin-bottom: 20px;">Your cart is empty</p>
                        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                `;
            }
            this.updateCartTotals();
            return;
        }
        
        cartTableBody.innerHTML = Cart.items.map((item, index) => `
            <tr>
                <td>
                    <div class="cart-product">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
                        <div class="cart-product-info">
                            <h4>${item.name}</h4>
                            <p>${item.type === 'wholesale' ? 'Wholesale' : 'Retail'}${item.size ? ` | Size: ${item.size}` : ''}${item.color ? ` | ${item.color}` : ''}</p>
                        </div>
                    </div>
                </td>
                <td>${item.stock > 0 ? '<span style="color: #27AE60;">In Stock</span>' : '<span style="color: #E74C3C;">Out of Stock</span>'}</td>
                <td>
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="CartPage.updateQuantity(${index}, -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.stock}" onchange="CartPage.changeQuantity(${index}, this.value)">
                        <button class="quantity-btn" onclick="CartPage.updateQuantity(${index}, 1)">+</button>
                    </div>
                </td>
                <td>GH₵${Cart.getItemPrice(item).toFixed(2)}</td>
                <td><strong>GH₵${(Cart.getItemPrice(item) * item.quantity).toFixed(2)}</strong></td>
                <td>
                    <button class="cart-remove-btn" onclick="Cart.removeItem(${index})" style="color: #E74C3C; font-size: 1.2rem; background: none; border: none; cursor: pointer;">
                        &times;
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Render mobile card layout
        if (cartItemsMobile) {
            cartItemsMobile.innerHTML = Cart.items.map((item, index) => `
                <div class="cart-item-card">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">GH₵${Cart.getItemPrice(item).toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="CartPage.updateQuantity(${index}, -1)">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.stock}" onchange="CartPage.changeQuantity(${index}, this.value)">
                            <button class="quantity-btn" onclick="CartPage.updateQuantity(${index}, 1)">+</button>
                        </div>
                        ${item.size ? `<div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">Size: ${item.size}</div>` : ''}
                        ${item.color ? `<div style="font-size: 0.85rem; color: var(--text-muted);">${item.color}</div>` : ''}
                        <div style="font-size: 0.85rem; margin-top: 8px;" class="${item.stock > 0 ? '' : 'out'}">
                            ${item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="Cart.removeItem(${index})">&times;</button>
                </div>
            `).join('');
        }
        
        this.updateCartTotals();
    },
    
    // Update item quantity
    updateQuantity(index, change) {
        const newQuantity = Cart.items[index].quantity + change;
        if (newQuantity < 1) {
            if (confirm('Remove this item from cart?')) {
                Cart.removeItem(index);
            }
        } else if (newQuantity <= Cart.items[index].stock) {
            Cart.updateQuantity(index, newQuantity);
        } else {
            Cart.showNotification(`Only ${Cart.items[index].stock} items available`, 'error');
        }
        this.renderCartTable();
    },
    
    // Change quantity via input
    changeQuantity(index, value) {
        const quantity = parseInt(value);
        if (quantity < 1) {
            Cart.removeItem(index);
        } else if (quantity > Cart.items[index].stock) {
            Cart.showNotification(`Only ${Cart.items[index].stock} items available`, 'error');
            Cart.updateQuantity(index, Cart.items[index].stock);
        } else {
            Cart.updateQuantity(index, quantity);
        }
        this.renderCartTable();
    },
    
    // Initialize quantity input handlers
    initQuantityHandlers() {
        const inputs = document.querySelectorAll('.quantity-input');
        inputs.forEach((input, index) => {
            input.addEventListener('change', (e) => {
                this.changeQuantity(index, e.target.value);
            });
        });
    },
    
    // Initialize remove button handlers
    initRemoveHandlers() {
        // Handlers are added via inline onclick
    },
    
    // Update cart totals
    updateCartTotals() {
        const subtotalEl = document.querySelector('.cart-subtotal');
        const shippingEl = document.querySelector('.cart-shipping');
        const totalEl = document.querySelector('.cart-total-amount');
        
        if (subtotalEl) subtotalEl.textContent = `GH₵${Cart.getSubtotal().toFixed(2)}`;
        
        // Hide shipping row
        const shippingRow = document.querySelector('.cart-shipping-row');
        if (shippingRow) {
            shippingRow.style.display = 'none';
        }
        
        if (totalEl) totalEl.textContent = `GH₵${Cart.getTotal().toFixed(2)}`;
    },
    
    // Initialize checkout button
    initCheckoutButton() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (Cart.items.length === 0) {
                    Cart.showNotification('Your cart is empty', 'error');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    Checkout.init();
    CartPage.init();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Checkout, CartPage };
}
