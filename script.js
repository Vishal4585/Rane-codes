// Global variables
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Sample products data
const sampleProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Fitness tracking smartwatch with heart rate monitor",
        price: 299.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt in various colors",
        price: 29.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Denim Jeans",
        description: "Classic blue denim jeans with perfect fit",
        price: 79.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Coffee Maker",
        description: "Automatic drip coffee maker with programmable timer",
        price: 89.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Garden Tools Set",
        description: "Complete set of gardening tools for home use",
        price: 49.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
    },
    {
        id: 7,
        name: "Yoga Mat",
        description: "Non-slip yoga mat perfect for workouts and meditation",
        price: 39.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
    },
    {
        id: 8,
        name: "Running Shoes",
        description: "Lightweight running shoes with excellent cushioning",
        price: 129.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    products = sampleProducts;
    initializeApp();
    loadProducts();
    updateCartUI();
    checkAuthStatus();
});

// Initialize app functionality
function initializeApp() {
    // Event listeners for modals
    setupModalListeners();
    
    // Event listeners for authentication
    setupAuthListeners();
    
    // Event listeners for cart
    setupCartListeners();
    
    // Event listeners for product filtering
    setupFilterListeners();
    
    // Event listeners for search
    setupSearchListeners();
}

// Modal functionality
function setupModalListeners() {
    // Cart modal
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    
    cartBtn.addEventListener('click', () => showModal('cartModal'));
    closeCart.addEventListener('click', () => hideModal('cartModal'));
    
    // Login modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const switchToRegister = document.getElementById('switchToRegister');
    
    loginBtn.addEventListener('click', () => showModal('loginModal'));
    closeLogin.addEventListener('click', () => hideModal('loginModal'));
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('loginModal');
        showModal('registerModal');
    });
    
    // Register modal
    const registerBtn = document.getElementById('registerBtn');
    const registerModal = document.getElementById('registerModal');
    const closeRegister = document.getElementById('closeRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    registerBtn.addEventListener('click', () => showModal('registerModal'));
    closeRegister.addEventListener('click', () => hideModal('registerModal'));
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('registerModal');
        showModal('loginModal');
    });
    
    // Checkout modal
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckout = document.getElementById('closeCheckout');
    const cancelCheckout = document.getElementById('cancelCheckout');
    
    checkoutBtn.addEventListener('click', () => showModal('checkoutModal'));
    closeCheckout.addEventListener('click', () => hideModal('checkoutModal'));
    cancelCheckout.addEventListener('click', () => hideModal('checkoutModal'));
    
    // Success modal
    const closeSuccess = document.getElementById('closeSuccess');
    closeSuccess.addEventListener('click', () => hideModal('successModal'));
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
}

// Authentication functionality
function setupAuthListeners() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutLink = document.getElementById('logoutLink');
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutLink.addEventListener('click', handleLogout);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            updateAuthUI();
            hideModal('loginModal');
            showNotification('Login successful!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.message || 'Login failed', 'error');
        }
    } catch (error) {
        // Fallback for demo purposes
        if (email && password) {
            currentUser = {
                id: 1,
                name: email.split('@')[0],
                email: email
            };
            updateAuthUI();
            hideModal('loginModal');
            showNotification('Login successful! (Demo mode)', 'success');
        } else {
            showNotification('Please enter valid credentials', 'error');
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            updateAuthUI();
            hideModal('registerModal');
            showNotification('Registration successful!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.message || 'Registration failed', 'error');
        }
    } catch (error) {
        // Fallback for demo purposes
        if (name && email && password) {
            currentUser = {
                id: Date.now(),
                name: name,
                email: email
            };
            updateAuthUI();
            hideModal('registerModal');
            showNotification('Registration successful! (Demo mode)', 'success');
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    }
}

function handleLogout() {
    currentUser = null;
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userMenu.style.display = 'block';
        userName.textContent = currentUser.name;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        userMenu.style.display = 'none';
        localStorage.removeItem('currentUser');
    }
}

// Cart functionality
function setupCartListeners() {
    const clearCartBtn = document.getElementById('clearCart');
    const processPaymentBtn = document.getElementById('processPayment');
    
    clearCartBtn.addEventListener('click', clearCart);
    processPaymentBtn.addEventListener('click', processPayment);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCart();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        saveCart();
    }
}

function clearCart() {
    cart = [];
    updateCartUI();
    saveCart();
    showNotification('Cart cleared', 'success');
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        checkoutTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="btn btn-secondary" onclick="removeFromCart(${item.id})" style="padding: 0.5rem;">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
    checkoutTotal.textContent = total.toFixed(2);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Product functionality
function loadProducts(filterCategory = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    const filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(product => product.category === filterCategory);
    
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function setupFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Load products with selected filter
            const category = btn.getAttribute('data-category');
            loadProducts(category);
        });
    });
}

function setupSearchListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="text-center">No products found matching your search.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Payment functionality
async function processPayment() {
    if (!currentUser) {
        showNotification('Please login to continue', 'error');
        hideModal('checkoutModal');
        showModal('loginModal');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const shippingName = document.getElementById('shippingName').value;
    const shippingEmail = document.getElementById('shippingEmail').value;
    const shippingAddress = document.getElementById('shippingAddress').value;
    const shippingCity = document.getElementById('shippingCity').value;
    const shippingZip = document.getElementById('shippingZip').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    if (!shippingName || !shippingEmail || !shippingAddress || !shippingCity || !shippingZip || !cardNumber || !expiryDate || !cvv) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate payment processing
    showNotification('Processing payment...', 'info');
    
    try {
        const response = await fetch('/api/payments/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                currency: 'usd',
                cardNumber,
                expiryDate,
                cvv,
                shippingInfo: {
                    name: shippingName,
                    email: shippingEmail,
                    address: shippingAddress,
                    city: shippingCity,
                    zip: shippingZip
                },
                items: cart
            }),
        });
        
        if (response.ok) {
            const result = await response.json();
            handlePaymentSuccess(result);
        } else {
            const error = await response.json();
            showNotification(error.message || 'Payment failed', 'error');
        }
    } catch (error) {
        // Fallback for demo purposes
        setTimeout(() => {
            handlePaymentSuccess({ transactionId: 'DEMO_' + Date.now() });
        }, 2000);
    }
}

function handlePaymentSuccess(result) {
    // Clear cart
    cart = [];
    updateCartUI();
    saveCart();
    
    // Hide checkout modal and show success modal
    hideModal('checkoutModal');
    showModal('successModal');
    
    // Reset checkout form
    document.getElementById('checkoutForm').reset();
    
    showNotification('Payment successful! Order placed.', 'success');
}

// Utility functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
