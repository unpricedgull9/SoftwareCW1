// Drink Dispenser UI Component
class DrinkDispenser {
  // OLIVER modal works well, but the stock doesnt update and you might need to try and test it through console
  static dispenseDrink(drinkName) {
    TransactionTimer.clearTimer();
    Modal.show(
      "Dispensing Drink",
      `<div class="modal-terminal">
             Your <b style='color: green;'>${drinkName}</b> is being prepared and dispensed. 
             <br><br>Please collect your drink from the slot!
           </div>`,
      false,
    );

    const confirmBtn = document.getElementById("modal-green");
    confirmBtn.textContent = "Confirm";
    confirmBtn.disabled = false;

    Modal.confirmFunction(() => {
      Modal.hide();
      controller.clearSelectionDisplay();
    });
  }
}
