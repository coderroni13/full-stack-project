/* ==========================================================================
   PUREHARVEST ORGANICS - CHECKOUT & LIVE ORDER SIMULATION
   ========================================================================== */

class CheckoutManager {
  constructor() {
    this.currentStep = 1;
    this.orderData = {};
    this.overlay = document.getElementById('checkoutModalOverlay');
    this.container = document.getElementById('checkoutModalContainer');
    this.summaryData = null;

    this.bindEvents();
  }

  bindEvents() {
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  open(summary) {
    this.summaryData = summary;
    this.currentStep = 1;
    this.orderData = {
      orderId: `PH-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...summary
    };
    this.render();
    if (this.overlay) {
      this.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  nextStep() {
    // Validate current step
    if (this.currentStep === 1) {
      const name = document.getElementById('chkFullName')?.value.trim();
      const email = document.getElementById('chkEmail')?.value.trim();
      const address = document.getElementById('chkAddress')?.value.trim();
      const city = document.getElementById('chkCity')?.value.trim();
      const zip = document.getElementById('chkZip')?.value.trim();

      if (!name || !email || !address || !city || !zip) {
        window.app.showToast('Please fill in all shipping fields', 'warning');
        return;
      }

      this.orderData.customer = { name, email, address, city, zip };
    } else if (this.currentStep === 2) {
      const slot = document.querySelector('input[name="deliverySlot"]:checked')?.value || 'Morning (8am - 12pm)';
      const packaging = document.querySelector('input[name="packagingOption"]:checked')?.value || '100% Compostable Box';
      this.orderData.deliverySlot = slot;
      this.orderData.packaging = packaging;
    }

    this.currentStep++;
    this.render();
  }

  prevStep() {
    this.currentStep = Math.max(1, this.currentStep - 1);
    this.render();
  }

  completeOrder() {
    // Place order
    this.currentStep = 4; // Receipt & Live Tracker
    if (window.cartManager) {
      window.cartManager.items = [];
      window.cartManager.save();
    }
    window.app.showToast('Order confirmed! We are notifying our local orchards 🚜', 'success');
    this.render();
  }

  render() {
    if (!this.container) return;

    let contentHtml = '';

    if (this.currentStep === 1) {
      contentHtml = `
        <div class="checkout-steps-bar">
          <div class="checkout-step-pill active"><span>1</span> Shipping</div>
          <div class="checkout-step-pill"><span>2</span> Delivery Slot</div>
          <div class="checkout-step-pill"><span>3</span> Payment</div>
        </div>
        <div style="padding: var(--space-2xl);">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 6px;">Where should we deliver your harvest?</h3>
          <p style="font-size: 0.9rem; margin-bottom: 20px;">We deliver in temperature-controlled electric vans to keep fruit chilled.</p>

          <form onsubmit="event.preventDefault(); window.checkoutManager.nextStep();">
            <div class="form-grid-2">
              <div class="form-group">
                <label for="chkFullName">Full Name *</label>
                <input type="text" id="chkFullName" class="form-input" placeholder="Eleanor Sterling" required value="${this.orderData.customer?.name || ''}">
              </div>
              <div class="form-group">
                <label for="chkEmail">Email Address *</label>
                <input type="email" id="chkEmail" class="form-input" placeholder="eleanor@organicfoodie.com" required value="${this.orderData.customer?.email || ''}">
              </div>
            </div>

            <div class="form-group">
              <label for="chkAddress">Street Address *</label>
              <input type="text" id="chkAddress" class="form-input" placeholder="742 Evergreen Orchard Terrace" required value="${this.orderData.customer?.address || ''}">
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label for="chkCity">City & State *</label>
                <input type="text" id="chkCity" class="form-input" placeholder="Portland, OR" required value="${this.orderData.customer?.city || ''}">
              </div>
              <div class="form-group">
                <label for="chkZip">ZIP Code *</label>
                <input type="text" id="chkZip" class="form-input" placeholder="97201" required value="${this.orderData.customer?.zip || ''}">
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-border-subtle);">
              <button type="button" class="btn btn-outline" onclick="window.checkoutManager.close()">Return to Cart</button>
              <button type="submit" class="btn btn-primary">Proceed to Schedule &rarr;</button>
            </div>
          </form>
        </div>
      `;
    } else if (this.currentStep === 2) {
      contentHtml = `
        <div class="checkout-steps-bar">
          <div class="checkout-step-pill"><span>✓</span> Shipping</div>
          <div class="checkout-step-pill active"><span>2</span> Delivery Slot</div>
          <div class="checkout-step-pill"><span>3</span> Payment</div>
        </div>
        <div style="padding: var(--space-2xl);">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 6px;">Select Cold-Chain Delivery Slot</h3>
          <p style="font-size: 0.9rem; margin-bottom: 20px;">Guaranteed within 24 hours of morning harvest.</p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
            <label style="display: flex; align-items: center; gap: 12px; padding: 14px; border: 1.5px solid var(--color-primary-600); background: var(--color-primary-50); border-radius: var(--radius-md); cursor: pointer;">
              <input type="radio" name="deliverySlot" value="Tomorrow Morning (8:00 AM - 12:00 PM)" checked>
              <div>
                <strong>Tomorrow Morning (8:00 AM - 12:00 PM)</strong>
                <p style="font-size: 0.8rem; margin: 0; color: var(--color-text-secondary);">Harvested at 5:00 AM, delivered fresh before lunch.</p>
              </div>
            </label>

            <label style="display: flex; align-items: center; gap: 12px; padding: 14px; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); cursor: pointer;">
              <input type="radio" name="deliverySlot" value="Tomorrow Afternoon (1:00 PM - 5:00 PM)">
              <div>
                <strong>Tomorrow Afternoon (1:00 PM - 5:00 PM)</strong>
                <p style="font-size: 0.8rem; margin: 0; color: var(--color-text-secondary);">Optimal for afternoon deliveries.</p>
              </div>
            </label>
          </div>

          <h4 style="font-size: 1rem; font-family: var(--font-display); margin-bottom: 10px;">Packaging Preference</h4>
          <div style="display: flex; gap: 12px; margin-bottom: 24px;">
            <label style="flex: 1; padding: 12px; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); cursor: pointer; font-size: 0.85rem;">
              <input type="radio" name="packagingOption" value="100% Recyclable Plant-Felt Box" checked>
              <strong>Plant-Felt Insulated Box</strong>
            </label>
            <label style="flex: 1; padding: 12px; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); cursor: pointer; font-size: 0.85rem;">
              <input type="radio" name="packagingOption" value="Zero-Waste Returnable Cotton Tote">
              <strong>Returnable Cotton Tote</strong>
            </label>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--color-border-subtle);">
            <button type="button" class="btn btn-outline" onclick="window.checkoutManager.prevStep()">&larr; Back</button>
            <button type="button" class="btn btn-primary" onclick="window.checkoutManager.nextStep()">Proceed to Payment &rarr;</button>
          </div>
        </div>
      `;
    } else if (this.currentStep === 3) {
      contentHtml = `
        <div class="checkout-steps-bar">
          <div class="checkout-step-pill"><span>✓</span> Shipping</div>
          <div class="checkout-step-pill"><span>✓</span> Slot</div>
          <div class="checkout-step-pill active"><span>3</span> Payment</div>
        </div>
        <div style="padding: var(--space-2xl);">
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 6px;">Simulated Payment Verification</h3>
          <p style="font-size: 0.9rem; margin-bottom: 20px;">256-Bit SSL Encrypted & Organic Certified Gateway.</p>

          <div style="background: var(--color-primary-50); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.95rem; margin-bottom: 4px;">
              <span>Subtotal:</span>
              <strong>$${this.orderData.subtotal.toFixed(2)}</strong>
            </div>
            ${this.orderData.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: var(--color-success); margin-bottom: 4px;">
                <span>Discount Promo:</span>
                <strong>-$${this.orderData.discount.toFixed(2)}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 0.95rem; margin-bottom: 8px;">
              <span>Cold-Chain Eco Transport:</span>
              <strong>${this.orderData.shipping === 0 ? 'FREE' : `$${this.orderData.shipping.toFixed(2)}`}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; color: var(--color-primary-900); padding-top: 8px; border-top: 1px dashed var(--color-primary-600);">
              <span>Grand Total:</span>
              <span>$${this.orderData.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Card Number (Simulation Mode)</label>
            <input type="text" class="form-input" value="4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8921" readonly>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label>Expiry</label>
              <input type="text" class="form-input" value="08/29" readonly>
            </div>
            <div class="form-group">
              <label>CVC</label>
              <input type="text" class="form-input" value="784" readonly>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-border-subtle);">
            <button type="button" class="btn btn-outline" onclick="window.checkoutManager.prevStep()">&larr; Back</button>
            <button type="button" class="btn btn-primary btn-lg" onclick="window.checkoutManager.completeOrder()">
              Place Order ($${this.orderData.total.toFixed(2)})
            </button>
          </div>
        </div>
      `;
    } else if (this.currentStep === 4) {
      // Order Complete & Live Tracker
      contentHtml = `
        <div style="padding: var(--space-3xl); text-align: center;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--color-primary-100); color: var(--color-primary-700); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 16px auto;">
            ✓
          </div>
          <span class="hero-badge">Order Confirmed</span>
          <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 8px;">Thank You, ${this.orderData.customer?.name || 'Organic Friend'}!</h2>
          <p style="font-size: 0.95rem; color: var(--color-text-secondary); max-width: 480px; margin: 0 auto 24px auto;">
            Your order <strong>#${this.orderData.orderId}</strong> has been transmitted to our farm coordinators.
          </p>

          <!-- Live Simulated Tracking Timeline -->
          <div class="order-tracking-visual">
            <div class="track-step-node completed">
              <div class="node-circle">1</div>
              <div>
                <strong>Harvest Order</strong>
                <p style="font-size: 0.75rem; color: var(--color-text-muted);">Confirmed</p>
              </div>
            </div>
            <div class="track-step-node active">
              <div class="node-circle">2</div>
              <div>
                <strong>Field Picking</strong>
                <p style="font-size: 0.75rem; color: var(--color-accent-amber);">In Progress</p>
              </div>
            </div>
            <div class="track-step-node">
              <div class="node-circle">3</div>
              <div>
                <strong>Cold QC Lab</strong>
                <p style="font-size: 0.75rem; color: var(--color-text-muted);">Queued</p>
              </div>
            </div>
            <div class="track-step-node">
              <div class="node-circle">4</div>
              <div>
                <strong>Door Delivery</strong>
                <p style="font-size: 0.75rem; color: var(--color-text-muted);">${this.orderData.deliverySlot?.split('(')[0] || 'Tomorrow'}</p>
              </div>
            </div>
          </div>

          <div style="background: var(--color-accent-sand); border-radius: var(--radius-md); padding: var(--space-lg); text-align: left; margin: 24px 0;">
            <h4 style="font-family: var(--font-display); font-size: 1.05rem; margin-bottom: 10px;">Order Summary Snapshot</h4>
            <div style="font-size: 0.9rem; display: flex; flex-direction: column; gap: 6px;">
              <div><strong>Recipient:</strong> ${this.orderData.customer?.name} (${this.orderData.customer?.email})</div>
              <div><strong>Delivery Destination:</strong> ${this.orderData.customer?.address}, ${this.orderData.customer?.city}</div>
              <div><strong>Slot:</strong> ${this.orderData.deliverySlot}</div>
              <div><strong>Total Paid:</strong> $${this.orderData.total.toFixed(2)}</div>
            </div>
          </div>

          <button class="btn btn-primary" onclick="window.checkoutManager.close(); window.location.href='#products';">
            Continue Exploring Harvest
          </button>
        </div>
      `;
    }

    this.container.innerHTML = `
      <button class="modal-close-btn" onclick="window.checkoutManager.close()" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      ${contentHtml}
    `;
  }
}
