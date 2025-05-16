document.addEventListener('DOMContentLoaded', () => {
    // Initialize Cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update Cart Count
    const updateCartCount = () => {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('#cart-count').forEach(span => {
            span.textContent = cartCount;
        });
    };

    // Update Cart Display
    const updateCartDisplay = () => {
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        if (!cartItemsDiv) return;

        cartItemsDiv.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${ (item.price * item.quantity).toFixed(2) }</span>
                <button data-index="${index}">Remove</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = total.toFixed(2);

        // Add Remove Button Listeners
        cartItemsDiv.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();
            });
        });
    };

    // Add to Cart
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${name} added to cart!`);
        });
    });

    // Clear Cart
    const clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        });
    }

    // Product Filtering
    const categoryFilter = document.getElementById('category');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            const category = categoryFilter.value;
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // Initial Updates
    updateCartCount();
    updateCartDisplay();
});