// ===== NAV: Elements =====
const navToggle   = document.getElementById('nav-toggle');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-menu-close');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
const navProgress = document.getElementById('nav-progress');
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-links a[data-section]');

// ===== NAV: Hamburger open/close =====
function openMenu() {
  mobileMenu.classList.add('active');
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('active');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
  });
}
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ===== NAV: Scroll progress bar =====
function updateProgress() {
  if (!navProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  navProgress.style.width = pct + '%';
}

// ===== NAV: Active link highlight on scroll =====
function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  let current = '';

  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop) current = sec.id;
  });

  navLinkEls.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Scroll Reveal =====
const revealEls = document.querySelectorAll(
  '.skill-card, .work-card, .stack-item, .experience-card, .step, .section-header h2, .section-header p, .metric-item, .process-text, .bio-strip'
);
revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Stagger Cards =====
function staggerReveal(selector, delay = 80) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * delay}ms`;
  });
}
staggerReveal('.skill-card', 70);
staggerReveal('.work-card', 60);
staggerReveal('.stack-item', 55);

// ===== Counter Animation =====
const counters = document.querySelectorAll('.metric-n');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const firstCounter = counters[0];
  if (!firstCounter) return;
  const rect = firstCounter.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    countersStarted = true;
    counters.forEach(el => {
      const target   = parseInt(el.dataset.target);
      const duration = 1800;
      const step     = duration / target;
      let current    = 0;
      const tick = () => {
        if (current < target) {
          current++;
          el.textContent = current;
          setTimeout(tick, step);
        }
      };
      tick();
    });
  }
}

// ===== Discord Copy =====
function copyDiscord() {
  const discordUsername = 'yourusername';
  navigator.clipboard.writeText(discordUsername).then(() => {
    showToast('Discord copied!');
    const el = document.getElementById('discord-text');
    if (el) {
      el.textContent = 'Copied!';
      setTimeout(() => { el.textContent = 'Click to copy'; }, 2000);
    }
  }).catch(() => {
    showToast('Copy failed — try manually');
  });
}

// ===== Toast =====
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
    ${message}
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.classList.add('show'); });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===== Coming Soon for placeholder links =====
document.querySelectorAll('.action-card').forEach(card => {
  if (!card.hasAttribute('onclick') && !card.hasAttribute('download')) {
    card.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        showToast('Coming soon!');
      }
    });
  }
});

// ===== Unified scroll listener (single handler = better perf) =====
window.addEventListener('scroll', () => {
  updateProgress();
  updateActiveLink();
  startCounters();
}, { passive: true });

// ===== Init on load =====
window.addEventListener('load', () => {
  updateProgress();
  updateActiveLink();
  startCounters();
});

// ===== Easter Egg =====
console.log('%c JJ. ', 'font-size:20px;font-weight:900;color:#A8B1FF;background:#070B0C;padding:6px 12px;border-radius:6px;');
console.log('%c Hey developer! Thanks for checking out my portfolio 🚀', 'font-size:12px;color:#A7B0C8;');