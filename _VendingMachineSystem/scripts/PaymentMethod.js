class PaymentMethod {
  static open(paymentType) {
    paymentType.callModal();
  }

  static callModal() {
    throw new Error("Payment method must implement callModal()");
  }
}