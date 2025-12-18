// PrimePhone Skincare Store JavaScript

// Product data for skincare products
const products = [
    {
        id: 1,
        name: "Samsung Galaxy S23 Ultra",
        price: 224999,
        originalPrice: 259999,
        image: "assets/Samsung.jpg",
        description: "200MP Camera • Snapdragon 8 Gen 2 • 5000mAh Battery",
        category: "Flagship",
        rating: 4.9,
        reviews: 532
    },
    {
        id: 2,
        name: "iPhone 14 Pro Max",
        price: 289999,
        originalPrice: 319999,
        image: "assets/iPhone.jpg",
        description: "A16 Bionic Chip • 48MP Camera • Dynamic Island",
        category: "Flagship",
        rating: 4.9,
        reviews: 610
    },
    {
        id: 3,
        name: "Xiaomi Redmi Note 12",
        price: 59999,
        originalPrice: 74999,
        image: "assets/Xiaomi.jpg",
        description: "108MP Camera • AMOLED Display • Fast Charging",
        category: "Mid-Range",
        rating: 4.6,
        reviews: 412
    },
    {
        id: 4,
        name: "Realme 10 Pro",
        price: 54999,
        originalPrice: 65999,
        image: "assets/Realme.jpg",
        description: "Curved Display • Snapdragon • 120Hz Refresh Rate",
        category: "Mid-Range",
        rating: 4.7,
        reviews: 301
    },
    {
        id: 5,
        name: "Infinix Hot 30",
        price: 34999,
        originalPrice: 41999,
        image: "assets/Infinix.jpg",
        description: "Gaming Processor • 6000mAh Battery • Smooth UI",
        category: "Budget",
        rating: 4.4,
        reviews: 280
    },
    {
        id: 6,
        name: "Tecno Spark 10 Pro",
        price: 30999,
        originalPrice: 37999,
        image: "assets/Tecno.jpg",
        description: "50MP AI Camera • 256GB Storage • Big Battery",
        category: "Budget",
        rating: 4.5,
        reviews: 198
    },
    {
        id: 7,
        name: "Google Pixel 7",
        price: 189999,
        originalPrice: 209999,
        image: "assets/Google.jpg",
        description: "Google Tensor G2 • Best AI Camera • Pure Android",
        category: "Flagship",
        rating: 4.8,
        reviews: 450
    },
    {
        id: 8,
        name: "OnePlus Nord CE 3 Lite",
        price: 79999,
        originalPrice: 89999,
        image: "assets/OnePlus.jpg",
        description: "108MP Camera • 67W SuperVOOC Charge • Smooth UI",
        category: "Mid-Range",
        rating: 4.6,
        reviews: 330
    }
];

// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
    setupScrollAnimations();
});

// Load products into the page
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'mb-4 col-md-6';
    
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    card.innerHTML = `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="img-fluid">
                <div class="discount-badge">${discount}% OFF</div>
            </div>
            <div class="product-info">
                <div class="rating mb-2">
                    ${generateStars(product.rating)}
                    <small class="text-muted">(${product.reviews})</small>
                </div>
                <h5 class="product-title">${product.name}</h5>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="current-price">Rs. ${product.price}</span>
                    <span class="original-price">Rs. ${product.originalPrice}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline-primary btn-sm buy-now" onclick="buyNow(${product.id})">
                        <i class="fas fa-bolt"></i> Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add product to cart
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
    
    updateCart();
    showToast(`${product.name} added to cart!`);
}

// Buy now functionality
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Clear cart and add only this product
    cart = [{
        ...product,
        quantity: 1
    }];
    
    updateCart();
    cartModal.show();
}

// Update cart functionality
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Render cart items in modal
function renderCartItems() {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <p class="text-muted">Your cart is empty</p>
                <button class="btn btn-primary" onclick="cartModal.hide()">Continue Shopping</button>
            </div>
        `;
        cartTotal.textContent = 'Rs. 0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item p-3';
        cartItem.innerHTML = `
            <div class="row align-items-center">
                <div class="col-3">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                </div>
                <div class="col-5">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="mb-0 text-muted">Rs. ${item.price}</p>
                </div>
                <div class="col-2">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="col-2 text-end">
                    <p class="mb-0 fw-bold">Rs. ${itemTotal}</p>
                    <button class="btn btn-sm btn-link text-danger" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Rs. ${total}`;
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showToast('Item removed from cart');
}

// Setup event listeners
function setupEventListeners() {
    // Cart button
    const cartBtn = document.querySelector('.fa-shopping-cart').parentElement;
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.show();
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add to cart buttons animation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            button.classList.add('pulse');
            setTimeout(() => button.classList.remove('pulse'), 1000);
        }
    });
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
    }, 2000);
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.product-card, .feature-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-notification';
    toastContainer.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle text-success' : 'info-circle text-info'}"></i>
            <span class="ms-2">${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toastContainer.parentElement) {
            toastContainer.remove();
        }
    }, 5000);
}

// Utility functions
function formatPrice(price) {
    return `Rs. ${price.toLocaleString()}`;
}

function calculateDiscount(originalPrice, salePrice) {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

// Initialize tooltips and popovers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Export functions for global access
window.addToCart = addToCart;
window.buyNow = buyNow;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;


// Scroll to Top
document.getElementById("scrollUp").addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Scroll to Bottom
document.getElementById("scrollDown").addEventListener("click", () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
});
