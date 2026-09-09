/* ==========================================================================
   WEB FOLK / B2BPRINT-3 - INTERACTIONS & E-COMMERCE SIMULATION (WIX STORES)
   ========================================================================== */

// Exact Catalog Products from Wix Stores
const CATALOG_PRODUCTS = [
  {
    id: "prod-1",
    name: "Vaso de cerâmica",
    price: 270.00,
    comparePrice: null,
    ribbon: "Mais vendido",
    image: "images/products/prod_1.jpg",
    description: "Vaso de cerâmica artesanal com acabamento acetinado. Ideal para decoração minimalista e plantas de interior."
  },
  {
    id: "prod-2",
    name: "Bolsa tote minimalista",
    price: 20.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_2.jpg",
    description: "Bolsa tote confeccionada em algodão cru 100% sustentável com alças reforçadas e estampa minimalista exclusiva."
  },
  {
    id: "prod-3",
    name: "Sérum hidratante para os olhos - Pré-venda",
    price: 56.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_3.jpg",
    description: "Fórmula botânica com cafeína e ácido hialurônico de alta absorção para renovação do contorno dos olhos."
  },
  {
    id: "prod-4",
    name: "Suéter de tricô",
    price: 275.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_4.jpg",
    description: "Tricô macio e confortável com gola redonda e trama encorpada em fios nobres de algodão e lã."
  },
  {
    id: "prod-5",
    name: "Óculos redondos",
    price: 80.00,
    comparePrice: null,
    ribbon: "Novo",
    image: "images/products/prod_5.jpg",
    description: "Armação redonda clássica com lentes protetoras UV400 e design retrô contemporâneo."
  },
  {
    id: "prod-6",
    name: "Cadeira de madeira maciça",
    price: 690.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_6.jpg",
    description: "Design ergonômico em madeira maciça com encaixes artesanais e conforto estrutural refinado."
  },
  {
    id: "prod-7",
    name: "Limpador facial espumante",
    price: 85.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_7.jpg",
    description: "Espuma de limpeza profunda e suave com extratos naturais calmantes para todos os tipos de pele."
  },
  {
    id: "prod-8",
    name: "Boné de beisebol",
    price: 68.00,
    comparePrice: 129.00,
    ribbon: "Oferta",
    image: "images/products/prod_8.jpg",
    description: "Boné unissex com ajuste traseiro em metal e bordado clássico minimalista. Edição especial."
  },
  {
    id: "prod-9",
    name: "Garrafa de aço inoxidável",
    price: 79.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_9.jpg",
    description: "Garrafa térmica de aço inox de parede dupla que mantém bebidas geladas por 24h ou quentes por 12h."
  },
  {
    id: "prod-10",
    name: "Difusor de óleos essenciais",
    price: 99.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_10.jpg",
    description: "Difusor ultrassônico com iluminação LED ambiente e vaporização aromática contínua e silenciosa."
  },
  {
    id: "prod-11",
    name: "Argolas texturizadas",
    price: 169.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_11.jpg",
    description: "Brincos de argola em liga nobre com banho de ouro 18k e textura geométrica esculpida."
  },
  {
    id: "prod-12",
    name: "Camiseta básica",
    price: 120.00,
    comparePrice: null,
    ribbon: "",
    image: "images/products/prod_12.jpg",
    description: "Camiseta em algodão egípcio penteado com toque macio e caimento perfeito para o dia a dia."
  }
];

// Shopping Cart State
let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let activeDiscountPercent = 0;
let modalActiveProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeaderScroll();
  initScrollReveal();
  initParallaxEffects();
  initActiveNavSpy();

  // Load saved cart from localStorage
  loadCart();
  renderProducts();
  updateCartUI();
});

/* ==========================================================================
   E-COMMERCE CATALOG RENDERING & FILTERING
   ========================================================================== */
function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let list = [...CATALOG_PRODUCTS];

  // Filter
  if (currentFilter !== 'all') {
    list = list.filter(p => p.ribbon.toLowerCase() === currentFilter.toLowerCase());
  }

  // Sort
  if (currentSort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'name-asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  grid.innerHTML = '';

  list.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card reveal active';

    const ribbonHtml = prod.ribbon ? `<span class="product-ribbon">${prod.ribbon}</span>` : '';
    const compareHtml = prod.comparePrice ? `<span class="product-compare-price">${formatCurrency(prod.comparePrice)}</span>` : '';

    card.innerHTML = `
      <div class="product-thumb">
        ${ribbonHtml}
        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
        <div class="product-hover-actions">
          <button class="btn-quick-add" onclick="addToCart('${prod.id}', 1)">Adicionar</button>
          <button class="btn-quick-view" onclick="openProductModal('${prod.id}')" title="Ver Detalhes">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h4 class="product-title" onclick="openProductModal('${prod.id}')">${prod.name}</h4>
        <div class="product-price-row">
          <span class="product-price">${formatCurrency(prod.price)}</span>
          ${compareHtml}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterShop(category, btn) {
  currentFilter = category;
  document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function sortShop(order) {
  currentSort = order;
  renderProducts();
}

/* ==========================================================================
   CART SYSTEM & PERSISTENCE
   ========================================================================== */
function saveCart() {
  try {
    localStorage.setItem('webfolk_cart', JSON.stringify(cart));
  } catch(e) {}
}

function loadCart() {
  try {
    const data = localStorage.getItem('webfolk_cart');
    if (data) cart = JSON.parse(data);
  } catch(e) {
    cart = [];
  }
}

function addToCart(prodId, qty = 1) {
  const prod = CATALOG_PRODUCTS.find(p => p.id === prodId);
  if (!prod) return;

  const existing = cart.find(item => item.id === prodId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      quantity: qty
    });
  }

  saveCart();
  updateCartUI();
  toggleCartDrawer(true);
  showToast(`"${prod.name}" adicionado ao carrinho!`);
}

function updateCartQuantity(prodId, delta) {
  const item = cart.find(i => i.id === prodId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(prodId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(prodId) {
  cart = cart.filter(i => i.id !== prodId);
  saveCart();
  updateCartUI();
  showToast("Item removido do carrinho.");
}

function updateCartUI() {
  // Update header badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-badge');
  const countEl = document.getElementById('cart-drawer-count');

  if (badge) badge.innerText = totalItems;
  if (countEl) countEl.innerText = `(${totalItems})`;

  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-drawer-footer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-basket-shopping"></i>
        <p>Seu carrinho está vazio.</p>
        <button class="shop-tab mt-3" onclick="toggleCartDrawer(false)" style="margin-top:16px;">Ver Todos os Produtos</button>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  container.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-thumb">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)} cada</div>
        <div class="cart-item-stepper-row">
          <div class="qty-stepper">
            <button onclick="updateCartQuantity('${item.id}', -1)">-</button>
            <input type="number" value="${item.quantity}" readonly>
            <button onclick="updateCartQuantity('${item.id}', 1)">+</button>
          </div>
          <strong>${formatCurrency(itemTotal)}</strong>
          <button class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Remover Item">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
    container.appendChild(el);
  });

  const discountAmount = subtotal * activeDiscountPercent;
  const total = subtotal - discountAmount;

  document.getElementById('cart-subtotal').innerText = formatCurrency(subtotal);
  if (activeDiscountPercent > 0) {
    document.getElementById('cart-discount-row').style.display = 'flex';
    document.getElementById('cart-discount').innerText = `- ${formatCurrency(discountAmount)}`;
  } else {
    document.getElementById('cart-discount-row').style.display = 'none';
  }
  document.getElementById('cart-total').innerText = formatCurrency(total);
}

function toggleCartDrawer(forceOpen = null) {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;

  const isOpen = drawer.classList.contains('active');
  const shouldOpen = forceOpen !== null ? forceOpen : !isOpen;

  if (shouldOpen) {
    drawer.classList.add('active');
    overlay.classList.add('active');
  } else {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function applyCoupon() {
  const input = document.getElementById('cart-coupon-input');
  if (!input) return;
  const val = input.value.trim().toUpperCase();

  if (val === 'B2B10' || val === 'WIX10') {
    activeDiscountPercent = 0.10;
    updateCartUI();
    showToast("Cupom de 10% de desconto aplicado com sucesso!");
  } else {
    showToast("Cupom inválido. Tente usar B2B10");
  }
}

/* ==========================================================================
   PRODUCT DETAIL MODAL (QUICK VIEW)
   ========================================================================== */
function openProductModal(prodId) {
  const prod = CATALOG_PRODUCTS.find(p => p.id === prodId);
  if (!prod) return;

  modalActiveProduct = prod;

  document.getElementById('prod-modal-img').src = prod.image;
  document.getElementById('prod-modal-title').innerText = prod.name;
  document.getElementById('prod-modal-price').innerText = formatCurrency(prod.price);
  document.getElementById('prod-modal-desc').innerText = prod.description;
  document.getElementById('modal-qty').value = 1;

  const ribbonEl = document.getElementById('prod-modal-ribbon');
  if (prod.ribbon) {
    ribbonEl.style.display = 'inline-block';
    ribbonEl.innerText = prod.ribbon;
  } else {
    ribbonEl.style.display = 'none';
  }

  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('active');
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('active');
  modalActiveProduct = null;
}

function changeModalQty(delta) {
  const input = document.getElementById('modal-qty');
  if (!input) return;
  let val = parseInt(input.value) || 1;
  val += delta;
  if (val < 1) val = 1;
  input.value = val;
}

function addModalProductToCart() {
  if (!modalActiveProduct) return;
  const qty = parseInt(document.getElementById('modal-qty').value) || 1;
  addToCart(modalActiveProduct.id, qty);
  closeProductModal();
}

/* ==========================================================================
   CHECKOUT MODAL SIMULATION
   ========================================================================== */
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Seu carrinho está vazio!");
    return;
  }
  toggleCartDrawer(false);
  document.getElementById('checkout-step-1').style.display = 'block';
  document.getElementById('checkout-step-success').style.display = 'none';
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('active');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
}

function processCheckout(e) {
  e.preventDefault();

  const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
  const total = subtotal * (1 - activeDiscountPercent);
  const randomOrder = '#WIX-' + Math.floor(10000 + Math.random() * 90000);

  document.getElementById('success-order-id').innerText = randomOrder;
  document.getElementById('success-order-total').innerText = formatCurrency(total);

  document.getElementById('checkout-step-1').style.display = 'none';
  document.getElementById('checkout-step-success').style.display = 'block';

  // Empty cart
  cart = [];
  activeDiscountPercent = 0;
  saveCart();
  updateCartUI();

  showToast("Compra aprovada e concluída com sucesso!");
}

function finishCheckoutFlow() {
  closeCheckoutModal();
  document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================================================
   NAVIGATION, SCROLL & INTERACTIVE UTILS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && targetId !== '##' && !targetId.includes('javascript')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = document.querySelector('header').offsetHeight || 50;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

function initHeaderScroll() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initScrollReveal() {
  const portfolioCards = document.querySelectorAll('.portfolio .card');
  const teamMembers = document.querySelectorAll('.member .card');
  const articles = document.querySelectorAll('.describe article h4, .describe article p, .describe article .devider');

  portfolioCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${(index % 4) * 0.1}s`;
  });

  teamMembers.forEach((member, index) => {
    member.classList.add('reveal');
    member.style.transitionDelay = `${index * 0.15}s`;
  });

  articles.forEach(el => el.classList.add('reveal'));

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function initParallaxEffects() {
  const banner = document.querySelector('.banner');
  const bannerContent = document.querySelector('.banner h1');
  const bannerSub = document.querySelector('.banner h2');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (banner && scrollY < window.innerHeight) {
      if (bannerContent) {
        bannerContent.style.transform = `translateY(${scrollY * 0.22}px)`;
        bannerContent.style.opacity = `${1 - scrollY / 600}`;
      }
      if (bannerSub) {
        bannerSub.style.transform = `translateY(${scrollY * 0.15}px)`;
        bannerSub.style.opacity = `${1 - scrollY / 500}`;
      }
    }
  }, { passive: true });
}

function initActiveNavSpy() {
  const sections = document.querySelectorAll('main, section[id]');
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function openContactModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('contact-modal');
  if (modal) modal.classList.add('active');
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) modal.classList.remove('active');
}

function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Thank you! Your message has been sent successfully.");
  closeContactModal();
  e.target.reset();
}

function openImagePreview(src, title) {
  const overlay = document.getElementById('lightbox-overlay');
  const img = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  
  if (overlay && img) {
    img.src = src;
    if (titleEl) titleEl.innerText = title || "i'm an image title.";
    overlay.classList.add('active');
  }
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  if (overlay) overlay.classList.remove('active');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeContactModal();
    closeLightbox();
    closeProductModal();
    closeCheckoutModal();
    toggleCartDrawer(false);
  }
});
