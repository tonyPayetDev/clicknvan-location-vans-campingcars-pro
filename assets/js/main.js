/* ===================================
   CLICKnVAN - JavaScript Principal
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================
  // NAVBAR SCROLL
  // ===================================
  const navbar = document.querySelector('.navbar');
  const backTop = document.querySelector('.back-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backTop?.classList.add('visible');
    } else {
      backTop?.classList.remove('visible');
    }
  }, { passive: true });

  // Back to top
  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===================================
  // MOBILE MENU
  // ===================================
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileClose = document.querySelector('.mobile-menu-close');

  function openMenu() {
    mobileMenu?.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    menuToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  menuToggle?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  mobileOverlay?.addEventListener('click', closeMenu);

  // Close menu on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ===================================
  // FAQ ACCORDION
  // ===================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });

    // Keyboard accessibility
    question?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // ===================================
  // SCROLL REVEAL
  // ===================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ===================================
  // VEHICLE CARDS FAVORITE
  // ===================================
  document.querySelectorAll('.vehicle-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = btn.textContent.trim() === '❤️';
      btn.textContent = isActive ? '🤍' : '❤️';
      btn.setAttribute('aria-label', isActive ? 'Ajouter aux favoris' : 'Retirer des favoris');
    });
  });

  // ===================================
  // SEARCH FORM VALIDATION
  // ===================================
  const searchForm = document.querySelector('.search-form');
  const dateDepart = document.getElementById('date-depart');
  const dateRetour = document.getElementById('date-retour');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  if (dateDepart) {
    dateDepart.min = today;
    dateDepart.addEventListener('change', () => {
      if (dateRetour) {
        dateRetour.min = dateDepart.value;
        if (dateRetour.value && dateRetour.value < dateDepart.value) {
          dateRetour.value = dateDepart.value;
        }
      }
    });
  }

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const destination = document.getElementById('destination')?.value?.trim();
    if (!destination) {
      document.getElementById('destination')?.focus();
      return;
    }
    // Simulate search action
    showNotification('Recherche en cours...', 'info');
    setTimeout(() => showNotification('Fonctionnalité disponible bientôt !', 'success'), 1500);
  });

  // ===================================
  // NOTIFICATION SYSTEM
  // ===================================
  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    existing?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notif-close" aria-label="Fermer">×</button>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .notification {
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 9999;
        padding: 14px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 360px;
        font-family: 'Manrope', sans-serif;
      }
      .notification-success { background: #16A34A; color: white; }
      .notification-info { background: #0F172A; color: white; }
      .notification-error { background: #CC0000; color: white; }
      .notif-close {
        background: none; border: none; color: inherit;
        font-size: 1.2rem; cursor: pointer; opacity: 0.7; line-height: 1;
        margin-left: auto; flex-shrink: 0;
      }
      .notif-close:hover { opacity: 1; }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;

    if (!document.querySelector('.notif-style')) {
      style.classList.add('notif-style');
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    notification.querySelector('.notif-close')?.addEventListener('click', () => {
      notification.remove();
    });

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // ===================================
  // CTA BUTTONS (demo)
  // ===================================
  document.querySelectorAll('[data-cta]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.getAttribute('data-cta');
      const messages = {
        'voir-vehicules': 'Accédez à notre catalogue de véhicules !',
        'reserver': 'Réservation disponible bientôt !',
        'recherche': 'Commencez votre recherche de véhicule !',
        'faq': 'Consultez notre FAQ complète !',
        'compte-pro': 'Créez votre compte professionnel !',
        'login': 'Connectez-vous à votre compte !'
      };
      showNotification(messages[action] || 'Fonctionnalité bientôt disponible !', 'success');
    });
  });

  // ===================================
  // LAZY LOADING (native + polyfill)
  // ===================================
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback with IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===================================
  // COUNTER ANIMATION
  // ===================================
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = prefix + Math.floor(current).toLocaleString('fr-FR') + suffix;
      if (current < target) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // ===================================
  // VEHICLE CAROUSEL (touch swipe)
  // ===================================
  const carousel = document.querySelector('.carousel-track');
  if (carousel) {
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      isDragging = false;
      // Basic swipe detection
      if (Math.abs(diff) > 50) {
        // Future: handle carousel navigation
      }
    }, { passive: true });
  }

  // ===================================
  // DYNAMIC YEAR IN FOOTER
  // ===================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===================================
  // ACTIVE NAV LINK ON SCROLL
  // ===================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
  }

});
