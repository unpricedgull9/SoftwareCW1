// Card Reader Component
// this entire class is rather basic
class CardReader {
  static callModal() {
    TransactionTimer.resetTimer(() => {
      Modal.hide();
      controller.clearSelectionDisplay();
      document.getElementById("input-drink-id").value = "";
      VendingController.updateSelectionMessage(
        "*Payment timed out. Session cancelled.",
      );
    });
    const cardHTML = `
        <input type="text" id="card-number" placeholder="Enter Card Number" style="margin-bottom: 1rem;" />
        <input type="password" id="card-pin" placeholder="Enter PIN" />
      `;

    // handle card submission and validate credentials via bank service
    Modal.confirmFunction(() => {
      const cardNumber = document.getElementById("card-number").value;
      const cardPin = document.getElementById("card-pin").value;

      if (
        BankService.processCardPayment(
          cardNumber,
          cardPin,
          PaymentModule.currentPrice,
        )
      ) {
        Modal.hide();
        Modal.hideMessage();

        // on successful payment, drink gets dispensed and modal pops up
        if (controller.selectedDrink) {
          const drinkName = controller.selectedDrink.name;
          const drinkId = controller.selectedDrink.id;

          WeightSensor.dispenseDrinkStock(drinkId);
          controller.renderDrinksTable();

          DrinkDispenser.dispenseDrink(drinkName);
          Logger.log("Purchase", `${drinkName} (${drinkId})`, PaymentModule.currentPrice, "Card");
        }

        // these are so fun but so painful to do im gonna go mad
        Modal.confirmFunction(() => {
          Modal.hide();
          controller.clearSelectionDisplay();
        });
      }
    });

    Modal.show("Pay with Card", cardHTML, true);
  }
}
