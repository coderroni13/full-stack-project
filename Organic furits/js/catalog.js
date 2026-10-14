/* ==========================================================================
   PUREHARVEST ORGANICS - CATALOG, FILTERING & SEARCH ENGINE
   ========================================================================== */

class CatalogManager {
  constructor() {
    this.products = [...PRODUCTS_DATA];
    this.selectedCategory = 'all';
    this.selectedDiets = new Set();
    this.maxPrice = 50;
    this.sortBy = 'popular';
    this.searchQuery = '';
    this.wishlist = new Set(JSON.parse(localStorage.getItem('pureharvest_wishlist')) || []);
    this.comparisonList = new Set();

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.gridContainer = document.getElementById('productsGrid');
    this.categoryBtns = document.querySelectorAll('.category-btn');
    this.dietCheckboxes = document.querySelectorAll('.diet-checkbox');
    this.priceSlider = document.getElementById('priceRangeSlider');
    this.priceDisplay = document.getElementById('maxPriceDisplay');
    this.sortSelect = document.getElementById('catalogSortSelect');
    this.activeChipsContainer = document.getElementById('activeFilterChips');
    this.wishlistCountBadges = document.querySelectorAll('.wishlist-count-badge');
    this.compareBtn = document.getElementById('compareFloatingBtn');
    this.compareCountBadge = document.getElementById('compareCountBadge');
  }

  bindEvents() {
    // Category tabs
    this.categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCategory = btn.dataset.category || 'all';
        this.render();
      });
    });

    // Diet / Benefit checkboxes
    this.dietCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          this.selectedDiets.add(cb.value);
        } else {
          this.selectedDiets.delete(cb.value);
        }
        this.render();
      });
    });

    // Price range slider
    if (this.priceSlider) {
      this.priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseFloat(e.target.value);
        if (this.priceDisplay) {
          this.priceDisplay.textContent = `$${this.maxPrice}`;
        }
        this.render();
      });
    }

    // Sort dropdown
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.render();
      });
    }
  }

  setSearchQuery(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.render();
  }

  toggleWishlist(productId) {
    if (this.wishlist.has(productId)) {
      this.wishlist.delete(productId);
      window.app.showToast('Removed from wishlist', 'info');
    } else {
      this.wishlist.add(productId);
      window.app.showToast('Added to your harvest wishlist ❤️', 'success');
    }
    localStorage.setItem('pureharvest_wishlist', JSON.stringify(Array.from(this.wishlist)));
    this.updateWishlistBadges();
    this.render();
  }

  toggleCompare(productId) {
    if (this.comparisonList.has(productId)) {
      this.comparisonList.delete(productId);
      window.app.showToast('Removed from fruit comparison', 'info');
    } else {
      if (this.comparisonList.size >= 3) {
        window.app.showToast('You can compare up to 3 fruits simultaneously.', 'warning');
        return;
      }
      this.comparisonList.add(productId);
      window.app.showToast('Added to comparison deck', 'success');
    }
    this.updateCompareWidget();
    this.render();
  }

  updateWishlistBadges() {
    this.wishlistCountBadges.forEach(badge => {
      badge.textContent = this.wishlist.size;
      badge.style.display = this.wishlist.size > 0 ? 'flex' : 'none';
    });
  }

  updateCompareWidget() {
    if (this.compareBtn && this.compareCountBadge) {
      this.compareCountBadge.textContent = this.comparisonList.size;
      if (this.comparisonList.size > 0) {
        this.compareBtn.style.display = 'flex';
      } else {
        this.compareBtn.style.display = 'none';
      }
    }
  }

  getFilteredProducts() {
    return this.products.filter(item => {
      // Category filter
      if (this.selectedCategory !== 'all' && item.category !== this.selectedCategory) {
        return false;
      }
      // Diet filter
      if (this.selectedDiets.size > 0) {
        const hasAllDiets = Array.from(this.selectedDiets).every(d => item.diets && item.diets.includes(d));
        if (!hasAllDiets) return false;
      }
      // Price filter
      if (item.price > this.maxPrice) {
        return false;
      }
      // Search filter
      if (this.searchQuery) {
        const matchName = item.name.toLowerCase().includes(this.searchQuery);
        const matchTastes = item.tastes.some(t => t.toLowerCase().includes(this.searchQuery));
        const matchFarm = item.farm.name.toLowerCase().includes(this.searchQuery) || item.farm.location.toLowerCase().includes(this.searchQuery);
        if (!matchName && !matchTastes && !matchFarm) return false;
      }
      return true;
    }).sort((a, b) => {
      if (this.sortBy === 'price-low') return a.price - b.price;
      if (this.sortBy === 'price-high') return b.price - a.price;
      if (this.sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // popular default
    });
  }

  renderFilterChips() {
    if (!this.activeChipsContainer) return;
    const chips = [];

    if (this.selectedCategory !== 'all') {
      chips.push({
        label: `Category: ${this.selectedCategory}`,
        action: () => {
          this.selectedCategory = 'all';
          this.categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
          this.render();
        }
      });
    }

    this.selectedDiets.forEach(diet => {
      chips.push({
        label: `Diet: ${diet}`,
        action: () => {
          this.selectedDiets.delete(diet);
          this.dietCheckboxes.forEach(cb => { if (cb.value === diet) cb.checked = false; });
          this.render();
        }
      });
    });

    if (this.maxPrice < 50) {
      chips.push({
        label: `Under $${this.maxPrice}`,
        action: () => {
          this.maxPrice = 50;
          if (this.priceSlider) this.priceSlider.value = 50;
          if (this.priceDisplay) this.priceDisplay.textContent = '$50';
          this.render();
        }
      });
    }

    if (this.searchQuery) {
      chips.push({
        label: `"${this.searchQuery}"`,
        action: () => {
          this.searchQuery = '';
          const searchInput = document.getElementById('mainSearchInput');
          if (searchInput) searchInput.value = '';
          this.render();
        }
      });
    }

    this.activeChipsContainer.innerHTML = chips.map((chip, index) => `
      <span class="filter-chip">
        ${chip.label}
        <button type="button" onclick="window.catalogManager.removeChipByIndex(${index})" aria-label="Remove filter">&times;</button>
      </span>
    `).join('');

    this._activeChipActions = chips.map(c => c.action);
  }

  removeChipByIndex(index) {
    if (this._activeChipActions && this._activeChipActions[index]) {
      this._activeChipActions[index]();
    }
  }

  render() {
    this.renderFilterChips();
    this.updateWishlistBadges();
    this.updateCompareWidget();

    if (!this.gridContainer) return;

    const filtered = this.getFilteredProducts();

    if (filtered.length === 0) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--color-border-subtle);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🌿</div>
          <h3 style="font-family: var(--font-display); margin-bottom: 8px;">No fresh fruits match your filters</h3>
          <p style="margin-bottom: 20px;">Try resetting your filters or adjusting your price slider to see today's full harvest.</p>
          <button class="btn btn-outline" onclick="window.catalogManager.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = filtered.map(item => {
      const isWishlisted = this.wishlist.has(item.id);
      const isComparing = this.comparisonList.has(item.id);
      const badgeClass = item.badge === 'seasonal' ? 'badge-pill--seasonal' : (item.badge === 'rare' ? 'badge-pill--rare' : 'badge-pill--organic');
      const badgeText = item.badge === 'seasonal' ? 'Peak Season' : (item.badge === 'rare' ? 'Rare Exotic' : 'USDA Organic');

      return `
        <article class="product-card fade-in" id="product-card-${item.id}">
          <div class="product-img-container">
            <img src="${item.image}" alt="${item.name}" class="product-img" loading="lazy">
            <div class="product-badges">
              <span class="badge-pill ${badgeClass}">${badgeText}</span>
            </div>
            <div class="product-card-actions">
              <button class="action-circle-btn ${isWishlisted ? 'is-active' : ''}" onclick="window.catalogManager.toggleWishlist('${item.id}')" title="Save to wishlist" aria-label="Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <button class="action-circle-btn ${isComparing ? 'is-active' : ''}" onclick="window.catalogManager.toggleCompare('${item.id}')" title="Compare nutrition" aria-label="Compare">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </button>
              <button class="action-circle-btn" onclick="window.modalManager.openQuickView('${item.id}')" title="Quick view & farm details" aria-label="Quick View">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
          </div>
          <div class="product-body">
            <div class="product-origin">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${item.farm.location}
            </div>
            <h3 class="product-title" onclick="window.modalManager.openQuickView('${item.id}')" style="cursor: pointer;">${item.name}</h3>
            
            <div class="product-taste-tags">
              ${item.tastes.map(taste => `<span class="taste-chip">${taste}</span>`).join('')}
            </div>

            <div class="product-rating-row">
              <div class="stars-svg">
                ★★★★★
              </div>
              <span>${item.rating} (${item.reviewsCount})</span>
            </div>

            <div class="product-footer">
              <div class="price-box">
                <span class="price-main">$${item.price.toFixed(2)}</span>
                <span class="price-unit">per ${item.unit}</span>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.catalogManager.quickAddToCart('${item.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Add
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  quickAddToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (product && window.cartManager) {
      window.cartManager.addItem(product, 1);
    }
  }

  resetFilters() {
    this.selectedCategory = 'all';
    this.selectedDiets.clear();
    this.maxPrice = 50;
    this.searchQuery = '';
    this.sortBy = 'popular';

    this.categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
    this.dietCheckboxes.forEach(cb => cb.checked = false);
    if (this.priceSlider) this.priceSlider.value = 50;
    if (this.priceDisplay) this.priceDisplay.textContent = '$50';
    if (this.sortSelect) this.sortSelect.value = 'popular';

    const searchInput = document.getElementById('mainSearchInput');
    if (searchInput) searchInput.value = '';

    this.render();
    window.app.showToast('Filters cleared', 'info');
  }
}
