/* ===== QUADRICOR — script.js ===== */
document.addEventListener('DOMContentLoaded', () => {

  // ===== HEADER SCROLL EFFECT =====
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (nav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translateY(9px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-9px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ===== SCROLL REVEAL (IntersectionObserver) =====
  const revealItems = document.querySelectorAll('.reveal-up, .reveal-card, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = el.parentElement.querySelectorAll('.reveal-card');
        const cardIndex = Array.from(siblings).indexOf(el);
        if (el.classList.contains('reveal-card') && cardIndex >= 0) {
          el.style.transitionDelay = (cardIndex % 3) * 0.1 + 's';
        }
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => revealObserver.observe(el));

  // ===== PARALLAX HERO =====
  const heroContent = document.getElementById('hero-content');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroContent && y < window.innerHeight) {
      heroContent.style.transform = `translateY(${y * 0.3}px)`;
      heroContent.style.opacity = 1 - (y / (window.innerHeight * 0.7));
    }
  }, { passive: true });

  // ===== SCROLLSPY =====
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => spyObserver.observe(s));

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString('pt-BR');
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ===== TESTIMONIALS SLIDER =====
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('test-prev');
  const nextBtn = document.getElementById('test-next');
  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    const total = cards.length;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const goTo = (n) => {
      current = (n + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-advance
    let autoTimer = setInterval(() => goTo(current + 1), 5000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.parentElement.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    });

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    }, { passive: true });
  }

  // ===== CONTACT FORM =====
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('form-success');
      const error = document.getElementById('form-error');
      const submitText = document.getElementById('submit-text');
      const submitLoading = document.getElementById('submit-loading');

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          field.style.borderColor = '#e0e0e0';
        }
      });

      if (!valid) {
        error.style.display = 'block';
        success.style.display = 'none';
        setTimeout(() => { error.style.display = 'none'; }, 3500);
        return;
      }

      // Simulate submission
      submitText.style.display = 'none';
      submitLoading.style.display = 'inline';
      error.style.display = 'none';

      setTimeout(() => {
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
        success.style.display = 'block';
        form.reset();
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }, 1800);
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== PORTFOLIO HOVER PERFORMANCE =====
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.querySelector('.portfolio-img').style.willChange = 'transform';
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('.portfolio-img').style.willChange = 'auto';
    });
  });

});
