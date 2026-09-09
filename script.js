/* ==========================================================================
   WEB FOLK / B2BPRINT-3 - SCRIPT & INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && targetId !== '##' && !targetId.includes('javascript')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});

// Contact Modal Functions
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

// Lightbox Preview Functions
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

// Toast Notifications
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Close modals with Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeContactModal();
    closeLightbox();
  }
});
