// Connect to backend
const BASE_URL = "http://localhost:3000";

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
    button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');
        
        // Check if item already in cart
        const existingItem = cart.find(item => item.id === id);
        var quant;

        const addIt = quant < 2 ? `${BASE_URL}/add` : `${BASE_URL}/update/${id}`;
        const method = quant < 2 ? 'POST' : 'PUT';
        console.log("!");

        if (existingItem) {
            existingItem.quantity += 1;
            quant = existingItem.quantity;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
            quant = 1;
        }
        const toTable = {id, name, price, quant};
        console.log(JSON.stringify(toTable));
        const response = await fetch(addIt, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(toTable),
        });
        if (response.ok) {
            console.log("Yes");
        } else {
            console.log("No");
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

//-----------------------------------------------------------------------------------------------

function faqAnswers() {
    let question = document.getElementById("frequentyasked").value;
    if (question == q1) {
        document.getElementById("result").innerHTML = `
            <p>Here at Hardware Express, we sell a wide variety of home hardware tools,
            from DIY materials like wood, paint, nails and such, to tools like power drills
            and screwdrivers, to more practical things like safety gear.</p>
        `;
    } else if (question == q2) {
        document.getElementById("result").innerHTML = `
            <p>We regularly restock every Sunday.</p>
        `;
    } else if (question == q3) {
        document.getElementById("result").innerHTML = `
            <p>Our website is always open, but deliveries may be delayed to the following
            day depending on the time of day or other outside factors.</p>
        `;
    } else if (question == q4) {
        document.getElementById("result").innerHTML = `
            <p>No. But you can call us to get a refund provided it's been a week since your
            delivery and the warranty/warranties of your purchase(s) haven't been voided.</p>
        `;
    } else if (question == q5) {
        document.getElementById("result").innerHTML = `
            <p>Only to customers who've earned a certain number of points from purchases.</p>
        `;
    } else if (question == q6) {
        document.getElementById("result").innerHTML = `
            <p>Not really, no. Sorry.</p>
        `;
    } else {
        console.log("Nothing.");
    }
}

//-----------------------------------------------------------------------------------------------

// Backend base URL
const BASE_URL = "http://localhost:3000";

async function newAcc() {
    const acc = retrieveData();
    console.log(JSON.stringify(acc))

    try {
        const response = await fetch(`http://localhost:3000/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Charset': 'utf-8',
                'Cache-Control': 'no-cache' },
            body: JSON.stringify(acc),
        });

        if (response.ok) {
            document.getElementById("signupForm").reset(); // Reset the form
        } else {
            window.alert("Error registering account!");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function retrieveData() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) return false;
    console.log({ name, email, password });
    return { name, email, password };
}
