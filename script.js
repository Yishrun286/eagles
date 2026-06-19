/* ============================================
   EAGLES FOOTBALL CLUB ACADEMY - MAIN JAVASCRIPT
   ============================================ */

/* ── Loading Screen ───────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    // Remove from DOM after transition
    setTimeout(() => loader.remove(), 700);
  }, 1800);
});

/* ── Sticky Navbar ────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── Hamburger / Mobile Menu ─────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });
  // Close when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });
}

/* ── Active Nav Link (current page) ─────── */
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Back to Top ──────────────────────────── */
const backTop = document.getElementById('back-to-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  });
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Scroll Reveal ────────────────────────── */
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if parent is a grid
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add stagger delays to grid children
  document.querySelectorAll('.stats-grid, .programs-grid, .players-grid, .testimonials-grid, .coaches-grid, .prog-full-grid, .why-grid, .mission-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.dataset.delay = i * 100;
    });
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}
initScrollReveal();

/* ── Animated Counters ─────────────────────── */
function animateCounter(el, target, suffix = '', duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
initCounters();

/* ── Smooth Scroll for Anchor Links ────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Gallery Filter + Lightbox ───────────── */
function initGallery() {
  const filters = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.gallery-item');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let currentIndex = 0;
  const visibleItems = () => Array.from(items).filter(i => i.style.display !== 'none');

  function openLightbox(idx) {
    const visible = visibleItems();
    if (!visible[idx]) return;
    currentIndex = idx;
    const img = visible[idx].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  const closeBtn = document.getElementById('lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.getElementById('lightbox-prev')?.addEventListener('click', () => {
    const visible = visibleItems();
    currentIndex = (currentIndex - 1 + visible.length) % visible.length;
    openLightbox(currentIndex);
  });
  document.getElementById('lightbox-next')?.addEventListener('click', () => {
    const visible = visibleItems();
    currentIndex = (currentIndex + 1) % visible.length;
    openLightbox(currentIndex);
  });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev')?.click();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-next')?.click();
  });
}
initGallery();

/* ── Donation Amounts ─────────────────────── */
function initDonation() {
  const btns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('custom-amount');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (customInput) customInput.value = btn.dataset.amount;
    });
  });

  // Animate progress bar
  const fill = document.querySelector('.progress-bar-fill');
  if (fill) {
    setTimeout(() => { fill.style.width = fill.dataset.progress + '%'; }, 500);
  }
}
initDonation();

/* ── Registration Form ────────────────────── */
function initRegForm() {
  const form = document.getElementById('reg-form');
  if (!form) return;

  function showError(input, msg) {
    const group = input.closest('.form-group');
    input.classList.add('error');
    let errEl = group.querySelector('.error-msg');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'error-msg';
      group.appendChild(errEl);
    }
    errEl.textContent = msg;
    errEl.classList.add('visible');
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.closest('.form-group')?.querySelector('.error-msg');
    if (errEl) errEl.classList.remove('visible');
  }

  function validateField(input) {
    clearError(input);
    const val = input.value.trim();
    const name = input.name;

    if (input.required && !val) {
      showError(input, 'This field is required'); return false;
    }
    if (name === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(input, 'Please enter a valid email'); return false;
    }
    if (name === 'phone' && val && !/^[+\d\s\-]{7,15}$/.test(val)) {
      showError(input, 'Please enter a valid phone number'); return false;
    }
    if (name === 'age' && val) {
      const age = parseInt(val);
      if (isNaN(age) || age < 5 || age > 35) {
        showError(input, 'Age must be between 5 and 35'); return false;
      }
    }
    return true;
  }

  // Live validation
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => { if (el.classList.contains('error')) validateField(el); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(el => {
      if (!validateField(el)) valid = false;
    });
    if (!valid) return;

    // Store in localStorage
    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = v; });
    data.timestamp = new Date().toISOString();
    const existing = JSON.parse(localStorage.getItem('eagles_registrations') || '[]');
    existing.push(data);
    localStorage.setItem('eagles_registrations', JSON.stringify(existing));

    // Show success
    form.style.display = 'none';
    const success = document.getElementById('reg-success');
    if (success) success.classList.add('show');
    window.scrollTo({ top: success?.offsetTop - 100 || 0, behavior: 'smooth' });
  });
}
initRegForm();

/* ── Contact Form ─────────────────────────── */
/*
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Message Sent! ✓';
    btn.style.background = 'var(--light-green)';
    btn.disabled = true;
    form.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  });
}
initContactForm();
*/

/* ── News Ticker Duplication ─────────────── */
(function initTicker() {
  const inner = document.querySelector('.ticker-inner');
  if (!inner) return;
  // Clone for seamless loop
  inner.innerHTML += inner.innerHTML;
})();

/* ── File Upload Label Update ─────────────── */
document.querySelectorAll('input[type="file"]').forEach(input => {
  input.addEventListener('change', () => {
    const wrap = input.closest('.file-upload');
    if (!wrap) return;
    const p = wrap.querySelector('p');
    if (p && input.files.length) {
      p.innerHTML = `<strong>✓ ${input.files[0].name}</strong>`;
      wrap.style.borderColor = 'var(--light-green)';
    }
  });
});

/* ── Typed Text Animation (Hero) ─────────── */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const words = ['Excellence', 'Discipline', 'Passion', 'Victory', 'Legacy'];
  let wIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = words[wIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 110);
  }
  type();
}
initTyped();

