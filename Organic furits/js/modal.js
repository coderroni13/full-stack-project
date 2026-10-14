/* ==========================================================================
   PUREHARVEST ORGANICS - MODALS & DIALOG ENGINE
   ========================================================================== */

class ModalManager {
  constructor() {
    this.quickViewOverlay = document.getElementById('quickViewModalOverlay');
    this.quickViewContent = document.getElementById('quickViewContainer');
    this.compareOverlay = document.getElementById('compareModalOverlay');
    this.compareContent = document.getElementById('compareContainer');
    this.traceOverlay = document.getElementById('traceModalOverlay');
    this.traceContent = document.getElementById('traceContainer');

    this.bindEvents();
  }

  bindEvents() {
    // Close on overlay backdrop click
    [this.quickViewOverlay, this.compareOverlay, this.traceOverlay].forEach(overlay => {
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.closeAll();
          }
        });
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAll();
      }
    });
  }

  closeAll() {
    [this.quickViewOverlay, this.compareOverlay, this.traceOverlay].forEach(overlay => {
      if (overlay) overlay.classList.remove('is-open');
    });
    document.body.style.overflow = '';
  }

  /* --- Quick View Modal --- */
  openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product || !this.quickViewOverlay || !this.quickViewContent) return;

    this.quickViewContent.innerHTML = `
      <button class="modal-close-btn" onclick="window.modalManager.closeAll()" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div class="quickview-grid">
        <div class="quickview-gallery">
          <img src="${product.image}" alt="${product.name}">
          <div style="margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${product.tastes.map(t => `<span class="taste-chip" style="font-size: 0.8rem; padding: 4px 10px;">✨ ${t}</span>`).join('')}
          </div>
        </div>

        <div class="quickview-details">
          <div class="product-origin" style="margin-bottom: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${product.farm.name} &bull; ${product.farm.location}
          </div>

          <h2 style="font-size: 1.8rem; font-family: var(--font-display); margin-bottom: 8px;">${product.name}</h2>
          
          <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px;">
            <span style="font-size: 1.6rem; font-weight: 800; color: var(--color-primary-900);">$${product.price.toFixed(2)}</span>
            <span style="color: var(--color-text-muted); font-size: 0.9rem;">/ ${product.unit}</span>
          </div>

          <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">${product.description}</p>

          <!-- Nutrition Snapshot -->
          <h4 style="font-size: 1rem; font-family: var(--font-display); margin-bottom: 8px;">USDA Certified Organic Nutrition</h4>
          <table class="nutrition-table">
            <tbody>
              <tr><th>Calories</th><td>${product.nutrition.calories}</td><th>Vitamin C</th><td>${product.nutrition.vitaminC}</td></tr>
              <tr><th>Dietary Fiber</th><td>${product.nutrition.fiber}</td><th>Antioxidants</th><td>${product.nutrition.antioxidantScore}</td></tr>
              <tr><th>Natural Sugars</th><td>${product.nutrition.sugars}</td><th>Potassium</th><td>${product.nutrition.potassium}</td></tr>
            </tbody>
          </table>

          <div style="margin-top: 24px; display: flex; gap: 12px; align-items: center;">
            <div class="stepper-wrap" style="padding: 4px;">
              <button class="stepper-btn" onclick="let q=document.getElementById('qvQty'); q.textContent=Math.max(1, parseInt(q.textContent)-1);">-</button>
              <span id="qvQty" class="stepper-value" style="width: 36px;">1</span>
              <button class="stepper-btn" onclick="let q=document.getElementById('qvQty'); q.textContent=parseInt(q.textContent)+1;">+</button>
            </div>
            
            <button class="btn btn-primary" style="flex-grow: 1;" onclick="
              const qty = parseInt(document.getElementById('qvQty').textContent);
              window.cartManager.addItem(PRODUCTS_DATA.find(p=>p.id==='${product.id}'), qty);
              window.modalManager.closeAll();
            ">
              Add to Basket
            </button>

            <button class="btn btn-outline btn-sm" onclick="window.modalManager.openTraceability('${product.farm.batchId}')" title="View Farm Passport">
              🔍 Trace Lot
            </button>
          </div>
        </div>
      </div>
    `;

    this.quickViewOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  /* --- Farm Batch Traceability Modal --- */
  openTraceability(batchId) {
    const product = PRODUCTS_DATA.find(p => p.farm.batchId.toLowerCase() === batchId.toLowerCase()) || PRODUCTS_DATA[0];
    if (!this.traceOverlay || !this.traceContent) return;

    this.traceContent.innerHTML = `
      <button class="modal-close-btn" onclick="window.modalManager.closeAll()" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="padding: var(--space-2xl);">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--color-primary-100); color: var(--color-primary-800); padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; margin-bottom: 12px;">
          🌱 Verified Farm-to-Table Passport
        </div>
        <h2 style="font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 8px;">Harvest Batch #${product.farm.batchId}</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 24px;">Authentic batch verification recorded directly at the harvest station.</p>

        <div class="trace-passport-card" style="margin-top: 0;">
          <div class="passport-badge-header">
            <div>
              <h3 style="font-size: 1.2rem; font-family: var(--font-display); color: var(--color-primary-900);">${product.farm.name}</h3>
              <p style="font-size: 0.85rem; color: var(--color-text-secondary);">${product.farm.location}</p>
            </div>
            <span class="badge-pill badge-pill--organic">${product.farm.certId}</span>
          </div>

          <div class="passport-grid">
            <div class="passport-data-item">
              <h5>Lead Cultivator</h5>
              <p>${product.farm.farmer}</p>
            </div>
            <div class="passport-data-item">
              <h5>Harvest Timestamp</h5>
              <p>${product.farm.harvestedDate}</p>
            </div>
            <div class="passport-data-item">
              <h5>Soil Health Index</h5>
              <p style="color: var(--color-primary-600);">${product.farm.soilHealth}</p>
            </div>
            <div class="passport-data-item">
              <h5>Eco Cold-Chain</h5>
              <p>100% Electric Refrigerated</p>
            </div>
          </div>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <button class="btn btn-primary" onclick="window.modalManager.closeAll()">Done</button>
        </div>
      </div>
    `;

    this.traceOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  /* --- Fruit Comparison Modal --- */
  openComparison() {
    if (!window.catalogManager || window.catalogManager.comparisonList.size === 0) {
      window.app.showToast('Please select at least 1 fruit to compare nutrition.', 'info');
      return;
    }

    const ids = Array.from(window.catalogManager.comparisonList);
    const fruits = ids.map(id => PRODUCTS_DATA.find(p => p.id === id)).filter(Boolean);

    if (!this.compareOverlay || !this.compareContent) return;

    this.compareContent.innerHTML = `
      <button class="modal-close-btn" onclick="window.modalManager.closeAll()" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="padding: var(--space-2xl);">
        <div class="section-header" style="margin-bottom: var(--space-xl); text-align: left;">
          <span class="tagline">Nutritional Face-Off</span>
          <h2 style="font-size: 1.8rem; font-family: var(--font-display);">Side-by-Side Fruit Comparison</h2>
        </div>

        <div style="overflow-x: auto;">
          <table class="nutrition-table" style="font-size: 0.95rem;">
            <thead>
              <tr>
                <th style="width: 25%;">Metric</th>
                ${fruits.map(f => `
                  <th style="text-align: center; width: ${75 / fruits.length}%;">
                    <img src="${f.image}" style="width: 80px; height: 80px; border-radius: var(--radius-md); object-fit: cover; margin: 0 auto 8px auto;">
                    <div>${f.name}</div>
                    <div style="color: var(--color-primary-600); font-weight: 800;">$${f.price.toFixed(2)}</div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Calories</th>
                ${fruits.map(f => `<td style="text-align: center; font-weight: 700;">${f.nutrition.calories}</td>`).join('')}
              </tr>
              <tr>
                <th>Vitamin C (% DV)</th>
                ${fruits.map(f => `<td style="text-align: center; font-weight: 700; color: var(--color-accent-amber);">${f.nutrition.vitaminC}</td>`).join('')}
              </tr>
              <tr>
                <th>Antioxidants (ORAC)</th>
                ${fruits.map(f => `<td style="text-align: center; font-weight: 700; color: var(--color-primary-600);">${f.nutrition.antioxidantScore}</td>`).join('')}
              </tr>
              <tr>
                <th>Dietary Fiber</th>
                ${fruits.map(f => `<td style="text-align: center;">${f.nutrition.fiber}</td>`).join('')}
              </tr>
              <tr>
                <th>Natural Sugars</th>
                ${fruits.map(f => `<td style="text-align: center;">${f.nutrition.sugars}</td>`).join('')}
              </tr>
              <tr>
                <th>Potassium</th>
                ${fruits.map(f => `<td style="text-align: center;">${f.nutrition.potassium}</td>`).join('')}
              </tr>
              <tr>
                <th>Action</th>
                ${fruits.map(f => `
                  <td style="text-align: center;">
                    <button class="btn btn-primary btn-sm" onclick="window.cartManager.addItem(PRODUCTS_DATA.find(p=>p.id==='${f.id}'), 1); window.modalManager.closeAll();">Add to Cart</button>
                  </td>
                `).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.compareOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}
