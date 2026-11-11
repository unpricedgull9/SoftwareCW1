// A single log entry handled by the Logger class
class TransactionRecord {
  constructor(type, description, amount = null, paymentType = null) {
    this.timestamp = new Date().toLocaleTimeString();
    this.type = type; // Purchase, Admin or Error
    this.description = description;
    this.amount = amount;
    this.paymentType = paymentType;
  }
}