/* ============================================
   CLICKnVAN - JavaScript Principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // NAVBAR SCROLL
  const navbar = document.querySelector('.navbar');
  const backTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
    backTop?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // MOBILE MENU
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const menuClose = document.querySelector('.menu-close');

  function openMenu() {
    mobileMenu?.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  mobileOverlay?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', closeMenu));

  // FAQ ACCORDION
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // SCROLL REVEAL
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // CAROUSEL CONTROLS
  const carousel = document.querySelector('.carousel');
  document.querySelector('.carousel-prev')?.addEventListener('click', () => {
    carousel?.scrollBy({ left: -300, behavior: 'smooth' });
  });
  document.querySelector('.carousel-next')?.addEventListener('click', () => {
    carousel?.scrollBy({ left: 300, behavior: 'smooth' });
  });

  // VEHICLE FAVORITES
  document.querySelectorAll('.vehicle-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isLiked = btn.dataset.liked === 'true';
      btn.dataset.liked = !isLiked;
      btn.textContent = isLiked ? '🤍' : '❤️';
      btn.setAttribute('aria-label', isLiked ? 'Ajouter aux favoris' : 'Retirer des favoris');
    });
  });

  // SEARCH FORM
  const dateDepart = document.getElementById('date-depart');
  const dateRetour = document.getElementById('date-retour');
  const today = new Date().toISOString().split('T')[0];
  if (dateDepart) {
    dateDepart.min = today;
    dateDepart.addEventListener('change', () => {
      if (dateRetour) {
        dateRetour.min = dateDepart.value;
        if (dateRetour.value && dateRetour.value < dateDepart.value) dateRetour.value = dateDepart.value;
      }
    });
  }

  document.querySelector('.search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dest = document.getElementById('destination')?.value?.trim();
    if (!dest) { document.getElementById('destination')?.focus(); return; }
    showNotification('Recherche en cours...', 'info');
    setTimeout(() => showNotification('Fonctionnalité disponible bientôt !', 'success'), 1500);
  });

  // CTA BUTTONS
  document.querySelectorAll('[data-cta]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const messages = {
        'voir-vehicules': 'Découvrez notre catalogue de véhicules !',
        'reserver': 'Réservation bientôt disponible !',
        'recherche': 'Commencez votre recherche de véhicule !',
        'faq': 'Consultez notre FAQ complète !',
        'compte-pro': 'Créez votre compte professionnel !'
      };
      showNotification(messages[btn.getAttribute('data-cta')] || 'Bientôt disponible !', 'success');
    });
  });

  // NOTIFICATION SYSTEM
  function showNotification(message, type = 'success') {
    document.querySelector('.notification')?.remove();
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" aria-label="Fermer" style="background:none;border:none;color:inherit;font-size:1.2rem;cursor:pointer;opacity:0.7;margin-left:auto;">×</button>`;
    Object.assign(el.style, {
      position: 'fixed', top: '90px', right: '20px', zIndex: '9999',
      padding: '14px 20px', borderRadius: '12px', display: 'flex',
      alignItems: 'center', gap: '12px', fontFamily: 'Inter, sans-serif',
      fontSize: '0.9rem', fontWeight: '500', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      animation: 'slideIn 0.3s ease', maxWidth: '360px',
      background: type === 'success' ? '#16A34A' : type === 'info' ? '#0F172A' : '#CC0000',
      color: '#fff', transition: 'all 0.3s ease'
    });
    if (!document.getElementById('notif-keyframes')) {
      const s = document.createElement('style');
      s.id = 'notif-keyframes';
      s.textContent = '@keyframes slideIn { from { transform:translateX(100%);opacity:0; } to { transform:translateX(0);opacity:1; } }';
      document.head.appendChild(s);
    }
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; setTimeout(() => el.remove(), 300); }, 4000);
  }

  // COUNTER ANIMATION
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    let current = 0;
    const step = target / (2000 / 16);
    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = prefix + Math.floor(current).toLocaleString('fr-FR') + suffix;
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(el => co.observe(el));
  }

  // YEAR IN FOOTER
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
