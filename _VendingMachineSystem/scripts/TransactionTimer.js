// Transaction Timer to time out a transaction when it lasts longer than 30 seconds
class TransactionTimer {
  static #timer = null; // Stores the currently running timer
  static #TIMEOUT_DURATION = 30000; //0; // 30 seconds in milliseconds

  // Start or restart the idle countdown timer
  static startTimer(onTimeoutCallback) {
    this.clearTimer(); // Always clear any existing timer first

    // setTimeout lets you bind a function to a timer in milliseconds
    this.#timer = setTimeout(() => {
      console.log("Transaction timed out due to inactivity.");
      // revert loyalty discount to ensure member isnt still logged in
      LoyaltyScanner.revertLoyaltyDiscount(); 
      if (typeof onTimeoutCallback === "function") {
        onTimeoutCallback();
      }
    }, this.#TIMEOUT_DURATION);
  }

  // Called whenever user interacts with the modal
  static resetTimer(onTimeoutCallback) {
    this.startTimer(onTimeoutCallback);
  }

  // Called when the transaction is finished
  static clearTimer() {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
}
