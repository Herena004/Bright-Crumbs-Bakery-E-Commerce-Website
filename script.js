// script.js

// Data
const products = [
    {
        id: 1,
        name: "Chocolate Fudge Cake",
        price: 24.99,
        rating: 5,
        image: "fludge cake.jpg",
        category: "cakes"
    },
    {
        id: 2,
        name: "Strawberry Cupcakes (6)",
        price: 18.99,
        rating: 4.5,
        image: "strawberry cupcakes.jpg",
        category: "cupcakes"
    },
    {
        id: 3,
        name: "Glazed Donuts (12)",
        price: 15.99,
        rating: 4.8,
        image: "donuts.jpg",
        category: "donuts"
    },
    {
        id: 4,
        name: "Butter Croissants (4)",
        price: 12.99,
        rating: 4.7,
        image: "butter.jpg",
        category: "pastries"
    },
    {
        id: 5,
        name: "Chocolate Chip Cookies",
        price: 9.99,
        rating: 4.9,
        image: "chocolate chip.jpg",
        category: "cookies"
    },
    {
        id: 6,
        name: "Red Velvet Cake",
        price: 28.99,
        rating: 5,
        image: "redvelvet.jpg",
        category: "cakes"
    },
    {
        id: 7,
        name: "Vanilla Bean Cupcakes",
        price: 16.99,
        rating: 4.6,
        image: "vannila.png",
        category: "cupcakes"
    },
    {
        id: 8,
        name: "Assorted Macarons (12)",
        price: 22.99,
        rating: 4.8,
        image: "macaroons.jpg",
        category: "cookies"
    }
];

const galleryImages = [
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800",
    "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800",
    "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800",
    "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800",
    "https://images.unsplash.com/photo-1543508168-7801a7f5ed2f?w=800",
    "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800"
];

// State
let cart = [];
let wishlist = [];
let currentSlide = 0;
let currentGalleryIndex = 0;
let isDarkMode = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const darkModeToggle = document.getElementById('darkModeToggle');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const stickyCartBtn = document.getElementById('stickyCartBtn');
const stickyCartCount = document.getElementById('stickyCartCount');
const productsGrid = document.getElementById('productsGrid');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const summaryItems = document.getElementById('summaryItems');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryDiscount = document.getElementById('summaryDiscount');
const summaryTotal = document.getElementById('summaryTotal');
const applyPromo = document.getElementById('applyPromo');
const promoInput = document.getElementById('promoInput');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const testimonialTrack = document.getElementById('testimonialTrack');
const sliderDots = document.getElementById('sliderDots');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initScrollReveal();
    initCountdown();
    initTestimonials();
    initGallery();
    loadCart();
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
});

// Mobile Menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Dark Mode
darkModeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Render Products
function renderProducts(category = 'all') {
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    
    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card reveal">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${renderStars(product.rating)}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
        else stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Category Filter
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        renderProducts(category);
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
});

// Wishlist
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    renderProducts();
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Update cart UI
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Calculate totals
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = count;
    stickyCartCount.textContent = count;
    
    // Save to localStorage
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('bakeryCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// Cart Sidebar Toggle
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
stickyCartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

// Toast Notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Checkout
checkoutBtn.addEventListener('click', () => {
    closeCartSidebar();
    openCheckout();
});

function openCheckout() {
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateSummary();
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

closeModal.addEventListener('click', closeCheckoutModal);
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
});

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(summaryDiscount.dataset.discount || 0);
    const delivery = 5.00;
    const total = subtotal - discount + delivery;
    
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    summaryDiscount.textContent = `-$${discount.toFixed(2)}`;
    summaryTotal.textContent = `$${total.toFixed(2)}`;
}

// Promo Code
applyPromo.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (code === 'SWEET20') {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * 0.2;
        summaryDiscount.dataset.discount = discount;
        summaryDiscount.textContent = `-$${discount.toFixed(2)}`;
        updateSummary();
        showToast('Promo code applied! 20% off');
    } else {
        showToast('Invalid promo code');
    }
});

// Place Order
placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById('checkoutForm');
    if (form.checkValidity()) {
        showToast('Order placed successfully! 🎉');
        cart = [];
        updateCart();
        closeCheckoutModal();
        form.reset();
    } else {
        form.reportValidity();
    }
});

// Countdown Timer
function initCountdown() {
    const endDate1 = new Date();
    endDate1.setDate(endDate1.getDate() + 2);
    
    const endDate2 = new Date();
    endDate2.setDate(endDate2.getDate() + 5);
    
    updateCountdown('countdown1', endDate1);
    updateCountdown('countdown2', endDate2);
    
    setInterval(() => {
        updateCountdown('countdown1', endDate1);
        updateCountdown('countdown2', endDate2);
    }, 1000);
}

function updateCountdown(id, endDate) {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) return;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const container = document.getElementById(id);
    if (container) {
        container.querySelector('.days').textContent = String(days).padStart(2, '0');
        container.querySelector('.hours').textContent = String(hours).padStart(2, '0');
        container.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
        container.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
    }
}

// Testimonials Slider
function initTestimonials() {
    const cards = testimonialTrack.querySelectorAll('.testimonial-card');
    const totalSlides = cards.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
    
    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);
}

function goToSlide(index) {
    currentSlide = index;
    const cardWidth = testimonialTrack.querySelector('.testimonial-card').offsetWidth;
    const gap = 32; // 2rem gap
    testimonialTrack.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Gallery Lightbox
function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    
    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
}

function openLightbox(index) {
    currentGalleryIndex = index;
    lightboxImg.src = galleryImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightboxFn() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
}

function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
}

lightboxClose.addEventListener('click', closeLightboxFn);
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightboxFn();
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightboxFn();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// Scroll Reveal
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal, .section-title, .category-card, .offer-card, .about-grid, .gallery-item').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});