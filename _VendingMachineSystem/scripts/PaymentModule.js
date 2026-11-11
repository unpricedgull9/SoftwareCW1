// Payment Module Component
class PaymentModule {
  static currentPrice = 0;

  static applyLoyaltyDiscount(price) {
    const discountRate = 0.1;
    // Altered to avoid floating point errors
    let newPrice = price - price * discountRate;
    newPrice = newPrice.toFixed(2);
    return parseFloat(newPrice);
  }

  static updatePaymentDisplay(drinkID, drinkName) {
    const idDisplay = document.getElementById("sel-drink-id");
    const nameDisplay = document.getElementById("sel-drink-name");
    const priceDisplay = document.getElementById("sel-drink-price");

    // update price text layout and display active loyalty discount badge if applicable
    if (this.currentPrice > 0) {
      priceDisplay.innerHTML =
        `Price: £${this.currentPrice.toFixed(2)}` +
        (LoyaltyScanner.getLoyaltyStatus()
          ? "<b style='color: green;'> -10%</b>"
          : "");
    } else {
      priceDisplay.textContent = "Price: £N/A";
    }

    // OLIVER i feel like we might be able to integrate this into like a update selection function, it works tho so might not have to
    if (drinkID && drinkName) {
      idDisplay.textContent = `ID: ${drinkID}`;
      nameDisplay.textContent = `Drink: ${drinkName}`;
    } else {
      idDisplay.textContent = "ID: N/A";
      nameDisplay.textContent = "Drink: N/A";
    }
  }
}
