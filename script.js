// --- DATA PRODUK (JSON) ---
const products = [
  {
    id: 1,
    name: "Keripik Balado Sanjay",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=2070",
    category: "keripik",
    description:
      "Keripik singkong renyah dengan bumbu balado khas Padang yang pedas gurih. Cocok untuk teman ngopi atau nonton film.",
    spiciness: 4,
    stock: 50,
  },
  {
    id: 2,
    name: "Makaroni Pedas Level 10",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1596564408842-bd0b26901c2b?q=80&w=1887",
    category: "makaroni",
    description:
      "Makaroni panggang renyah dengan level kepedasan yang ekstrim. Hanya untuk yang berani!",
    spiciness: 5,
    stock: 30,
  },
  {
    id: 3,
    name: "Basreng Crispy",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1781",
    category: "baso",
    description:
      "Baso goreng (basreng) dengan tekstur renyah di luar dan kenyal di dalam, dibalur bumbu rahasia pedas gurih.",
    spiciness: 3,
    stock: 40,
  },
  {
    id: 4,
    name: "Mie Lidi Pedas Daun Jeruk",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1610368323141-8d69a1c6a65a?q=80&w=1974",
    category: "baso",
    description:
      "Mie lidi renyah dengan perpaduan rasa pedas dan aroma segar daun jeruk. Gurihnya nampol!",
    spiciness: 2,
    stock: 60,
  },
  {
    id: 5,
    name: "Keripik Usus Ayam",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1965",
    category: "keripik",
    description:
      "Keripik dari usus ayam pilihan yang digoreng kering dan krispi, dengan bumbu pedas manis yang menggugah selera.",
    spiciness: 3,
    stock: 25,
  },
  {
    id: 6,
    name: "Cakue Ayam Pedas",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1887",
    category: "baso",
    description:
      "Cakue dengan isian daging ayam cincang bumbu pedas. Gurih, renyah, dan pedas dalam satu gigitan.",
    spiciness: 4,
    stock: 20,
  },
  {
    id: 7,
    name: "Kerupuk Kulit Sapi",
    price: 30000,
    image:
      "https://plus.unsplash.com/premium_photo-1664474625409-8c43ab8a2ea7?q=80&w=1887",
    category: "keripik",
    description:
      "Kerupuk jengkol (kulit sapi) yang empuk dan renyah dengan bumbu balado yang nendang. Premium snack for you!",
    spiciness: 4,
    stock: 15,
  },
  {
    id: 8,
    name: "Pisang Goreng Madu",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1577194667242-53b103a22dd8?q=80&w=1887",
    category: "keripik",
    description:
      "Pisang kepok goreng krispi dengan baluran madu dan bubuk cabai. Manis, gurih, dan pedas. Perpaduan sempurna!",
    spiciness: 1,
    stock: 35,
  },
];

// --- STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem("snackPedasKuCart")) || [];
let currentFilter = "all";

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCartUI();
});

// --- ALERT CARD FUNCTION ---
function showAlert(message, type = "success") {
  const alertContainer = document.getElementById("alert-container");
  const alertCard = document.createElement("div");
  alertCard.className = `alert-card ${type}`;

  const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

  alertCard.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            `;

  alertContainer.appendChild(alertCard);

  setTimeout(() => {
    alertCard.style.animation = "slideDown 0.5s ease reverse";
    setTimeout(() => {
      alertCard.remove();
    }, 500);
  }, 3000);
}

// --- PAGE NAVIGATION ---
function showPage(pageId) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0); // Scroll to top on page change

  if (pageId === "cart-page") {
    renderCart();
  }
  if (pageId === "checkout-page") {
    renderOrderSummary();
  }
}

// --- MOBILE SEARCH TOGGLE ---
function toggleMobileSearch() {
  const searchBar = document.getElementById("main-search-bar");
  searchBar.classList.toggle("mobile-active");
  if (searchBar.classList.contains("mobile-active")) {
    searchBar.querySelector("input").focus();
  }
}

// --- PRODUCT RENDERING & FILTERING ---
function renderProducts(productsToRender) {
  const productsGrid = document.getElementById("products-grid");
  productsGrid.innerHTML = "";

  if (productsToRender.length === 0) {
    productsGrid.innerHTML =
      '<p class="text-center">Produk tidak ditemukan.</p>';
    return;
  }

  productsToRender.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-card-content">
                        <h3>${product.name}</h3>
                        <div class="spicy-level">${generateSpicyLevelHTML(
                          product.spiciness
                        )}</div>
                        <p class="price">Rp ${product.price.toLocaleString(
                          "id-ID"
                        )}</p>
                        <button class="btn btn-primary" onclick="showProductDetail(${
                          product.id
                        })">Lihat Detail</button>
                    </div>
                `;
    productsGrid.appendChild(productCard);
  });
}

function filterByCategory(category) {
  currentFilter = category;
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  let filteredProducts = products;
  if (category !== "all") {
    filteredProducts = products.filter((p) => p.category === category);
  }
  renderProducts(filteredProducts);
}

function handleSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  let filteredProducts = products;

  if (currentFilter !== "all") {
    filteredProducts = products.filter((p) => p.category === currentFilter);
  }

  const finalFilter = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );

  renderProducts(finalFilter);
}

// --- PRODUCT DETAIL ---
function showProductDetail(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const detailContent = document.getElementById("product-detail-content");
  detailContent.innerHTML = `
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <div class="spicy-level">
                        <strong>Level Pedas:</strong> ${generateSpicyLevelHTML(
                          product.spiciness
                        )}
                    </div>
                    <p class="price">Rp ${product.price.toLocaleString(
                      "id-ID"
                    )}</p>
                    <p class="description">${product.description}</p>
                    <div class="add-to-cart-detail">
                        <div class="quantity-selector">
                            <button onclick="changeQuantity(-1)">-</button>
                            <input type="number" id="detail-quantity" value="1" min="1" readonly>
                            <button onclick="changeQuantity(1)">+</button>
                        </div>
                        <button class="btn btn-primary" onclick="addToCart(${
                          product.id
                        })">
                            <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            `;
  showPage("product-detail-page");
}

function changeQuantity(change) {
  const qtyInput = document.getElementById("detail-quantity");
  let currentQty = parseInt(qtyInput.value);
  currentQty += change;
  if (currentQty < 1) currentQty = 1;
  qtyInput.value = currentQty;
}

// --- CART FUNCTIONS ---
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const quantity = parseInt(document.getElementById("detail-quantity").value);

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity: quantity });
  }

  saveCart();
  updateCartUI();
  showAlert(
    `${product.name} (${quantity}x) berhasil ditambahkan ke keranjang!`
  );
  showPage("homepage");
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function saveCart() {
  localStorage.setItem("snackPedasKuCart", JSON.stringify(cart));
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items-container");
  const cartTotal = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartContainer.innerHTML =
      '<p class="text-center">Keranjang kamu kosong.</p>';
    cartTotal.textContent = "Rp 0";
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">Rp ${item.price.toLocaleString(
                          "id-ID"
                        )}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector">
                            <button onclick="updateCartItemQuantity(${
                              item.id
                            }, -1)">-</button>
                            <input type="text" value="${
                              item.quantity
                            }" readonly>
                            <button onclick="updateCartItemQuantity(${
                              item.id
                            }, 1)">+</button>
                        </div>
                        <i class="fas fa-trash remove-btn" onclick="removeFromCart(${
                          item.id
                        })"></i>
                    </div>
                `;
    cartContainer.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

function updateCartItemQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    renderCart();
    updateCartUI();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  updateCartUI();
  showAlert("Item berhasil dihapus dari keranjang.", "error");
}

// --- CHECKOUT & WHATSAPP REDIRECT ---
function renderOrderSummary() {
  const summaryContainer = document.getElementById("order-summary");
  if (cart.length === 0) {
    summaryContainer.innerHTML = "<p>Keranjang kosong. Tidak ada pesanan.</p>";
    return;
  }

  let summaryHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    summaryHTML += `
                    <div class="summary-item">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>Rp ${itemTotal.toLocaleString("id-ID")}</span>
                    </div>
                `;
    total += itemTotal;
  });

  summaryHTML += `
                <div class="summary-item total">
                    <span>Total Pembayaran</span>
                    <span>Rp ${total.toLocaleString("id-ID")}</span>
                </div>
            `;
  summaryContainer.innerHTML = summaryHTML;
}

function redirectWhatsApp() {
  if (cart.length === 0) {
    showAlert("Keranjang belanja Anda kosong!", "error");
    return;
  }

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const whatsapp = document.getElementById("whatsapp").value;

  if (!name || !address || !whatsapp) {
    showAlert("Mohon lengkapi semua data pada form checkout.", "error");
    return;
  }

  let orderDetails = `*Halo, Saya ingin memesan snack!*%0A%0A`;
  orderDetails += `*Data Pemesan:*%0A`;
  orderDetails += `Nama: ${name}%0A`;
  orderDetails += `Alamat: ${address}%0A`;
  orderDetails += `No. WhatsApp: ${whatsapp}%0A%0A`;

  orderDetails += `*Rincian Pesanan:*%0A`;
  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    orderDetails += `- ${item.name} (x${
      item.quantity
    }) = Rp ${itemTotal.toLocaleString("id-ID")}%0A`;
    total += itemTotal;
  });

  orderDetails += `%0A*Total: Rp ${total.toLocaleString("id-ID")}*%0A%0A`;
  orderDetails += `Mohon konfirmasi ketersediaan barang dan total biaya (jika ada ongkir). Terima kasih!`;

  const adminPhoneNumber = "628563574966";
  const whatsappURL = `https://wa.me/${adminPhoneNumber}?text=${orderDetails}`;

  window.open(whatsappURL, "_blank");

  showAlert(
    "Terima kasih! Anda akan diarahkan ke WhatsApp untuk mengkonfirmasi pesanan."
  );
  cart = [];
  saveCart();
  updateCartUI();
  showPage("homepage");
}

// --- UTILITY FUNCTIONS ---
function generateSpicyLevelHTML(level) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fas fa-pepper-hot ${i <= level ? "active" : ""}"></i>`;
  }
  return html;
}
