// Bank Service Component
class BankService {
  // OLIVER we should make the second account have no balance and the first have a bit so we can properly test card payment if its rejected by the bank
  static #SAVED_CARDS = [
    { number: "1234567890", pin: "1234", balance: 500.0 },
    { number: "0987654321", pin: "4321", balance: 0.0 }, // Should decline on purchase
  ];
  static processCardPayment(cardNumber, cardPin, amount) {
    console.log(`Processing card payment for £${amount.toFixed(2)}`);
    const card = this.#SAVED_CARDS.find(
      (c) => c.number === cardNumber && c.pin === cardPin,
    );

    // verify card details against saved records
    if (!card) {
      Modal.message("*Invalid card number or PIN.");
      return false;
    } else {
      if (card.balance < amount) {
        Modal.message("*Card declined.");
        return false;
      }
      card.balance -= amount;
      console.log("Card payment successful.");
      console.log("New balance: " + card.balance);
      return true;
    }
  }
}
