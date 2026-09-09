/* ==========================================================================
   WEB FOLK / B2BPRINT-3 - ADVANCED MOTION & INTERACTIONS (WIX STYLE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeaderScroll();
  initScrollReveal();
  initParallaxEffects();
  initActiveNavSpy();
});

/* 1. Smooth Scrolling with Easing */
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

/* 2. Header Scroll Reactivity */
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

/* 3. Intersection Observer Scroll Reveal (Staggered Animation like Wix) */
function initScrollReveal() {
  // Elements to reveal on scroll
  const portfolioCards = document.querySelectorAll('.portfolio .card');
  const teamMembers = document.querySelectorAll('.member .card');
  const articles = document.querySelectorAll('.describe article h4, .describe article p, .describe article .devider');

  portfolioCards.forEach((card, index) => {
    card.classList.add('reveal');
    // Staggered reveal delay
    card.style.transitionDelay = `${(index % 4) * 0.1}s`;
  });

  teamMembers.forEach((member, index) => {
    member.classList.add('reveal');
    member.style.transitionDelay = `${index * 0.15}s`;
  });

  articles.forEach(el => {
    el.classList.add('reveal');
  });

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

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

/* 4. Parallax Scrolling Depth (Wix Style) */
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

/* 5. Active Nav Spy based on Scroll Position */
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

/* ==========================================================================
   CONTACT MODAL
   ========================================================================== */
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

/* ==========================================================================
   IMAGE LIGHTBOX
   ========================================================================== */
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

/* ==========================================================================
   TOAST NOTIFICATIONS
   ========================================================================== */
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

// Global Keyboard Handler
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeContactModal();
    closeLightbox();
  }
});
