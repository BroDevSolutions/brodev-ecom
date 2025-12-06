// --- DATA PRODUK (JSON) ---
const products = [
  {
    id: 1,
    name: "Keripik Balado Sanjay",
    image:
      "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=2070",
    category: "pedas",
    spiciness: 4,
    stock: 50,
    sizes: [
      { label: "250g", price: 15000, originalPrice: 20000 },
      { label: "500g", price: 25000 },
      { label: "1kg", price: 45000, originalPrice: 50000 },
    ],
    description:
      "Keripik singkong renyah dengan bumbu balado khas Padang yang pedas gurih. Cocok untuk teman ngopi atau nonton film.",
  },
  {
    id: 2,
    name: "Makaroni Pedas Level 10",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1781",
    category: "pedas",
    spiciness: 5,
    stock: 30,
    sizes: [
      { label: "100g", price: 18000 },
      { label: "250g", price: 45000, originalPrice: 50000 },
    ],
    description:
      "Makaroni panggang renyah dengan level kepedasan yang ekstrim. Hanya untuk yang berani!",
  },
  {
    id: 3,
    name: "Basreng Crispy",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1781",
    category: "gurih",
    spiciness: 3,
    stock: 40,
    sizes: [
      { label: "150g", price: 22000 },
      { label: "300g", price: 40000, originalPrice: 44000 },
    ],
    description:
      "Baso goreng (basreng) dengan tekstur renyah di luar dan kenyal di dalam, dibalur bumbu rahasia pedas gurih.",
  },
  {
    id: 4,
    name: "Mie Lidi Pedas Daun Jeruk",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1781",
    category: "pedas",
    spiciness: 2,
    stock: 60,
    sizes: [
      { label: "200g", price: 15000 },
      { label: "500g", price: 35000, originalPrice: 40000 },
    ],
    description:
      "Mie lidi renyah dengan perpaduan rasa pedas dan aroma segar daun jeruk. Gurihnya nampol!",
  },
  {
    id: 5,
    name: "Keripik Usus Ayam",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1965",
    category: "gurih",
    spiciness: 3,
    stock: 25,
    sizes: [
      { label: "100g", price: 28000 },
      { label: "250g", price: 65000, originalPrice: 70000 },
    ],
    description:
      "Keripik dari usus ayam pilihan yang digoreng kering dan krispi, dengan bumbu pedas manis yang menggugah selera.",
  },
  {
    id: 6,
    name: "Cakue Ayam Pedas",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1887",
    category: "pedas",
    spiciness: 4,
    stock: 20,
    sizes: [
      { label: "300g", price: 35000 },
      { label: "750g", price: 55000, originalPrice: 60000 },
    ],
    description:
      "Cakue dengan isian daging ayam cincang bumbu pedas. Gurih, renyah, dan pedas dalam satu gigitan.",
  },
  {
    id: 7,
    name: "Kerupuk Kulit Sapi",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1781",
    category: "gurih",
    spiciness: 4,
    stock: 15,
    sizes: [
      { label: "150g", price: 30000 },
      { label: "300g", price: 55000, originalPrice: 60000 },
    ],
    description:
      "Kerupuk jengkol (kulit sapi) yang empuk dan renyah dengan bumbu balado yang nendang. Premium snack for you!",
  },
  {
    id: 8,
    name: "Pisang Goreng Madu",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1781",
    category: "manis",
    spiciness: 1,
    stock: 35,
    sizes: [
      { label: "500g", price: 20000 },
      { label: "1kg", price: 35000, originalPrice: 40000 },
    ],
    description:
      "Pisang kepok goreng krispi dengan baluran madu dan bubuk cabai. Manis, gurih, dan pedas. Perpaduan sempurna!",
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
  // Validasi checkout
  if (pageId === "checkout-page" && cart.length === 0) {
    showAlert(
      "Silakan pilih produk terlebih dahulu sebelum checkout!",
      "error"
    );
    return;
  }

  const target = document.getElementById(pageId);
  if (!target) return;

  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });
  target.classList.add("active");
  window.scrollTo(0, 0);

  // Footer only visible on homepage
  const footerVisiblePages = ["homepage"];
  if (footerVisiblePages.includes(pageId)) {
    document.body.classList.remove("hide-footer");
  } else {
    document.body.classList.add("hide-footer");
  }

  // render specific pages
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
    // if product.sizes exists use it, otherwise fallback to default 250g using product.price
    const sizes =
      product.sizes && product.sizes.length
        ? product.sizes
        : [{ label: "250g", price: product.price }];

    // build size buttons HTML
    const sizesHtml = sizes
      .map((s, idx) => {
        const origAttr = s.originalPrice
          ? `data-original="${s.originalPrice}"`
          : "";
        return `<button class="size-btn ${
          idx === 0 ? "active" : ""
        }" data-price="${s.price}" ${origAttr} onclick="selectSize(this)">${
          s.label
        }</button>`;
      })
      .join("");

    // show original price element (hidden by default)
    const originalPrice = sizes[0].originalPrice
      ? `<span class="price-old">${formatRupiah(sizes[0].originalPrice)}</span>`
      : `<span class="price-old" style="display:none"></span>`;

    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-card-content">
        <h3 title="${product.name}">${product.name}</h3>
        <div class="spicy-level">${generateSpicyLevelHTML(
          product.spiciness
        )}</div>
        <div class="price-row">
          <div class="price">${formatRupiah(sizes[0].price)}</div>
          ${originalPrice}
        </div>
        <div class="size-options">${sizesHtml}</div>
        <div class="product-actions">
          <button class="btn btn-outline" onclick="showProductDetail(${
            product.id
          })">Detail</button>
          <button class="btn btn-primary" onclick="addToCart(${
            product.id
          })"><i class="fas fa-cart-plus"></i> Tambah</button>
        </div>
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

  const sizes =
    product.sizes && product.sizes.length
      ? product.sizes
      : [{ label: "250g", price: product.price }];

  // build size buttons html for detail
  const sizesHtml = sizes
    .map((s, idx) => {
      const origAttr = s.originalPrice
        ? `data-original="${s.originalPrice}"`
        : "";
      return `<button class="size-btn ${
        idx === 0 ? "active" : ""
      }" data-price="${s.price}" ${origAttr} onclick="selectSize(this)">${
        s.label
      }</button>`;
    })
    .join("");

  const originalHTML = sizes[0].originalPrice
    ? `<span class="price-old">${formatRupiah(sizes[0].originalPrice)}</span>`
    : `<span class="price-old" style="display:none"></span>`;

  const detailContent = document.getElementById("product-detail-content");
  detailContent.innerHTML = `
    <div class="product-detail-image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-detail-info">
      <h1>${product.name}</h1>
      <div class="spicy-level"><strong>Level Pedas:</strong> ${generateSpicyLevelHTML(
        product.spiciness
      )}</div>
      <p class="detail-price">${formatRupiah(sizes[0].price)}</p>
      ${originalHTML}
      <p class="description">${product.description}</p>

      <div class="size-options">
        ${sizesHtml}
      </div>

      <div class="add-to-cart-detail">
        <div class="quantity-selector">
          <button onclick="changeQuantity(-1)">-</button>
          <input type="number" id="detail-quantity" value="1" min="1" readonly>
          <button onclick="changeQuantity(1)">+</button>
        </div>
        <button class="btn btn-primary" onclick="addToCart(${product.id})">
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

  // get selected size on detail page if present
  const detailQtyEl = document.getElementById("detail-quantity");
  const quantity = detailQtyEl ? parseInt(detailQtyEl.value) : 1;

  // determine selected size: prefer selection inside product-detail-page, else find selection inside product-card
  let sizeLabel = null;
  let variantPrice = null;
  let variantOriginal = null;

  const detailPage = document.getElementById("product-detail-page");
  if (detailPage && detailPage.classList.contains("active")) {
    const sel = detailPage.querySelector(".size-btn.active");
    if (sel) {
      sizeLabel = sel.textContent.trim();
      variantPrice = Number(sel.dataset.price);
      variantOriginal = sel.dataset.original
        ? Number(sel.dataset.original)
        : null;
    }
  }

  if (!sizeLabel) {
    // find the product card in grid
    const card = Array.from(document.querySelectorAll(".product-card")).find(
      (c) => {
        const h = c.querySelector("h3");
        return h && h.textContent.trim() === product.name;
      }
    );
    const sel = card && card.querySelector(".size-btn.active");
    if (sel) {
      sizeLabel = sel.textContent.trim();
      variantPrice = Number(sel.dataset.price);
      variantOriginal = sel.dataset.original
        ? Number(sel.dataset.original)
        : null;
    }
  }

  // fallback
  if (!sizeLabel) {
    sizeLabel =
      product.sizes && product.sizes[0] && product.sizes[0].label
        ? product.sizes[0].label
        : "250g";
    variantPrice =
      product.sizes && product.sizes[0] && product.sizes[0].price
        ? product.sizes[0].price
        : product.price;
  }

  const existingItem = cart.find(
    (item) => item.id === productId && item.sizeLabel === sizeLabel
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    // store only necessary fields to cart
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      quantity,
      price: variantPrice,
      sizeLabel,
    });
  }

  saveCart();
  updateCartUI();
  showAlert(
    `${product.name} (${sizeLabel}) (${quantity}x) berhasil ditambahkan ke keranjang!`
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
      <div class="cart-item-meta">${
        item.sizeLabel ? item.sizeLabel + " • " : ""
      }Rp ${item.price.toLocaleString("id-ID")}</div>
    </div>
    <div class="cart-item-actions">
      <div class="quantity-selector">
        <button onclick="updateCartItemQuantity(${item.id}, -1, '${
      item.sizeLabel
    }')">-</button>
        <input type="text" value="${item.quantity}" readonly>
        <button onclick="updateCartItemQuantity(${item.id}, 1, '${
      item.sizeLabel
    }')">+</button>
      </div>
      <i class="fas fa-trash remove-btn" onclick="removeFromCart(${item.id}, '${
      item.sizeLabel
    }')"></i>
    </div>
  `;
    cartContainer.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

function updateCartItemQuantity(productId, change, sizeLabel) {
  const item = cart.find(
    (i) => i.id === productId && i.sizeLabel === sizeLabel
  );
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId, sizeLabel);
  } else {
    saveCart();
    renderCart();
    updateCartUI();
  }
}

function removeFromCart(productId, sizeLabel) {
  if (typeof sizeLabel === "undefined") {
    // backward compatibility: if sizeLabel not provided, remove all items with that id
    cart = cart.filter((item) => item.id !== productId);
  } else {
    cart = cart.filter(
      (item) => !(item.id === productId && item.sizeLabel === sizeLabel)
    );
  }
  saveCart();
  renderCart();
  updateCartUI();
  showAlert("Item berhasil dihapus dari keranjang.", "error");
}

// --- CHECKOUT VALIDATION & PAYMENT SYSTEM ---
function validateCheckoutForm() {
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const paymentMethod = document.querySelector(
    'input[name="payment-method"]:checked'
  );

  if (!name) {
    showAlert("Nama lengkap harus diisi!", "error");
    document.getElementById("name").focus();
    return false;
  }

  if (name.length < 3) {
    showAlert("Nama minimal 3 karakter!", "error");
    return false;
  }

  if (!address) {
    showAlert("Alamat lengkap harus diisi!", "error");
    document.getElementById("address").focus();
    return false;
  }

  if (!whatsapp) {
    showAlert("Nomor WhatsApp harus diisi!", "error");
    document.getElementById("whatsapp").focus();
    return false;
  }

  if (!whatsapp.match(/^(08|62)[0-9]{9,12}$/)) {
    showAlert(
      "Nomor WhatsApp tidak valid! Format: 08xx atau 62xx (9-12 digit)",
      "error"
    );
    return false;
  }

  if (!paymentMethod) {
    showAlert("Pilih metode pembayaran terlebih dahulu!", "error");
    return false;
  }

  return true;
}

function processPayment() {
  if (!validateCheckoutForm()) return;

  const paymentMethod = document.querySelector(
    'input[name="payment-method"]:checked'
  ).value;

  // Buka modal pembayaran
  openPaymentModal(paymentMethod);
}

// ----- GLOBAL modal helpers -----
function closeAllModals() {
  const pm = document.getElementById("paymentModal");
  const rm = document.getElementById("receiptModal");
  [pm, rm].forEach((modal) => {
    if (modal) {
      modal.style.animation = "fadeOut 0.2s ease-out";
      setTimeout(() => {
        if (modal && modal.parentElement) modal.parentElement.remove();
      }, 200);
    }
  });
}

// single ESC handler (registered once)
if (!window._snackPedasKuEscHandlerInstalled) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });
  window._snackPedasKuEscHandlerInstalled = true;
}

// ----- Payment modal -----
function openPaymentModal(paymentMethod) {
  // create overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "payment-modal-overlay";
  modalOverlay.id = "paymentModal";

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let paymentHTML = `
    <div class="payment-modal" role="dialog" aria-modal="true" aria-label="Konfirmasi Pembayaran">
      <button class="payment-modal-close" onclick="closePaymentModal()" aria-label="Tutup">✕</button>
      <div class="payment-header" style="background: linear-gradient(135deg, var(--primary-color), #ff8a50);">
        <h2>Konfirmasi Pembayaran</h2>
        <span class="payment-method-badge">${paymentMethod.toUpperCase()}</span>
      </div>
      <div class="payment-content">
  `;

  if (paymentMethod === "transfer-bank") {
    paymentHTML += `
      <div class="payment-instruction">
        <h3>💳 Transfer Bank</h3>
        <div class="bank-info">
          <div class="bank-item" onclick="copyToClipboard('1234567890')">
            <h4>BCA</h4>
            <p class="account-number">1234567890</p>
            <p class="account-name">a.n. Goyal Gayil</p>
            <small>Tap untuk salin</small>
          </div>
          <div class="bank-item" onclick="copyToClipboard('9876543210')">
            <h4>Mandiri</h4>
            <p class="account-number">9876543210</p>
            <p class="account-name">a.n. Goyal Gayil</p>
            <small>Tap untuk salin</small>
          </div>
        </div>
        <p class="payment-note">Jumlah yang harus ditransfer:</p>
        <div class="total-amount">Rp ${total.toLocaleString("id-ID")}</div>
      </div>
    `;
  } else if (paymentMethod === "e-wallet") {
    paymentHTML += `
      <div class="payment-instruction">
        <h3>📱 E-Wallet</h3>
        <div class="ewallet-options">
          <div class="ewallet-item" onclick="copyToClipboard('081234567890')">
            <i class="fas fa-mobile-alt"></i>
            <p>OVO / GCash</p>
            <small>081234567890</small>
          </div>
          <div class="ewallet-item" onclick="copyToClipboard('081234567890')">
            <i class="fas fa-wallet"></i>
            <p>Dana / Linkaja</p>
            <small>081234567890</small>
          </div>
        </div>
        <p class="payment-note">Jumlah yang harus dibayar:</p>
        <div class="total-amount">Rp ${total.toLocaleString("id-ID")}</div>
      </div>
    `;
  } else {
    paymentHTML += `
      <div class="cod-info">
        <h3>🚚 Cash On Delivery</h3>
        <p>Bayar saat barang sampai.</p>
        <div style="margin-top:8px;">
          <strong>Total:</strong> Rp ${total.toLocaleString("id-ID")}
        </div>
      </div>
    `;
  }

  paymentHTML += `
      </div>
      <div class="payment-footer">
        <button class="btn btn-secondary" onclick="closePaymentModal()">Batal</button>
        <button class="btn btn-primary" onclick="completePayment('${paymentMethod}')">Lanjutkan ke Struk Pembelian</button>
      </div>
    </div>
  `;

  modalOverlay.innerHTML = paymentHTML;
  document.body.appendChild(modalOverlay);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeAllModals();
  });
}

function closePaymentModal() {
  const overlay = document.getElementById("paymentModal");
  if (overlay) {
    overlay.style.animation = "fadeOut 0.18s ease-out";
    setTimeout(() => overlay.remove(), 180);
  }
}

// ----- Receipt modal (struk) -----
function generateReceiptModal(paymentMethod) {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = "GYL-" + Date.now().toString().slice(-8);
  const orderDate = new Date().toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const receiptOverlay = document.createElement("div");
  receiptOverlay.className = "receipt-modal-overlay";
  receiptOverlay.id = "receiptModal";

  let receiptHTML = `
    <div class="receipt-modal" role="dialog" aria-modal="true" aria-label="Struk Pesanan">
      <button class="receipt-modal-close" onclick="closeReceiptModal()" aria-label="Tutup">✕</button>
      <div class="receipt-header" style="background: linear-gradient(135deg, var(--success-color), #8bc34a); text-align:center;">
        <h1>🎉 Pesanan Berhasil!</h1>
        <div style="margin-top:6px;"><strong>ID:</strong> ${orderId}</div>
      </div>
      <div class="receipt-content">
        <div class="receipt-id">
          <p class="label">ID Pesanan</p>
          <p class="value">${orderId}</p>
        </div>

        <div class="receipt-section">
          <h3>Informasi Pemesan</h3>
          <div class="receipt-detail"><span class="label">Nama:</span><span class="value">${name}</span></div>
          <div class="receipt-detail"><span class="label">Alamat:</span><span class="value">${address}</span></div>
          <div class="receipt-detail"><span class="label">WhatsApp:</span><span class="value">${whatsapp}</span></div>
        </div>

        <div class="receipt-section">
          <h3>Detail Pesanan</h3>
          <div class="receipt-items">
  `;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    receiptHTML += `
      <div class="receipt-item">
        <div class="item-info">
          <p class="item-name">${item.name}</p>
          <p class="item-qty">${
            item.quantity
          }x @ Rp ${item.price.toLocaleString("id-ID")}</p>
        </div>
        <p class="item-price">Rp ${itemTotal.toLocaleString("id-ID")}</p>
      </div>
    `;
  });

  receiptHTML += `
          </div>
        </div>

        <div class="receipt-total">
          <div class="total-row"><span class="label">Subtotal:</span><span class="value">Rp ${total.toLocaleString(
            "id-ID"
          )}</span></div>
          <div class="total-row"><span class="label">Ongkir:</span><span class="value">TBD</span></div>
          <div class="total-row final"><span class="label">Total:</span><span class="value">Rp ${total.toLocaleString(
            "id-ID"
          )}</span></div>
        </div>

        <div class="receipt-section">
          <h3>Metode Pembayaran</h3>
          <p class="payment-badge">${
            paymentMethod === "transfer-bank"
              ? "💳 Transfer Bank"
              : paymentMethod === "e-wallet"
              ? "📱 E-Wallet"
              : "🚚 COD"
          }</p>
        </div>

        <div class="receipt-instructions">
          <h3>Instruksi Selanjutnya</h3>
          <ol>
            <li>Konfirmasi pesanan via WhatsApp ke Admin</li>
            <li>Selesaikan pembayaran sesuai metode</li>
            <li>Tunggu verifikasi dari Admin</li>
            <li>Pengiriman setelah terverifikasi</li>
          </ol>
        </div>

        
        </div>
        
        <div class="receipt-footer">
        <div class="receipt-contact">
          <h3>Kirim ke Admin</h3>
          <a href="https://wa.me/628563574966?text=Saya%20ingin%20konfirmasi%20pesanan%20${orderId}" class="btn btn-primary" target="_blank"><i class="fab fa-whatsapp"></i> Hubungi Admin</a>
        </div>
        <button class="btn btn-secondary" onclick="printReceipt()"><i class="fas fa-print"></i> Cetak</button>
        <button class="btn btn-primary" onclick="finishOrder()"><i class="fas fa-home"></i> Selesai</button>
      </div>
    </div>
  `;

  receiptOverlay.innerHTML = receiptHTML;
  document.body.appendChild(receiptOverlay);

  // overlay click untuk tutup
  receiptOverlay.addEventListener("click", (e) => {
    if (e.target === receiptOverlay) closeAllModals();
  });

  // simpan order seperti sebelumnya
  saveOrder(orderId, name, address, whatsapp, paymentMethod, total, orderDate);
}

function closeReceiptModal() {
  const overlay = document.getElementById("receiptModal");
  if (overlay) {
    overlay.style.animation = "fadeOut 0.18s ease-out";
    setTimeout(() => overlay.remove(), 180);
  }
}

function completePayment(paymentMethod) {
  closePaymentModal();
  generateReceiptModal(paymentMethod);
}

// --- ORDER SUMMARY RENDERING ---
function renderOrderSummary() {
  const container = document.getElementById("order-summary");
  if (!container) return;

  container.innerHTML = "";

  if (!cart || cart.length === 0) {
    container.innerHTML =
      '<p class="text-center" style="color:#777;padding:12px">Keranjang kosong.</p>';
    return;
  }

  // buat list item ringkasan
  const list = document.createElement("div");
  list.className = "order-summary-list";
  list.style.display = "grid";
  list.style.gap = "10px";

  let subtotal = 0;
  cart.forEach((item) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.padding = "8px";
    row.style.borderRadius = "8px";
    row.style.background = "#fff";
    row.style.border = "1px solid var(--border-color)";

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.flexDirection = "column";
    left.style.gap = "4px";

    const name = document.createElement("div");
    name.textContent = item.name;
    name.style.fontWeight = "600";
    name.style.color = "var(--dark-color)";
    name.style.fontSize = "0.95rem";

    const meta = document.createElement("div");
    meta.style.fontSize = "0.85rem";
    meta.style.color = "#777";
    meta.textContent = `${item.quantity} × Rp ${item.price.toLocaleString(
      "id-ID"
    )}`;

    left.appendChild(name);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.style.fontWeight = "700";
    right.style.color = "var(--primary-color)";
    const itemTotal = item.price * item.quantity;
    right.textContent = `Rp ${itemTotal.toLocaleString("id-ID")}`;

    row.appendChild(left);
    row.appendChild(right);

    list.appendChild(row);

    subtotal += itemTotal;
  });

  container.appendChild(list);

  // ringkasan total
  const summaryBox = document.createElement("div");
  summaryBox.style.marginTop = "12px";
  summaryBox.style.padding = "10px";
  summaryBox.style.borderRadius = "10px";
  summaryBox.style.background = "#fafafa";
  summaryBox.style.border = "1px solid var(--border-color)";

  summaryBox.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <div style="color:#666">Subtotal</div>
      <div style="font-weight:700;color:var(--dark-color)">Rp ${subtotal.toLocaleString(
        "id-ID"
      )}</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <div style="color:#666">Ongkir</div>
      <div style="font-weight:700;color:var(--dark-color)">TBD</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:6px;border-top:1px solid #eee">
      <div style="font-weight:700;color:var(--dark-color)">Total</div>
      <div style="font-weight:900;color:var(--primary-color);font-size:1rem">Rp ${subtotal.toLocaleString(
        "id-ID"
      )}</div>
    </div>
  `;

  container.appendChild(summaryBox);
}

function saveOrder(
  orderId,
  name,
  address,
  whatsapp,
  paymentMethod,
  total,
  orderDate
) {
  const order = {
    orderId,
    name,
    address,
    whatsapp,
    paymentMethod,
    total,
    orderDate,
    items: JSON.parse(JSON.stringify(cart)),
  };

  const ordersKey = "snackPedasKuOrders";
  let orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
  orders.push(order);
  localStorage.setItem(ordersKey, JSON.stringify(orders));
}

// --- PRINT RECEIPT ACTIONS ---
function printReceipt() {
  window.print();
}

function finishOrder() {
  closeReceiptModal();

  // kosongkan cart
  cart = [];
  saveCart();
  updateCartUI();

  showPage("homepage");
  showAlert("Terima kasih! Pesanan Anda telah berhasil dibuat.", "success");
}

// --- UTILITY FUNCTIONS ---
function generateSpicyLevelHTML(level) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fas fa-pepper-hot ${i <= level ? "active" : ""}"></i>`;
  }
  return html;
}

function toggleMobileMenu(open) {
  const menu = document.getElementById("mobileMenu");
  const attr = menu.getAttribute("aria-hidden") === "false";
  if (typeof open === "boolean") {
    menu.setAttribute("aria-hidden", (!open).toString());
  } else {
    menu.setAttribute("aria-hidden", (!attr).toString());
  }
  if (menu.getAttribute("aria-hidden") === "false") {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

function formatRupiah(n) {
  if (n == null) return "-";
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function selectSize(btn) {
  if (!btn) return;
  const container = btn.closest(".size-options");
  if (!container) return;
  container
    .querySelectorAll(".size-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  // update price display inside card/detail
  const card =
    btn.closest(".product-card") || btn.closest(".product-detail-info");
  if (!card) return;

  const priceEl =
    card.querySelector(".price") || card.querySelector(".detail-price");
  const originalEl = card.querySelector(".price-old");

  const price = Number(btn.dataset.price);
  const original = btn.dataset.original ? Number(btn.dataset.original) : null;

  if (priceEl) priceEl.textContent = formatRupiah(price);
  if (originalEl) {
    if (original) {
      originalEl.textContent = formatRupiah(original);
      originalEl.style.display = "inline-block";
    } else {
      originalEl.style.display = "none";
    }
  }
}
