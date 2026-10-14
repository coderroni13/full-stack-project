/* ==========================================================================
   PUREHARVEST ORGANICS - CUSTOM HARVEST BOX BUILDER
   ========================================================================== */

class BoxBuilderManager {
  constructor() {
    this.tiers = {
      solo: { name: "Solo Orchard Box", capacity: 5, basePrice: 29.00 },
      family: { name: "Family Harvest Box", capacity: 10, basePrice: 49.00 },
      connoisseur: { name: "Exotic Connoisseur Box", capacity: 15, basePrice: 74.00 }
    };

    this.selectedTier = 'family';
    this.selectedCadence = 'weekly'; // weekly (15% off), biweekly (10% off), onetime (0% off)
    this.boxItems = {}; // { 'fruit-01': 2, 'fruit-02': 1 } (each fruit unit counts as approx 1 lb)

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.tierCards = document.querySelectorAll('.tier-option-card');
    this.fruitGrid = document.getElementById('builderFruitSelector');
    this.meterFill = document.getElementById('boxMeterFill');
    this.meterText = document.getElementById('boxMeterText');
    this.summaryPrice = document.getElementById('builderBoxPrice');
    this.cadenceBtns = document.querySelectorAll('.cadence-btn');
    this.addBoxToCartBtn = document.getElementById('addCustomBoxToCartBtn');
  }

  bindEvents() {
    this.tierCards.forEach(card => {
      card.addEventListener('click', () => {
        this.tierCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedTier = card.dataset.tier;
        this.enforceCapacity();
        this.render();
      });
    });

    this.cadenceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.cadenceBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
        this.cadenceBtns.forEach(b => b.classList.add('btn-outline'));
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-outline');
        this.selectedCadence = btn.dataset.cadence;
        this.render();
      });
    });

    if (this.addBoxToCartBtn) {
      this.addBoxToCartBtn.addEventListener('click', () => this.addCustomBoxToCart());
    }
  }

  getCurrentWeight() {
    return Object.values(this.boxItems).reduce((sum, qty) => sum + qty, 0);
  }

  getCapacity() {
    return this.tiers[this.selectedTier].capacity;
  }

  enforceCapacity() {
    const max = this.getCapacity();
    let current = this.getCurrentWeight();
    if (current > max) {
      // Scale down items
      const keys = Object.keys(this.boxItems);
      for (const key of keys) {
        if (current <= max) break;
        const diff = current - max;
        const reduceBy = Math.min(this.boxItems[key], diff);
        this.boxItems[key] -= reduceBy;
        if (this.boxItems[key] === 0) delete this.boxItems[key];
        current -= reduceBy;
      }
    }
  }

  adjustFruit(productId, delta) {
    const currentWeight = this.getCurrentWeight();
    const maxCapacity = this.getCapacity();
    const currentFruitQty = this.boxItems[productId] || 0;

    if (delta > 0 && currentWeight >= maxCapacity) {
      window.app.showToast(`Your ${this.tiers[this.selectedTier].name} is full (${maxCapacity} lbs capacity). Upgrade tier for more!`, 'warning');
      return;
    }

    const newQty = Math.max(0, currentFruitQty + delta);
    if (newQty === 0) {
      delete this.boxItems[productId];
    } else {
      this.boxItems[productId] = newQty;
    }

    this.render();
  }

  calculatePrice() {
    const base = this.tiers[this.selectedTier].basePrice;
    let discount = 0;
    if (this.selectedCadence === 'weekly') discount = 0.15;
    else if (this.selectedCadence === 'biweekly') discount = 0.10;

    const finalPrice = base * (1 - discount);
    return {
      basePrice: base,
      discountPercent: discount * 100,
      finalPrice: finalPrice
    };
  }

  addCustomBoxToCart() {
    const weight = this.getCurrentWeight();
    const capacity = this.getCapacity();

    if (weight < Math.ceil(capacity / 2)) {
      window.app.showToast(`Please select at least ${Math.ceil(capacity / 2)} lbs of fresh fruits to balance your box!`, 'warning');
      return;
    }

    const tierInfo = this.tiers[this.selectedTier];
    const pricing = this.calculatePrice();
    const fruitNames = Object.entries(this.boxItems)
      .map(([id, qty]) => {
        const f = PRODUCTS_DATA.find(p => p.id === id);
        return f ? `${qty}x ${f.name}` : '';
      })
      .filter(Boolean)
      .join(', ');

    const customBoxProduct = {
      id: `custom-box-${Date.now()}`,
      name: `${tierInfo.name} (${this.selectedCadence === 'onetime' ? 'One-time' : (this.selectedCadence === 'weekly' ? 'Weekly Sub' : 'Bi-weekly Sub')})`,
      price: pricing.finalPrice,
      unit: `${weight} lbs curated (${fruitNames || 'Orchard Choice'})`,
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
    };

    if (window.cartManager) {
      window.cartManager.addItem(customBoxProduct, 1);
      window.cartManager.openDrawer();
    }
  }

  render() {
    const weight = this.getCurrentWeight();
    const capacity = this.getCapacity();
    const pricing = this.calculatePrice();

    // Update Progress Meter
    if (this.meterFill && this.meterText) {
      const percentage = Math.min(100, (weight / capacity) * 100);
      this.meterFill.style.width = `${percentage}%`;
      this.meterText.textContent = `${weight} / ${capacity} lbs filled`;
    }

    // Update Pricing Display
    if (this.summaryPrice) {
      this.summaryPrice.innerHTML = `
        $${pricing.finalPrice.toFixed(2)}
        ${pricing.discountPercent > 0 ? `<span style="font-size: 0.85rem; color: var(--color-success); font-weight: 700; margin-left: 6px;">(${pricing.discountPercent}% Subscription Savings)</span>` : ''}
      `;
    }

    // Render Fruit Options Grid
    if (this.fruitGrid) {
      const availableFruits = PRODUCTS_DATA.filter(p => p.category !== 'bundles');
      this.fruitGrid.innerHTML = availableFruits.map(fruit => {
        const qty = this.boxItems[fruit.id] || 0;
        return `
          <div class="builder-fruit-item ${qty > 0 ? 'in-box' : ''}">
            <img src="${fruit.image}" alt="${fruit.name}" class="builder-fruit-thumb">
            <h4 style="font-size: 0.85rem; font-family: var(--font-display); margin-bottom: 2px;">${fruit.name}</h4>
            <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 8px;">~1 lb pack</p>
            
            <div class="stepper-wrap">
              <button class="stepper-btn" onclick="window.boxBuilderManager.adjustFruit('${fruit.id}', -1)" aria-label="Subtract">-</button>
              <span class="stepper-value">${qty}</span>
              <button class="stepper-btn" onclick="window.boxBuilderManager.adjustFruit('${fruit.id}', 1)" aria-label="Add">+</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}
