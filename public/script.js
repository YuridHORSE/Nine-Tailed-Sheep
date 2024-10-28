document.addEventListener('DOMContentLoaded', function() {
  let cart = JSON.parse(localStorage.getItem('cart')) || []; 

  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const products = document.querySelectorAll('.product-item');

  // Function to perform the search
  function performSearch() {
      let input = searchInput.value.toLowerCase();
      products.forEach(product => {
          let productName = product.dataset.productName.toLowerCase();
          product.style.display = productName.includes(input) ? 'block' : 'none';
      });
  }

  // Search input and button event listeners
  searchInput.addEventListener('input', performSearch);
  searchButton.addEventListener('click', performSearch);

  // Function to add items to the cart
  function addToCart(productName, productPrice, productId) {
      const existingProduct = cart.find(item => item.id === productId);
      if (existingProduct) {
          existingProduct.quantity += 1;
      } else {
          cart.push({
              id: productId,
              name: productName,
              price: parseFloat(productPrice),
              quantity: 1
          });
      }
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
  }

  // Update cart count display
  function updateCart() {
      let cartCount = 0;
      cart.forEach(item => {
          cartCount += item.quantity;
      });
      const cartLink = document.querySelector('.cart a');
      if (cartLink) {
          cartLink.innerText = `Cart (${cartCount})`;
      }
  }

  // Add event listeners to add-to-cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
          const productElement = this.closest('.product-item');
          const productId = productElement.getAttribute('data-id');
          const productName = this.dataset.productName;
          const productPrice = this.dataset.productPrice;
          addToCart(productName, productPrice, productId);
          alert(`${productName} has been added to your cart.`);
      });
  });

  // Display cart items on cart.html
  function displayCart() {
      const cartItemsContainer = document.querySelector('.cart-items');
      if (cartItemsContainer) {
          cartItemsContainer.innerHTML = '';

          if (cart.length === 0) {
              cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
              return;
          }

          cart.forEach(item => {
              const itemElement = document.createElement('div');
              itemElement.className = 'cart-item';
              itemElement.innerHTML = `
                  <p>${item.name}</p>
                  <p>Price: P${item.price.toFixed(2)}</p>
                  <p>Quantity: ${item.quantity}</p>
                  <p>Total: P${(item.price * item.quantity).toFixed(2)}</p>
              `;
              cartItemsContainer.appendChild(itemElement);
          });
      }
  }
});

  /* Handle checkout
  function checkout() {
      if (cart.length === 0) {
          alert('Your cart is empty!');
          return;
      }

      let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      alert(`Your total is P${total.toFixed(2)}. Proceeding to checkout...`);
      window.location.href = 'payment.html'; // Redirect to payment page
  }

  // Load cart items on cart.html
  if (document.querySelector('.cart-items')) {
      displayCart();
  }

  // Handle checkout button click on cart.html
  const checkoutButton = document.getElementById('checkoutButton');
  if (checkoutButton) {
      checkoutButton.addEventListener('click', checkout);
  }

  // Update cart display on page load
  updateCart();
}); */

// Optional: Feature slideshow functionality
let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.getElementsByClassName('mySlides');
  for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  slides[slideIndex - 1].style.display = 'block';
  setTimeout(showSlides, 3000); // Change image every 3 seconds
}

function plusSlides(n) {
  let slides = document.getElementsByClassName('mySlides');
  slideIndex += n;
  if (slideIndex < 1) { slideIndex = slides.length }
  if (slideIndex > slides.length) { slideIndex = 1 }
  for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
  }
}
