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
  const contactQuickHelpBtn = document.getElementById('contactQuickHelpBtn');

    /* =============================================
      EmailJS configuration
      Replace these with your actual EmailJS IDs.
      ============================================= */
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_CONTACT_TEMPLATE_ID';
    const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'YOUR_AUTOREPLY_TEMPLATE_ID';

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

      if (typeof emailjs === 'undefined') {
        alert('Email service is not available yet. Please check the EmailJS script include.');
        return;
      }

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      const formData = new FormData(contactForm);
      const contactParams = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        title: String(formData.get('title') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        time: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      Promise.all([
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactParams),
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, {
          ...contactParams,
          to_email: contactParams.email
        })
      ])
        .then(() => {
          btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
          contactForm.reset();
        })
        .catch((error) => {
          console.error('EmailJS send failed:', error);
          alert('Sorry, the message could not be sent right now. Please try again.');
        })
        .finally(() => {
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
          }, 1500);
        });
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

  /* =============================================
     9. CONTACT MODAL — quick help prompt
     ============================================= */
  function openQuickContactModal(event) {
    if (event) event.preventDefault();

    const existing = document.getElementById('quickContactModalOverlay');
    if (existing) existing.remove();

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'quickContactModalOverlay';
    modalOverlay.className = 'quick-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quickModalTitle">
        <button class="quick-modal-close" aria-label="Close modal">&times;</button>
        <h3 id="quickModalTitle">Quick Contact</h3>
        <p>For faster replies, contact via email or phone:</p>
        <div class="quick-modal-links">
          <a href="mailto:peterkelvinkibiru1532@gmail.com"><i class="fas fa-envelope"></i> peterkelvinkibiru1532@gmail.com</a>
          <a href="mailto:spectretechlimited@gmail.com"><i class="fas fa-envelope-open-text"></i> spectretechlimited@gmail.com</a>
          <a href="tel:+254714516132"><i class="fas fa-phone"></i> 0714516132</a>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
      modalOverlay.remove();
      document.body.style.overflow = '';
    };

    modalOverlay.querySelector('.quick-modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape' && document.getElementById('quickContactModalOverlay')) {
        closeModal();
        document.removeEventListener('keydown', onEsc);
      }
    });
  }

  if (contactQuickHelpBtn) {
    contactQuickHelpBtn.addEventListener('click', openQuickContactModal);
  }

  // Always remind on contact page for faster replies.
  if (contactForm) {
    setTimeout(() => {
      openQuickContactModal();
    }, 650);
  }

  /* =============================================
     10. GLOBAL WHATSAPP FLOAT BUTTON
     ============================================= */
  const whatsappAnchor = document.createElement('a');
  whatsappAnchor.href = 'https://wa.me/254714516132';
  whatsappAnchor.target = '_blank';
  whatsappAnchor.rel = 'noopener';
  whatsappAnchor.className = 'whatsapp-float';
  whatsappAnchor.setAttribute('aria-label', 'Chat on WhatsApp');
  whatsappAnchor.innerHTML = `
    <i class="fab fa-whatsapp" aria-hidden="true"></i>
    <span class="whatsapp-float-text">WhatsApp</span>
  `;
  document.body.appendChild(whatsappAnchor);

  /* =============================================
     11. DYNAMIC FOOTER — year + live date/time
     ============================================= */
  const footerYear = document.getElementById('footerYear');
  const footerDateTime = document.getElementById('footerDateTime');

  function updateFooterDateTime() {
    const now = new Date();
    const dayNumber = now.getDate();
    const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (footerYear) {
      footerYear.textContent = String(year);
    }

    if (footerDateTime) {
      footerDateTime.textContent = `${dayNumber} ${weekday} ${year} | ${time}`;
    }
  }

  updateFooterDateTime();
  setInterval(updateFooterDateTime, 1000);

});
