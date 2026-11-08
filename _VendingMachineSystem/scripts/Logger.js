// Keeps a log of any transactions, admin actions or errors
class Logger {
  static #logs = [];

  // Adds a new TransactionRecord to the log
  static log(type, description, amount = null, paymentType = null) {
    const record = new TransactionRecord(type, description, amount, paymentType);
    this.#logs.push(record);
  }

  // Returns the entire log as an array
  static getLogs() {
    return this.#logs;
  }
}