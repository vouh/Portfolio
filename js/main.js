/* ============================================
   MAIN.JS — Kelvin Kibiru Portfolio
   Theme toggle, navbar scroll, hamburger menu,
   scroll-reveal animations, contact form UX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- DOM refs ---- */
  const html         = document.documentElement;
  const navbar       = document.getElementById('navbar');
  const themeToggle  = document.getElementById('themeToggle');
  const hamburger    = document.getElementById('hamburger');
  const navLinks     = document.getElementById('navLinks');
  const contactForm  = document.getElementById('contactForm');

  /* =============================================
     1. THEME TOGGLE (Dark / Light)
     ============================================= */
  const THEME_KEY = 'kk-portfolio-theme';

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }

  /* =============================================
     2. NAVBAR — transparent → glass on scroll
     ============================================= */
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load

  /* =============================================
     3. HAMBURGER MENU (mobile)
     ============================================= */
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  /* =============================================
     4. SCROLL REVEAL ANIMATION
     ============================================= */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  /* =============================================
     5. CONTACT FORM — basic client-side UX
     ============================================= */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      // Simple loading state
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      // Simulate send (replace with real endpoint)
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  /* =============================================
     6. STAGGERED CARD ANIMATION
     ============================================= */
  const cards = document.querySelectorAll('.project-card, .stack-item');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });

  /* =============================================
     7. ACTIVE NAV LINK HIGHLIGHT
     ============================================= */
  // Already handled via class="active" on each page

  /* =============================================
     8. DYNAMIC TYPING EFFECT — role cycling
     ============================================= */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const roles = [
      'Full Stack Web Developer',
      'Computer Science Student',
      'Founder & CEO of Spectre',
      'Software Developer',
      'Graphics Designer',
      'AI & Prompt Engineer',
      'Virtual Assistant'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const TYPE_SPEED = 70;
    const DELETE_SPEED = 40;
    const PAUSE = 1800;

    function typeLoop() {
      const current = roles[roleIdx];
      if (!deleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeLoop, PAUSE);
          return;
        }
        setTimeout(typeLoop, TYPE_SPEED);
      } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
        setTimeout(typeLoop, DELETE_SPEED);
      }
    }
    setTimeout(typeLoop, 800);
  }

});
