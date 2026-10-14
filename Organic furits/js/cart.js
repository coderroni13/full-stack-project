/* ==========================================================================
   PUREHARVEST ORGANICS - SHOPPING CART & PROMO ENGINE
   ========================================================================== */

class CartManager {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('pureharvest_cart')) || [];
    this.appliedPromo = null;
    this.shippingThreshold = 50.00;
    this.standardShippingCost = 6.99;
    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.drawerBackdrop = document.getElementById('cartDrawerBackdrop');
    this.drawer = document.getElementById('cartDrawer');
    this.cartItemsContainer = document.getElementById('cartItemsList');
    this.cartCountBadges = document.querySelectorAll('.cart-count-badge');
    this.subtotalEl = document.getElementById('cartSubtotalPrice');
    this.discountRowEl = document.getElementById('cartDiscountRow');
    this.discountValEl = document.getElementById('cartDiscountPrice');
    this.shippingEl = document.getElementById('cartShippingPrice');
    this.totalEl = document.getElementById('cartTotalPrice');
    this.freeShippingText = document.getElementById('freeShippingProgressText');
    this.freeShippingBar = document.getElementById('freeShippingProgressBar');
    this.promoInput = document.getElementById('promoCodeInput');
    this.promoApplyBtn = document.getElementById('applyPromoBtn');
    this.checkoutBtn = document.getElementById('openCheckoutBtn');
  }

  bindEvents() {
    // Open drawer triggers
    document.querySelectorAll('[data-open-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close drawer triggers
    document.querySelectorAll('[data-close-cart]').forEach(btn => {
      btn.addEventListener('click', () => this.closeDrawer());
    });

    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === this.drawerBackdrop) {
          this.closeDrawer();
        }
      });
    }

    if (this.promoApplyBtn) {
      this.promoApplyBtn.addEventListener('click', () => this.applyPromoCode());
    }

    if (this.promoInput) {
      this.promoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.applyPromoCode();
        }
      });
    }

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) {
          window.app.showToast('Your cart is empty. Add fresh fruits first!', 'warning');
          return;
        }
        this.closeDrawer();
        if (window.checkoutManager) {
          window.checkoutManager.open(this.getCartSummary());
        }
      });
    }
  }

  save() {
    localStorage.setItem('pureharvest_cart', JSON.stringify(this.items));
    this.render();
  }

  openDrawer() {
    if (this.drawerBackdrop) {
      this.drawerBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer() {
    if (this.drawerBackdrop) {
      this.drawerBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  addItem(product, quantity = 1) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity: quantity
      });
    }

    this.save();
    window.app.showToast(`Added ${quantity}x ${product.name} to cart!`, 'success');
    this.triggerCartBounce();
  }

  updateQuantity(productId, newQty) {
    const itemIndex = this.items.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      if (newQty <= 0) {
        this.items.splice(itemIndex, 1);
        window.app.showToast('Item removed from cart', 'info');
      } else {
        this.items[itemIndex].quantity = newQty;
      }
      this.save();
    }
  }

  removeItem(productId) {
    this.updateQuantity(productId, 0);
  }

  triggerCartBounce() {
    this.cartCountBadges.forEach(badge => {
      badge.classList.remove('cart-bounce-animate');
      void badge.offsetWidth;
      badge.classList.add('cart-bounce-animate');
    });
  }

  applyPromoCode() {
    const code = this.promoInput.value.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      this.appliedPromo = {
        code: code,
        ...PROMO_CODES[code]
      };
      window.app.showToast(`Promo "${code}" applied: ${this.appliedPromo.description}`, 'success');
      this.render();
    } else {
      window.app.showToast(`Invalid coupon code "${code}". Try "FRESH20" or "ORGANIC10"`, 'warning');
    }
  }

  getCartSummary() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    if (this.appliedPromo) {
      if (this.appliedPromo.discountPercent) {
        discount = subtotal * (this.appliedPromo.discountPercent / 100);
      } else if (this.appliedPromo.discountFixed) {
        discount = Math.min(subtotal, this.appliedPromo.discountFixed);
      }
    }

    let shipping = 0;
    if (subtotal > 0) {
      if (subtotal >= this.shippingThreshold || (this.appliedPromo && this.appliedPromo.freeShipping)) {
        shipping = 0;
      } else {
        shipping = this.standardShippingCost;
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    return {
      items: this.items,
      subtotal,
      discount,
      shipping,
      total,
      appliedPromo: this.appliedPromo
    };
  }

  render() {
    const summary = this.getCartSummary();
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

    // Update count badges
    this.cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    // Update free shipping bar
    if (this.freeShippingBar && this.freeShippingText) {
      if (summary.subtotal >= this.shippingThreshold) {
        this.freeShippingBar.style.width = '100%';
        this.freeShippingText.innerHTML = '🎉 <strong>Free Cold-Chain Shipping</strong> unlocked!';
      } else {
        const remaining = (this.shippingThreshold - summary.subtotal).toFixed(2);
        const percent = Math.min(100, (summary.subtotal / this.shippingThreshold) * 100);
        this.freeShippingBar.style.width = `${percent}%`;
        this.freeShippingText.innerHTML = `Add <strong>$${remaining}</strong> more for <strong>Free Shipping</strong>`;
      }
    }

    // Render items list
    if (this.cartItemsContainer) {
      if (this.items.length === 0) {
        this.cartItemsContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 3rem; margin-bottom: 12px;">🍎</div>
            <h4 style="font-family: var(--font-display); margin-bottom: 6px;">Your cart is empty</h4>
            <p style="font-size: 0.9rem; margin-bottom: 20px;">Fill your basket with antioxidant-rich organic harvest!</p>
            <button class="btn btn-primary btn-sm" onclick="window.cartManager.closeDrawer()">Explore Fresh Harvest</button>
          </div>
        `;
      } else {
        this.cartItemsContainer.innerHTML = this.items.map(item => `
          <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} <span style="font-weight: 400; font-size: 0.75rem; color: var(--color-text-muted);">($${item.price.toFixed(2)}/${item.unit})</span></div>
              <div class="stepper-wrap" style="display: inline-flex;">
                <button class="stepper-btn" onclick="window.cartManager.updateQuantity('${item.id}', ${item.quantity - 1})" aria-label="Decrease quantity">-</button>
                <span class="stepper-value">${item.quantity}</span>
                <button class="stepper-btn" onclick="window.cartManager.updateQuantity('${item.id}', ${item.quantity + 1})" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div>
              <button class="remove-cart-item" onclick="window.cartManager.removeItem('${item.id}')" title="Remove item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Price totals
    if (this.subtotalEl) this.subtotalEl.textContent = `$${summary.subtotal.toFixed(2)}`;
    if (this.shippingEl) this.shippingEl.textContent = summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`;
    if (this.totalEl) this.totalEl.textContent = `$${summary.total.toFixed(2)}`;

    if (this.discountRowEl && this.discountValEl) {
      if (summary.discount > 0) {
        this.discountRowEl.style.display = 'flex';
        this.discountValEl.textContent = `-$${summary.discount.toFixed(2)}`;
      } else {
        this.discountRowEl.style.display = 'none';
      }
    }
  }
}
