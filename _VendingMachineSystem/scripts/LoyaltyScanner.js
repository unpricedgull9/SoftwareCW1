// Loyalty Scanner Component
class LoyaltyScanner {
  static loyaltyStatus = false;
  static #LOYALTY_DATA = [
    { id: "000", name: "John Smith", code: "ABC123" },
    { id: "001", name: "Jane Smith", code: "XYZ789" },
    { id: "002", name: "Bob Johnson", code: "DEF456" },
  ];

  static checkLoyaltyId() {
    const loyaltyIdInput = document.getElementById("input-loyalty-id");
    const loyaltyMsg = document.getElementById("loyalty-msg");
    const enteredId = loyaltyIdInput.value.trim();

    // search loyalty registry records by user id or discount code
    const loyaltyData = this.#LOYALTY_DATA.find(
      (loyalty) => loyalty.id === enteredId || loyalty.code === enteredId,
    );
    if (loyaltyData) {
      loyaltyMsg.textContent = `Welcome, ${loyaltyData.name}! (10% Discount Applied)`;
      loyaltyMsg.hidden = false;
      this.loyaltyStatus = true;

      // update current pricing dynamically if a drink is already selected
      // OLIVER for some reason only hot chocolate can be bought with a loyalty discount, otherwise change cant be provided, idk whats causing it good luck
      if (controller.selectedDrink) {
        const basePrice = controller.selectedDrink.price;
        PaymentModule.currentPrice = this.applyLoyaltyDiscount(basePrice);
        PaymentModule.updatePaymentDisplay(
          controller.selectedDrink.id,
          controller.selectedDrink.name,
        );
      }
    } else {
      loyaltyMsg.textContent = "*Error: Invalid Loyalty ID.";
      loyaltyMsg.hidden = false;
      this.loyaltyStatus = false;
    }
  }

  static applyLoyaltyDiscount(price) {
    return price * 0.9;
  }

  static getLoyaltyStatus() {
    return this.loyaltyStatus;
  }
}
