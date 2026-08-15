const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    icon: "🎧",
    description: "Immersive sound with a comfortable all-day design."
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 3999,
    icon: "⌚",
    description: "Fitness tracking and smart notifications on your wrist."
  },
  {
    id: 3,
    name: "Classic Sneakers",
    category: "Fashion",
    price: 2199,
    icon: "👟",
    description: "Lightweight everyday sneakers with a clean modern look."
  },
  {
    id: 4,
    name: "Urban Backpack",
    category: "Fashion",
    price: 1599,
    icon: "🎒",
    description: "Spacious backpack for college, work and travel."
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 2899,
    icon: "⌨️",
    description: "Tactile keys with a compact productivity layout."
  },
  {
    id: 6,
    name: "Portable Speaker",
    category: "Electronics",
    price: 1799,
    icon: "🔊",
    description: "Compact Bluetooth speaker with punchy audio."
  }
];

let cart =
  JSON.parse(localStorage.getItem("novacart")) || [];

let currentCategory = "All";

const grid =
  document.getElementById("productGrid");

const search =
  document.getElementById("searchInput");

const panel =
  document.getElementById("cartPanel");

const overlay =
  document.getElementById("overlay");


const money = price =>
  `₹${price.toLocaleString("en-IN")}`;


function renderProducts() {

  const query =
    search.value.toLowerCase().trim();

  const filtered =
    products.filter(product => {

      const categoryMatch =
        currentCategory === "All" ||
        product.category === currentCategory;

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(query) ||

        product.description
          .toLowerCase()
          .includes(query);

      return categoryMatch && searchMatch;
    });


  if (!filtered.length) {

    grid.innerHTML =
      `<div class="empty">
        No products found.
      </div>`;

    return;
  }


  grid.innerHTML =
    filtered.map(product => `

      <article class="product-card">

        <div class="product-image">
          ${product.icon}
        </div>

        <div class="product-info">

          <span class="category">
            ${product.category.toUpperCase()}
          </span>

          <h3>
            ${product.name}
          </h3>

          <p>
            ${product.description}
          </p>

          <div class="price-row">

            <span class="price">
              ${money(product.price)}
            </span>

            <button
              class="add-btn"
              onclick="addToCart(${product.id})"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </article>

    `).join("");
}


function addToCart(id) {

  const item =
    cart.find(product => product.id === id);

  if (item) {

    item.quantity++;

  } else {

    cart.push({
      id: id,
      quantity: 1
    });

  }

  saveCart();
  openCart();
}


function removeFromCart(id) {

  cart =
    cart.filter(item => item.id !== id);

  saveCart();
}


function saveCart() {

  localStorage.setItem(
    "novacart",
    JSON.stringify(cart)
  );

  renderCart();
}


function renderCart() {

  const cartItems =
    document.getElementById("cartItems");

  if (!cart.length) {

    cartItems.innerHTML =
      `<div class="empty">
        Your cart is empty.
      </div>`;

  } else {

    cartItems.innerHTML =
      cart.map(item => {

        const product =
          products.find(
            p => p.id === item.id
          );

        return `

          <div class="cart-item">

            <div>

              <strong>
                ${product.icon}
                ${product.name}
              </strong>

              <br>

              <small>
                ${money(product.price)}
                × ${item.quantity}
              </small>

            </div>

            <button
              class="remove-btn"
              onclick="removeFromCart(${product.id})"
            >
              Remove
            </button>

          </div>

        `;

      }).join("");

  }


  const count =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  const total =
    cart.reduce(
      (sum, item) => {

        const product =
          products.find(
            p => p.id === item.id
          );

        return sum +
          product.price *
          item.quantity;

      },
      0
    );


  document.getElementById(
    "cartCount"
  ).textContent = count;


  document.getElementById(
    "cartTotal"
  ).textContent = money(total);
}


function openCart() {

  panel.classList.add("open");
  overlay.classList.add("show");

}


function closeCart() {

  panel.classList.remove("open");
  overlay.classList.remove("show");

}


document.getElementById(
  "cartBtn"
).onclick = openCart;


document.getElementById(
  "closeCart"
).onclick = closeCart;


overlay.onclick = closeCart;


search.oninput = renderProducts;


document
  .querySelectorAll("#filters button")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll("#filters button")
        .forEach(btn =>
          btn.classList.remove("active")
        );

      button.classList.add("active");

      currentCategory =
        button.dataset.category;

      renderProducts();
    };

  });


document.getElementById(
  "checkoutBtn"
).onclick = () => {

  if (!cart.length) {

    alert("Your cart is empty.");
    return;

  }

  alert(
    "Demo checkout successful! Thank you for shopping."
  );

  cart = [];

  saveCart();

  closeCart();

};


renderProducts();
renderCart();