// Cash Validator Component
class CashValidator {
  static validCash = [10, 5, 2, 1, 0.5, 0.2, 0.1];
  static checkCashValidity(value, type) {
    // check whether inserted currency matches accepted valid denominations and type
    if (type === "real" && this.validCash.includes(value)) {
      return true;
    } else {
      ChangeDispenser.dispenseCash("rejected", value);
      return false;
    }
  }
}
