// --- DATA PRODUK (JSON) ---
const PREMIUM_PACK_PRICE = 2000;

const products = [
  {
    id: 1,
    name: "Jamur Crispy",
    image: "image/jamurCrispy.jpg",
    images: [
      "image/jamurCrispy.jpg",
      "image/jamurCrispy_500g.jpg",
      "image/jamurCrispy2.jpg",
    ],
    category: "original",
    stock: 50,
    sizes: [{ label: "500g", price: 42000, originalPrice: 50000 }],
    description:
      "Jamur crispy gurih dengan balutan tepung bumbu spesial. Cocok untuk camilan atau pelengkap hidangan favoritmu.",
  },
  {
    id: 2,
    name: "Tahu Luntas (Original)",
    image: "image/TahuLuntasOriginal_250g.jpg",
    images: [
      "image/TahuLuntasOriginal_250g.jpg",
      "image/TahuLuntasOriginal_500g.jpg",
      "image/TahuLuntasOriginal_1kg.jpg",
      "image/LuntasPedas_250g.jpg",
    ],
    category: "original",
    spiciness: 5,
    stock: 30,
    sizes: [
      { label: "250g", price: 17000, originalPrice: 23000 },
      { label: "500g", price: 33000 },
      { label: "1kg", price: 65000, originalPrice: 70000 },
    ],
    description:
      "Tahu Luntas goreng dengan bumbu khas — renyah di luar, lembut di dalam. Pilihan populer.",
  },
  {
    id: 3,
    name: "Pisang Manis",
    image: "image/pisangManis_500g.jpg",
    images: ["image/pisangManis_500g.jpg", "image/pisangManis_1kg.jpg"],
    category: "manis",
    spiciness: 0,
    stock: 40,
    sizes: [
      { label: "500g", price: 20000 },
      { label: "1kg", price: 35000, originalPrice: 40000 },
    ],
    description:
      "Pisang goreng madu krispi — manis, gurih, dan cocok untuk cemilan keluarga.",
  },
  {
    id: 4,
    name: "Pare / Kerupuk Lokal",
    image: "image/pare_500g.jpg",
    images: ["image/pare_500g.jpg", "image/pare_1kg.jpg"],
    category: "gurih",
    spiciness: 3,
    stock: 25,
    sizes: [
      { label: "500g", price: 28000 },
      { label: "1kg", price: 65000 },
    ],
    description:
      "Keripik lokal renyah sebagai pengganti gambar default.",
  },
  {
    id: 5,
    name: "Tahu Luntas Pedas",
    image: "image/tahuLuntasPedas_1kg.jpg",
    images: [
      "image/tahuLuntasPedas_1kg.jpg",
      "image/LuntasPedas_250g.jpg",
    ],
    category: "pedas",
    spiciness: 4,
    stock: 20,
    sizes: [
      { label: "250g", price: 15000 },
      { label: "1kg", price: 55000 },
    ],
    description:
      "Varian pedas Tahu Luntas untuk yang suka rentetan rasa pedas.",
  },
  {
    id: 6,
    name: "Kerupuk / Camilan Besar",
    image: "image/pare_1kg.jpg",
    images: ["image/pare_1kg.jpg"],
    category: "gurih",
    spiciness: 2,
    stock: 15,
    sizes: [{ label: "1kg", price: 55000 }],
    description:
      "Paket besar untuk yang ingin stok camilan di rumah.",
  },
  {
    id: 7,
    name: "Pisang (Varian)",
    image: "image/pisangManis_1kg.jpg",
    images: [
      "image/pisangManis_1kg.jpg",
      "image/pisangManis_500g.jpg",
    ],
    category: "manis",
    spiciness: 0,
    stock: 35,
    sizes: [
      { label: "500g", price: 20000 },
      { label: "1kg", price: 35000 },
    ],
    description:
      "Varian pisang goreng untuk konsumen yang ingin paket lebih besar.",
  },
];

// --- STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem("snackPedasKuCart")) || [];
let currentFilter = "all";
window._detailCarousel = { imgs: [], index: 0 };

// inject responsive styles for detail carousel/layout
(function injectDetailStyles() {
  const css = `
  /* Detail carousel responsive styles */
  .product-detail-gallery { display:flex; gap:12px; align-items:flex-start; flex-wrap:wrap; }
  .product-detail-compact { position:relative; width:260px; height:260px; border-radius:10px; overflow:hidden; border:1px solid var(--border-color); background:#fff; flex:0 0 260px; }
  .product-detail-compact img { width:100%; height:100%; object-fit:cover; display:block; transition: transform .28s ease; }
  .product-detail-compact img:hover { transform: scale(1.03); }
  .detail-thumb { width:64px; height:64px; object-fit:cover; border-radius:8px; cursor:pointer; border:1px solid var(--border-color); opacity:0.95; }
  .detail-thumb.active { box-shadow:0 6px 14px rgba(0,0,0,0.12); border-color:var(--primary-color); opacity:1; transform:translateY(-2px); }
  #detail-thumbs { display:flex; gap:8px; overflow:auto; padding-top:6px; -webkit-overflow-scrolling:touch; }
  @media (max-width: 760px) {
    .product-detail-compact { width:100%; height:300px; flex-basis:100%; }
    .product-detail-gallery { flex-direction:column; }
    .detail-thumb { width:72px; height:72px; }
    .product-detail-info h1 { font-size:1.05rem; }
  }
  @media (max-width: 420px) {
    .product-detail-compact { height:320px; }
    .detail-thumb { width:56px; height:56px; }
  }
  .pack-label { display:inline-flex; align-items:center; gap:8px; margin-top:8px; font-size:0.95rem; color:var(--dark-color); }
  .pack-label input { width:16px; height:16px; }
  .pack-note { font-size:0.85rem; color:#666; margin-left:8px; }
  `;
  const s = document.createElement("style");
  s.innerHTML = css;
  document.head.appendChild(s);
})();

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCartUI();
});

// --- ALERT CARD FUNCTION ---
function showAlert(message, type = "success") {
  const alertContainer = document.getElementById("alert-container");
  if (!alertContainer) return;
  const alertCard = document.createElement("div");
  alertCard.className = `alert-card ${type}`;

  const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

  alertCard.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

  alertContainer.appendChild(alertCard);

  setTimeout(() => {
    alertCard.style.animation = "slideDown 0.5s ease reverse";
    setTimeout(() => alertCard.remove(), 500);
  }, 3000);
}

// --- PAGE NAVIGATION ---
function showPage(pageId) {
  if (pageId === "checkout-page" && cart.length === 0) {
    showAlert(
      "Silakan pilih produk terlebih dahulu sebelum checkout!",
      "error"
    );
    return;
  }
  const target = document.getElementById(pageId);
  if (!target) return;
  document
    .querySelectorAll(".page-section")
    .forEach((section) => section.classList.remove("active"));
  target.classList.add("active");
  window.scrollTo(0, 0);
  const footerVisiblePages = ["homepage"];
  if (footerVisiblePages.includes(pageId))
    document.body.classList.remove("hide-footer");
  else document.body.classList.add("hide-footer");
  if (pageId === "cart-page") renderCart();
  if (pageId === "checkout-page") renderOrderSummary();
}

// --- MOBILE SEARCH TOGGLE ---
function toggleMobileSearch() {
  const searchBar = document.getElementById("main-search-bar");
  if (!searchBar) return;
  searchBar.classList.toggle("mobile-active");
  if (searchBar.classList.contains("mobile-active")) {
    const input = searchBar.querySelector("input");
    if (input) input.focus();
  }
}

// --- PRODUCT RENDERING & FILTERING ---
function renderProducts(productsToRender) {
  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return;
  productsGrid.innerHTML = "";
  if (!productsToRender || productsToRender.length === 0) {
    productsGrid.innerHTML =
      '<p class="text-center">Produk tidak ditemukan.</p>';
    return;
  }
  productsToRender.forEach((product) => {
    const sizes =
      product.sizes && product.sizes.length
        ? product.sizes
        : [{ label: "250g", price: product.price }];
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
    const originalPrice = sizes[0].originalPrice
      ? `<span class="price-old">${formatRupiah(sizes[0].originalPrice)}</span>`
      : `<span class="price-old" style="display:none"></span>`;
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-card-content">
        <h3 title="${product.name}">${product.name}</h3>
        <div class="spicy-level">${generateLevelHTML(product)}</div>
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
  document
    .querySelectorAll(".category-btn")
    .forEach((btn) => btn.classList.remove("active"));
  if (typeof event !== "undefined" && event && event.target)
    event.target.classList.add("active");
  let filteredProducts = products;
  if (category !== "all")
    filteredProducts = products.filter((p) => p.category === category);
  renderProducts(filteredProducts);
}

function handleSearch() {
  const input = document.getElementById("searchInput");
  const searchTerm = input ? input.value.toLowerCase() : "";
  let filteredProducts = products;
  if (currentFilter !== "all")
    filteredProducts = products.filter((p) => p.category === currentFilter);
  const finalFilter = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );
  renderProducts(finalFilter);
}

// --- PRODUCT DETAIL (compact responsive carousel + packaging option) ---
function showProductDetail(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  const sizes =
    product.sizes && product.sizes.length
      ? product.sizes
      : [{ label: "250g", price: product.price }];
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
  const imgs =
    product.images && product.images.length ? product.images : [product.image];

  const galleryHTML = `
    <div class="product-detail-gallery">
      <div class="product-detail-compact">
        <button id="detail-prev" aria-label="Sebelumnya" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);z-index:20;background:rgba(0,0,0,0.35);color:#fff;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer">‹</button>
        <button id="detail-next" aria-label="Selanjutnya" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);z-index:20;background:rgba(0,0,0,0.35);color:#fff;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer">›</button>
        <img id="detail-main-image" src="${imgs[0]}" alt="${product.name}">
      </div>

      <div class="product-detail-info" style="flex:1;min-width:200px;max-width:720px;">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h1 style="margin:0;font-size:1.15rem">${product.name}</h1>
          <button id="thumb-toggle" class="btn btn-outline" style="font-size:0.85rem;padding:6px 8px">Gambar</button>
        </div>

        <div style="margin-top:8px">
          <div class="spicy-level"><strong>${
            product.category === "manis" ? "Level Manis" : "Level Pedas"
          }:</strong> ${generateLevelHTML(product)}</div>
          <p class="detail-price" style="margin:6px 0 0">${formatRupiah(
            sizes[0].price
          )}</p>
          ${originalHTML}
        </div>

        <p class="description" style="color:#444;margin-top:8px">${
          product.description
        }</p>

        <div style="margin-top:8px">
          <div class="size-options">${sizesHtml}</div>
        </div>

        <label class="pack-label">
          <input type="checkbox" id="detail-premium-pack">
          <span>Kemasan Premium</span>
          <span class="pack-note">(+ ${formatRupiah(PREMIUM_PACK_PRICE)})</span>
        </label>

        <div style="margin-top:12px">
          <div class="add-to-cart-detail" style="display:flex;gap:8px;align-items:center">
            <div class="quantity-selector" style="display:flex;align-items:center;gap:6px">
              <button onclick="changeQuantity(-1)">-</button>
              <input type="number" id="detail-quantity" value="1" min="1" readonly style="width:56px;text-align:center">
              <button onclick="changeQuantity(1)">+</button>
            </div>
            <button class="btn btn-primary" onclick="addToCart(${
              product.id
            })"><i class="fas fa-cart-plus"></i> Tambah ke Keranjang</button>
          </div>
        </div>

        <div id="detail-thumbs" style="margin-top:12px;display:none;">
          ${imgs
            .map(
              (src, idx) =>
                `<img class="detail-thumb ${
                  idx === 0 ? "active" : ""
                }" data-idx="${idx}" src="${src}" alt="${product.name} - ${
                  idx + 1
                }">`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  const detailContent = document.getElementById("product-detail-content");
  if (!detailContent) return;
  detailContent.innerHTML = galleryHTML;
  // --- update harga saat checkbox kemasan berubah ---
  const packEl = document.getElementById("detail-premium-pack");
  const priceEl = document.querySelector(".detail-price");
  function updateDetailPrice() {
    const sel = document.querySelector(".size-btn.active");
    const base = sel
      ? Number(sel.dataset.price)
      : sizes && sizes[0]
      ? Number(sizes[0].price)
      : 0;
    const pack = packEl && packEl.checked ? PREMIUM_PACK_PRICE : 0;
    if (priceEl) priceEl.textContent = formatRupiah(base + pack);
  }
  if (packEl) {
    packEl.addEventListener("change", updateDetailPrice);
  }
  // pastikan inisialisasi harga sesuai keadaan awal (size + pack)
  updateDetailPrice();
  showPage("product-detail-page");
  initDetailCarousel(imgs);
}

// initialize carousel handlers and state
function initDetailCarousel(imgs) {
  window._detailCarousel = { imgs: imgs.slice(), index: 0 };
  const prevBtn = document.getElementById("detail-prev");
  const nextBtn = document.getElementById("detail-next");
  const mainImg = document.getElementById("detail-main-image");
  const thumbToggle = document.getElementById("thumb-toggle");
  const thumbs = document.querySelectorAll(".detail-thumb");
  const thumbsWrapper = document.getElementById("detail-thumbs");

  function updateMain(i) {
    if (!window._detailCarousel || !window._detailCarousel.imgs) return;
    const imgsArr = window._detailCarousel.imgs;
    window._detailCarousel.index = (i + imgsArr.length) % imgsArr.length;
    if (mainImg) mainImg.src = imgsArr[window._detailCarousel.index];
    thumbs.forEach((t) => {
      const idx = Number(t.dataset.idx || 0);
      t.classList.toggle("active", idx === window._detailCarousel.index);
      if (t.classList.contains("active") && thumbsWrapper) {
        try {
          t.scrollIntoView({ inline: "center", behavior: "smooth" });
        } catch (e) {}
      }
    });
  }

  function prev() {
    updateMain(window._detailCarousel.index - 1);
  }
  function next() {
    updateMain(window._detailCarousel.index + 1);
  }

  if (prevBtn) {
    prevBtn.onclick = prev;
  }
  if (nextBtn) {
    nextBtn.onclick = next;
  }

  thumbs.forEach((t) => {
    t.onclick = function () {
      updateMain(Number(this.dataset.idx));
    };
  });

  if (thumbToggle && thumbsWrapper) {
    thumbToggle.onclick = function () {
      if (
        thumbsWrapper.style.display === "none" ||
        thumbsWrapper.style.display === ""
      ) {
        thumbsWrapper.style.display = "flex";
        thumbsWrapper.style.gap = "8px";
        thumbsWrapper.style.paddingTop = "6px";
        thumbsWrapper.style.flexWrap = "nowrap";
        thumbsWrapper.style.overflowX = "auto";
      } else {
        thumbsWrapper.style.display = "none";
      }
    };
  }

  function keyHandler(e) {
    if (
      !document
        .getElementById("product-detail-page")
        ?.classList.contains("active")
    )
      return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }
  document.addEventListener("keydown", keyHandler);

  // swipe support
  let startX = null;
  if (mainImg) {
    mainImg.addEventListener("pointerdown", (ev) => {
      startX = ev.clientX;
      mainImg.setPointerCapture(ev.pointerId);
    });
    mainImg.addEventListener("pointerup", (ev) => {
      if (startX == null) return;
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 30) {
        if (dx > 0) prev();
        else next();
      }
      startX = null;
    });
  }

  updateMain(0);
}

// helper kept for other usages
function changeDetailImage(el) {
  if (!el) return;
  const idx = Number(el.dataset.idx);
  if (!isNaN(idx)) {
    if (window._detailCarousel && window._detailCarousel.imgs) {
      const i = idx % window._detailCarousel.imgs.length;
      window._detailCarousel.index = i;
      const mainImg = document.getElementById("detail-main-image");
      if (mainImg) mainImg.src = window._detailCarousel.imgs[i];
    }
  } else {
    const mainImg = document.getElementById("detail-main-image");
    if (mainImg) mainImg.src = el.src;
  }
  document
    .querySelectorAll(".detail-thumb")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
}

function changeQuantity(change) {
  const qtyInput = document.getElementById("detail-quantity");
  if (!qtyInput) return;
  let currentQty = parseInt(qtyInput.value) || 1;
  currentQty += change;
  if (currentQty < 1) currentQty = 1;
  qtyInput.value = currentQty;
}

// --- CART FUNCTIONS ---
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  const detailQtyEl = document.getElementById("detail-quantity");
  const quantity = detailQtyEl ? parseInt(detailQtyEl.value) : 1;

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

  // packaging option from detail page (checkbox)
  const packEl = document.getElementById("detail-premium-pack");
  const packaging = packEl ? Boolean(packEl.checked) : false;
  const packagingPrice = packaging ? PREMIUM_PACK_PRICE : 0;

  // final per-item price includes packaging surcharge
  const finalPrice = Number(variantPrice) + packagingPrice;

  // find existing item - include packaging flag and size to differentiate
  const existingItem = cart.find(
    (item) =>
      item.id === productId &&
      item.sizeLabel === sizeLabel &&
      Boolean(item.packaging) === packaging
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      quantity,
      price: finalPrice,
      basePrice: Number(variantPrice),
      sizeLabel,
      packaging,
      packagingPrice,
    });
  }

  saveCart();
  updateCartUI();
  showAlert(
    `${product.name} (${sizeLabel})${
      packaging ? " • Kemasan Premium" : ""
    } (${quantity}x) berhasil ditambahkan ke keranjang!`
  );
  showPage("homepage");
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function saveCart() {
  localStorage.setItem("snackPedasKuCart", JSON.stringify(cart));
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items-container");
  const cartTotal = document.getElementById("cart-total");
  if (!cartContainer || !cartTotal) return;
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
    const packagingCheckedAttr = item.packaging ? "checked" : "";
    const packagingCheckbox = `
      <label style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:#444;margin-top:6px">
        <input type="checkbox" onchange="updateCartItemPackaging(${item.id}, '${
      item.sizeLabel
    }', this.checked)" ${packagingCheckedAttr}>
        Kemasan Premium (+ ${formatRupiah(PREMIUM_PACK_PRICE)})
      </label>
    `;

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <div class="cart-item-meta">${
          item.sizeLabel ? item.sizeLabel + " • " : ""
        }${formatRupiah(item.basePrice || item.price)} ${
      item.packaging ? `+ ${formatRupiah(item.packagingPrice)}` : ""
    }</div>
        ${
          item.packaging
            ? `<div style="font-size:0.85rem;color:#666">Kemasan Premium +${formatRupiah(
                item.packagingPrice
              )}</div>`
            : ""
        }
        ${packagingCheckbox}
      </div>
      <div class="cart-item-actions">
        <div class="quantity-selector">
          <button onclick="updateCartItemQuantity(${item.id}, -1, '${
      item.sizeLabel
    }', ${item.packaging ? "true" : "false"})">-</button>
          <input type="text" value="${item.quantity}" readonly>
          <button onclick="updateCartItemQuantity(${item.id}, 1, '${
      item.sizeLabel
    }', ${item.packaging ? "true" : "false"})">+</button>
        </div>
        <i class="fas fa-trash remove-btn" onclick="removeFromCart(${
          item.id
        }, '${item.sizeLabel}', ${item.packaging ? "true" : "false"})"></i>
      </div>
    `;
    cartContainer.appendChild(cartItem);
    total += item.price * item.quantity;
  });
  cartTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

function updateCartItemQuantity(productId, change, sizeLabel, packaging) {
  const item = cart.find(
    (i) =>
      i.id === productId &&
      i.sizeLabel === sizeLabel &&
      Boolean(i.packaging) === Boolean(packaging)
  );
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId, sizeLabel, packaging);
  } else {
    saveCart();
    renderCart();
    updateCartUI();
  }
}

function updateCartItemPackaging(productId, sizeLabel, packaging) {
  const item = cart.find(
    (i) => i.id === productId && i.sizeLabel === sizeLabel
  );
  if (!item) return;
  item.packaging = Boolean(packaging);
  item.packagingPrice = item.packaging ? PREMIUM_PACK_PRICE : 0;
  // harga per unit = basePrice + packagingPrice
  item.price =
    (Number(item.basePrice) || Number(item.price) || 0) + item.packagingPrice;
  saveCart();
  renderCart();
  updateCartUI();
}

function removeFromCart(productId, sizeLabel, packaging) {
  if (typeof sizeLabel === "undefined") {
    cart = cart.filter((item) => item.id !== productId);
  } else {
    cart = cart.filter(
      (item) =>
        !(
          item.id === productId &&
          item.sizeLabel === sizeLabel &&
          Boolean(item.packaging) === Boolean(packaging)
        )
    );
  }
  saveCart();
  renderCart();
  updateCartUI();
  showAlert("Item berhasil dihapus dari keranjang.", "error");
}

// --- CHECKOUT / PAYMENT / RECEIPT ---
function validateCheckoutForm() {
  const nameEl = document.getElementById("name");
  const addressEl = document.getElementById("address");
  const whatsappEl = document.getElementById("whatsapp");
  const name = nameEl ? nameEl.value.trim() : "";
  const address = addressEl ? addressEl.value.trim() : "";
  const whatsapp = whatsappEl ? whatsappEl.value.trim() : "";
  const paymentMethod = document.querySelector(
    'input[name="payment-method"]:checked'
  );

  if (!name) {
    showAlert("Nama lengkap harus diisi!", "error");
    if (nameEl) nameEl.focus();
    return false;
  }
  if (name.length < 3) {
    showAlert("Nama minimal 3 karakter!", "error");
    return false;
  }
  if (!address) {
    showAlert("Alamat lengkap harus diisi!", "error");
    if (addressEl) addressEl.focus();
    return false;
  }
  if (!whatsapp) {
    showAlert("Nomor WhatsApp harus diisi!", "error");
    if (whatsappEl) whatsappEl.focus();
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
  openPaymentModal(paymentMethod);
}

// payment modal (unchanged, uses copyToClipboard below)
function openPaymentModal(paymentMethod) {
  closePaymentModal();
  const overlay = document.createElement("div");
  overlay.className = "payment-modal-overlay";
  overlay.id = "paymentModal";
  const total = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

  // build order-summary html
  const itemsHtml = cart
    .map((item) => {
      const sizeInfo = item.sizeLabel
        ? ` <small>(${item.sizeLabel})</small>`
        : "";
      const packInfo = item.packaging
        ? ` <small>[Kemasan +${formatRupiah(item.packagingPrice)}]</small>`
        : "";
      const lineTotal = (item.price * item.quantity).toLocaleString("id-ID");
      return `
      <div class="summary-item" style="display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px dashed rgba(0,0,0,0.04)">
        <div style="flex:1">
          <strong>${item.quantity}x ${item.name}</strong>${sizeInfo}${packInfo}
        </div>
        <div style="white-space:nowrap;font-weight:700">Rp ${lineTotal}</div>
      </div>
    `;
    })
    .join("");

  overlay.innerHTML = `
    <div class="payment-modal" role="dialog" aria-modal="true" aria-label="Konfirmasi Pembayaran">
      <div class="payment-header">
        <h2>Konfirmasi Pembayaran</h2>
        <button class="payment-modal-close" onclick="closePaymentModal()" aria-label="Tutup">✕</button>
      </div>

      <div class="payment-content">
        <div>
          <div class="payment-instruction">
            <p style="margin:0 0 8px 0;color:#444">Metode: <strong>${paymentMethod}</strong></p>
            <div class="total-amount">${formatRupiah(total)}</div>
            <p style="margin-top:8px;color:#666;font-size:0.95rem">Periksa kembali pesanan dan total sebelum melanjutkan. Simpan bukti transfer jika memakai transfer bank atau e-wallet.</p>
          </div>
          <div style="margin-top:6px">
            <small style="color:#777">Catatan: klik "Lanjut ke Struk Pembelian" untuk melihat struk dan instruksi pembayaran.</small>
          </div>
        </div>

        <div id="order-summary" aria-live="polite">
          ${
            itemsHtml ||
            '<div style="color:#666">Tidak ada item di keranjang.</div>'
          }
        </div>
      </div>

      <div class="payment-footer">
        <button class="btn btn-secondary" onclick="closePaymentModal()">Batal</button>
        <button class="btn btn-primary btn-lg" onclick="completePayment('${paymentMethod}')">Lanjut ke Struk Pembelian</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePaymentModal();
  });
}
function closePaymentModal() {
  const el = document.getElementById("paymentModal");
  if (el) el.remove();
}

// Receipt modal - now shows packaging line and WA message includes packaging note
function generateReceiptModal(paymentMethod) {
  const name = (document.getElementById("name") || {}).value || "";
  const address = (document.getElementById("address") || {}).value || "";
  const whatsapp = (document.getElementById("whatsapp") || {}).value || "";
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = "GYL-" + Date.now().toString().slice(-8);
  const orderDate = new Date().toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines = [];
  lines.push("=== STRUK PESANAN ===");
  lines.push(`ID: ${orderId}`);
  lines.push(`Tanggal: ${orderDate}`);
  lines.push("");
  lines.push("Pemesan:");
  lines.push(`Nama: ${name}`);
  lines.push(`Alamat: ${address}`);
  lines.push(`WhatsApp: ${whatsapp}`);
  lines.push("");
  lines.push("Detail Pesanan:");
  cart.forEach((item) => {
    const sizeInfo = item.sizeLabel ? ` (${item.sizeLabel})` : "";
    const packInfo = item.packaging
      ? ` [Kemasan Premium +${formatRupiah(item.packagingPrice)}]`
      : "";
    const itemTotal = (item.price * item.quantity).toLocaleString("id-ID");
    lines.push(
      `${item.quantity}x ${
        item.name
      }${sizeInfo}${packInfo} @ Rp ${item.price.toLocaleString(
        "id-ID"
      )} = Rp ${itemTotal}`
    );
  });
  lines.push("");
  lines.push(`Subtotal: Rp ${total.toLocaleString("id-ID")}`);
  lines.push("Ongkir: TBD");
  lines.push(`Total: Rp ${total.toLocaleString("id-ID")}`);
  lines.push("");
  lines.push(
    `Metode Pembayaran: ${
      paymentMethod === "transfer-bank"
        ? "Transfer Bank"
        : paymentMethod === "e-wallet"
        ? "E-Wallet"
        : "Cash On Delivery (COD)"
    }`
  );
  lines.push("");
  lines.push("Mohon konfirmasi pesanan ini. Terima kasih.");

  const waMessage = encodeURIComponent(lines.join("\n"));
  const adminNumber = "628563574966";
  const waHref = `https://wa.me/${adminNumber}?text=${waMessage}`;

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
        <div class="receipt-id"><p class="label">ID Pesanan</p><p class="value">${orderId}</p></div>
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
    const packLine = item.packaging
      ? `<div style="font-size:0.85rem;color:#666">Kemasan Premium +${formatRupiah(
          item.packagingPrice
        )}</div>`
      : "";
    receiptHTML += `
      <div class="receipt-item">
        <div class="item-info">
          <p class="item-name">${item.name}</p>
          <p class="item-qty">${item.quantity}x ${
      item.sizeLabel ? item.sizeLabel : ""
    } @ Rp ${item.price.toLocaleString("id-ID")}</p>
          ${packLine}
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
        <div class="receipt-footer">
          <div class="receipt-contact">
            <h3>Kirim ke Admin</h3>
            <button class="btn btn-primary" onclick="sendStrukAndFinish('${waHref}')"><i class="fab fa-whatsapp"></i> Kirim Struk ke Admin</button>
          </div>
          <button class="btn btn-secondary" onclick="printReceipt()"><i class="fas fa-print"></i> Cetak</button>
          <button class="btn btn-primary" onclick="finishOrder()"><i class="fas fa-home"></i> Selesai</button>
        </div>
      </div>
    </div>
  `;

  receiptOverlay.innerHTML = receiptHTML;
  document.body.appendChild(receiptOverlay);
  receiptOverlay.addEventListener("click", (e) => {
    if (e.target === receiptOverlay) closeAllModals();
  });
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

// --- ORDER SUMMARY ---
function renderOrderSummary() {
  const container = document.getElementById("order-summary");
  if (!container) return;
  container.innerHTML = "";
  if (!cart || cart.length === 0) {
    container.innerHTML =
      '<p class="text-center" style="color:#777;padding:12px">Keranjang kosong.</p>';
    return;
  }
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
    if (item.packaging) {
      const pnote = document.createElement("div");
      pnote.textContent = `Kemasan Premium +${formatRupiah(
        item.packagingPrice
      )}`;
      pnote.style.fontSize = "0.85rem";
      pnote.style.color = "#666";
      left.appendChild(pnote);
    }
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
    </div>`;
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

// --- PRINT / FINISH ---
function printReceipt() {
  window.print();
}

function finishOrder() {
  closeReceiptModal();
  cart = [];
  saveCart();
  updateCartUI();
  showPage("homepage");
  showAlert("Terima kasih! Pesanan Anda telah berhasil dibuat.", "success");
}

// --- GENERATE LEVEL ICONS ---
function generateLevelHTML(product) {
  if (!product) return "";
  const isManis = product.category === "manis";
  const isPedas = product.category === "pedas";
  const typeClass = isManis ? "manis" : isPedas ? "pedas" : "gurih";
  const level = isManis
    ? Number(product.sweetness || 0)
    : Number(product.spiciness || 0);
  const iconClass = isManis ? "fas fa-ice-cream" : "fas fa-pepper-hot";
  let html = `<span class="level-icons ${typeClass}" aria-hidden="true">`;
  for (let i = 1; i <= 5; i++) {
    const active = i <= level ? "active" : "";
    html += `<i class="${iconClass} ${active}" data-level="${i}" aria-hidden="true"></i>`;
  }
  html += `</span>`;
  return html;
}

function generateSpicyLevelHTML(levelOrProduct) {
  if (typeof levelOrProduct === "object")
    return generateLevelHTML(levelOrProduct);
  const dummyProduct = {
    category: "pedas",
    spiciness: Number(levelOrProduct) || 0,
  };
  return generateLevelHTML(dummyProduct);
}

function toggleMobileMenu(open) {
  const menu = document.getElementById("mobileMenu");
  if (!menu) return;
  const attr = menu.getAttribute("aria-hidden") === "false";
  if (typeof open === "boolean")
    menu.setAttribute("aria-hidden", (!open).toString());
  else menu.setAttribute("aria-hidden", (!attr).toString());
  if (menu.getAttribute("aria-hidden") === "false")
    document.body.style.overflow = "hidden";
  else document.body.style.overflow = "";
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
  const card =
    btn.closest(".product-card") || btn.closest(".product-detail-info");
  if (!card) return;
  const priceEl =
    card.querySelector(".price") || card.querySelector(".detail-price");
  const originalEl = card.querySelector(".price-old");
  const price = Number(btn.dataset.price);
  const original = btn.dataset.original ? Number(btn.dataset.original) : null;

  // cek apakah ada checkbox kemasan di konteks detail page
  let packEl = null;
  if (card.closest && card.closest(".product-detail-info")) {
    packEl =
      card.querySelector("#detail-premium-pack") ||
      document.getElementById("detail-premium-pack");
  } else {
    // fallback global
    packEl = document.getElementById("detail-premium-pack");
  }
  const pack = packEl && packEl.checked ? PREMIUM_PACK_PRICE : 0;
  const displayedPrice = price + pack;

  if (priceEl) priceEl.textContent = formatRupiah(displayedPrice);
  if (originalEl) {
    if (original) {
      originalEl.textContent = formatRupiah(original);
      originalEl.style.display = "inline-block";
    } else {
      originalEl.style.display = "none";
    }
  }
}

// clipboard helper
function copyToClipboard(text) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => showAlert("Teks disalin ke clipboard.", "success"),
      () => showAlert("Gagal menyalin ke clipboard.", "error")
    );
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showAlert("Teks disalin ke clipboard.", "success");
    } catch (e) {
      showAlert("Gagal menyalin ke clipboard.", "error");
    }
    ta.remove();
  }
}

// open WA then finish order
function sendStrukAndFinish(waUrl) {
  try {
    const win = window.open(waUrl, "_blank");
    if (win) win.focus();
  } catch (e) {}
  setTimeout(() => {
    finishOrder();
  }, 1200);
}

// Carousel logic
let currentSlide = 0;
const slides = document.querySelectorAll('.banner-slide');
const dotsContainer = document.getElementById('carousel-dots');
let autoSlideInterval;

// Initialize dots
function initDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

// Update active slide
function updateActiveSlide() {
  slides.forEach((slide, index) => {
    slide.style.display = index === currentSlide ? 'block' : 'none';
  });

  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Go to the next slide
function nextBannerSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateActiveSlide();
}

// Go to the previous slide
function prevBannerSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateActiveSlide();
}

// Go to a specific slide
function goToSlide(index) {
  currentSlide = index;
  updateActiveSlide();
}

// Start auto-slide
function startAutoSlide() {
  autoSlideInterval = setInterval(nextBannerSlide, 5000); // Change slide every 5 seconds
}

// Stop auto-slide
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Initialize carousel
function initCarousel() {
  initDots();
  updateActiveSlide();
  startAutoSlide();

  // Pause auto-slide on hover
  const carousel = document.querySelector('.banner-carousel');
  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);
}

// Run carousel initialization on page load
document.addEventListener('DOMContentLoaded', initCarousel);

