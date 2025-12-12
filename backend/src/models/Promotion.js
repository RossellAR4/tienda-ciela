// Promotion.js
class Promotion {
  constructor(id, title, description, discountType, discountValue, validFrom, validTo) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.discountType = discountType; // percentage or fixed
    this.discountValue = discountValue;
    this.validFrom = validFrom;
    this.validTo = validTo;
    this.isActive = true;
  }

  isCurrentlyValid() {
    const now = new Date();
    return this.isActive && 
           now >= new Date(this.validFrom) && 
           now <= new Date(this.validTo);
  }

  calculateDiscount(amount) {
    if (!this.isCurrentlyValid()) return 0;
    
    if (this.discountType === 'percentage') {
      return amount * (this.discountValue / 100);
    } else {
      return Math.min(amount, this.discountValue);
    }
  }
}

module.exports = Promotion;
