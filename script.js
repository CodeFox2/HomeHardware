// Cart functionality
let cart = [];

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const proceedToCheckout = document.getElementById('proceedToCheckout');
const loadMoreBtn = document.getElementById('load-more');

// Filter elements
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortBy = document.getElementById('sortBy');
const productsGrid = document.getElementById('productsGrid');

// Toggle cart visibility
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Add to cart functionality
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');
        
        // Check if item already in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        updateCart();
        cartModal.style.display = 'block';
    });
});

// Update cart UI
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItems.innerHTML = '<p id="emptyCartMessage">Your cart is empty</p>';
    } else {
        emptyCartMessage.style.display = 'none';
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} (${item.quantity} × $${item.price.toFixed(2)})</div>
                    <div class="cart-item-remove" data-id="${item.id}">Remove</div>
                </div>
            `;
            cartItems.appendChild(cartItemElement);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Save cart to localStorage
    localStorage.setItem('hardwareCart', JSON.stringify(cart));
}

// Proceed to Checkout
proceedToCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items before checkout.');
        return;
    }
    
    // Save cart to localStorage before redirecting
    localStorage.setItem('hardwareCart', JSON.stringify(cart));
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
});

// Close cart when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Filter and Sort functionality
function filterAndSortProducts() {
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    const sortOption = sortBy.value;
    
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    // Filter by category
    if (category !== 'all') {
        productCards.forEach(card => {
            if (card.dataset.category !== category) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
            }
        });
    } else {
        productCards.forEach(card => card.style.display = 'block');
    }
    
    // Filter by price
    if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        productCards.forEach(card => {
            const price = parseFloat(card.dataset.price);
            if ((priceRange.endsWith('+') && price < min) || 
                (!priceRange.endsWith('+') && (price < min || price > max))) {
                card.style.display = 'none';
            } else if (card.style.display !== 'none') {
                card.style.display = 'block';
            }
        });
    }
    
    // Sort products
    const visibleProducts = productCards.filter(card => card.style.display !== 'none');
    
    visibleProducts.sort((a, b) => {
        const aPrice = parseFloat(a.dataset.price);
        const bPrice = parseFloat(b.dataset.price);
        const aTitle = a.querySelector('.product-title').textContent;
        const bTitle = b.querySelector('.product-title').textContent;
        
        switch(sortOption) {
            case 'price-low': return aPrice - bPrice;
            case 'price-high': return bPrice - aPrice;
            case 'name': return aTitle.localeCompare(bTitle);
            default: return 0;
        }
    });
    
    // Reorder products in grid
    visibleProducts.forEach((card, index) => {
        productsGrid.appendChild(card);
    });
}

categoryFilter.addEventListener('change', filterAndSortProducts);
priceFilter.addEventListener('change', filterAndSortProducts);
sortBy.addEventListener('change', filterAndSortProducts);

// Load More functionality
loadMoreBtn.addEventListener('click', () => {
    alert('Loading more products...');
});

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('hardwareCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

loadCart();