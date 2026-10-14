/* ==========================================================================
   PUREHARVEST ORGANICS - MAIN APPLICATION ENTRY POINT
   ========================================================================== */

class App {
  constructor() {
    this.toastContainer = document.getElementById('toastContainer');
    this.searchModalOverlay = document.getElementById('searchModalOverlay');
    this.searchModalInput = document.getElementById('searchModalInputField');
    this.searchResultsBox = document.getElementById('searchModalResults');
    this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.navLinks = document.getElementById('navLinks');
    this.siteHeader = document.querySelector('.site-header');

    this.bindEvents();
    this.initKeyboardShortcuts();
    this.initHeaderScroll();
    this.initTestimonials();
    this.initBatchLookupSection();
    this.initNewsletter();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileMenuToggle && this.navLinks) {
      this.mobileMenuToggle.addEventListener('click', () => {
        this.navLinks.classList.toggle('is-active');
      });

      // Close menu when link is clicked
      this.navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.navLinks.classList.remove('is-active');
        });
      });
    }

    // Search Modal triggers
    document.querySelectorAll('[data-open-search]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSearchModal();
      });
    });

    if (this.searchModalOverlay) {
      this.searchModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.searchModalOverlay) {
          this.closeSearchModal();
        }
      });
    }

    if (this.searchModalInput) {
      this.searchModalInput.addEventListener('input', (e) => {
        this.handleSearchModalInput(e.target.value);
      });
    }
  }

  initHeaderScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        this.siteHeader?.classList.add('is-scrolled');
      } else {
        this.siteHeader?.classList.remove('is-scrolled');
      }
    });
  }

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or '/' for search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchModal();
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.openSearchModal();
      }
    });
  }

  openSearchModal() {
    if (this.searchModalOverlay) {
      this.searchModalOverlay.classList.add('is-open');
      this.searchModalInput?.focus();
      this.handleSearchModalInput(this.searchModalInput?.value || '');
      document.body.style.overflow = 'hidden';
    }
  }

  closeSearchModal() {
    if (this.searchModalOverlay) {
      this.searchModalOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  handleSearchModalInput(query) {
    if (!this.searchResultsBox) return;
    const clean = query.trim().toLowerCase();

    if (!clean) {
      this.searchResultsBox.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--color-text-muted);">
          <p>Type to search fresh organic fruits, orchards, or health benefits...</p>
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 12px; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" onclick="window.app.searchModalInput.value='Blueberries'; window.app.handleSearchModalInput('Blueberries');">Blueberries</button>
            <button class="btn btn-outline btn-sm" onclick="window.app.searchModalInput.value='Blood Orange'; window.app.handleSearchModalInput('Blood Orange');">Blood Orange</button>
            <button class="btn btn-outline btn-sm" onclick="window.app.searchModalInput.value='Vitamin C'; window.app.handleSearchModalInput('Vitamin C');">High Vitamin C</button>
          </div>
        </div>
      `;
      return;
    }

    const matches = PRODUCTS_DATA.filter(p => {
      const inName = p.name.toLowerCase().includes(clean);
      const inTastes = p.tastes.some(t => t.toLowerCase().includes(clean));
      const inFarm = p.farm.name.toLowerCase().includes(clean) || p.farm.location.toLowerCase().includes(clean);
      return inName || inTastes || inFarm;
    });

    if (matches.length === 0) {
      this.searchResultsBox.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--color-text-muted);">
          <p>No organic fruits found for "<strong>${clean}</strong>"</p>
        </div>
      `;
      return;
    }

    this.searchResultsBox.innerHTML = matches.map(item => `
      <div class="search-result-item" onclick="
        window.app.closeSearchModal();
        window.modalManager.openQuickView('${item.id}');
      ">
        <img src="${item.image}" alt="${item.name}" class="search-result-thumb">
        <div style="flex-grow: 1;">
          <h4 style="font-size: 0.95rem; font-family: var(--font-display);">${item.name}</h4>
          <p style="font-size: 0.8rem; color: var(--color-text-muted);">${item.farm.name} &bull; $${item.price.toFixed(2)} / ${item.unit}</p>
        </div>
        <span class="btn btn-outline btn-sm">View</span>
      </div>
    `).join('');
  }

  initBatchLookupSection() {
    const traceBtn = document.getElementById('lookupBatchBtn');
    const traceInput = document.getElementById('batchLookupInput');

    if (traceBtn && traceInput) {
      traceBtn.addEventListener('click', () => {
        const val = traceInput.value.trim();
        if (!val) {
          this.showToast('Please enter a harvest batch ID like OR-9428-BLU', 'warning');
          return;
        }
        window.modalManager.openTraceability(val);
      });
    }
  }

  initTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (container) {
      container.innerHTML = TESTIMONIALS_DATA.map(t => `
        <div class="pillar-card" style="align-items: stretch;">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
            <img src="${t.avatar}" alt="${t.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
            <div>
              <h4 style="font-size: 1rem; font-family: var(--font-display); margin-bottom: 2px;">${t.name}</h4>
              <p style="font-size: 0.8rem; color: var(--color-primary-600); font-weight: 600;">${t.role} &bull; ${t.location}</p>
            </div>
          </div>
          <div style="color: var(--color-accent-amber); font-size: 1rem; margin-bottom: 10px;">★★★★★</div>
          <p style="font-size: 0.95rem; font-style: italic; line-height: 1.6; color: var(--color-text-secondary);">"${t.comment}"</p>
          <div style="margin-top: auto; padding-top: 14px; display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--color-primary-700); font-weight: 700;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Verified Organic Subscriber
          </div>
        </div>
      `).join('');
    }
  }

  initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          this.showToast('🌿 Welcome to PureHarvest Circle! Promo code FRESH20 sent to your inbox.', 'success');
          emailInput.value = '';
        }
      });
    }
  }

  showToast(message, type = 'info') {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    else if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${icon}</span>
      <span>${message}</span>
    `;

    this.toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.cartManager = new CartManager();
  window.catalogManager = new CatalogManager();
  window.boxBuilderManager = new BoxBuilderManager();
  window.modalManager = new ModalManager();
  window.checkoutManager = new CheckoutManager();
});
