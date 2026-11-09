// Cash Receiver Component
class CashReceiver {
  static #totalInserted = 0.0;

  // calls modal that displays cash inputs
  // theres a fake tenner in the inputs to display what would happen if fake or invalid currency was inserted into the machine
  static callModal() {
    TransactionTimer.resetTimer(() => {
      Modal.hide();
      controller.clearSelectionDisplay();
      document.getElementById("input-drink-id").value = "";
      VendingController.updateSelectionMessage(
        "* Payment timed out. Session cancelled.",
      );
    });
    this.#totalInserted = 0.0;
    let totalPrice = PaymentModule.currentPrice;

    const cashHTML = `
      <div class="cash-container">
        <div class="row">
          <button class="cash-note-btn tenner" onclick="CashReceiver.insertCash(10)">£10</button>
          <button class="cash-note-btn fiver" onclick="CashReceiver.insertCash(5)">£5</button>
        </div>
        <div class="row">
          <button class="cash-coin-btn" onclick="CashReceiver.insertCash(2)">£2</button>
          <button class="cash-coin-btn" onclick="CashReceiver.insertCash(1)">£1</button>
        </div>
        <div class="row">
          <button class="cash-coin-btn" onclick="CashReceiver.insertCash(0.5)">50p</button>
          <button class="cash-coin-btn" onclick="CashReceiver.insertCash(0.2)">20p</button>
        </div>
        <div class="row">
          <button class="cash-coin-btn" onclick="CashReceiver.insertCash(0.5)">50p</button>
          <button class="cash-coin-btn" onclick="CashReceiver.insertCash(0.2)">20p</button>
        </div>
        <div class="row">
          <button class="cash-coin-btn" onclick="CashReceiver.insertCash(0.1)">10p</button>
          <button class="cash-note-btn tenner" onclick="CashReceiver.insertCash(10, 'fake 10')">"Tenner"</button>
        </div>
        <div class="row">
          <p id="cash-total">£0.00 / £${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    `;

    const confirmBtn = document.getElementById("modal-green");
    confirmBtn.disabled = true;

    // handles the logical flow and process of confirming payment and dispensing drink
    Modal.confirmFunction(() => {
      const changeNeeded = parseFloat(
        (this.#totalInserted - PaymentModule.currentPrice).toFixed(2),
      );

      // gets the name and id,
      if (controller.selectedDrink) {
        const drinkName = controller.selectedDrink.name;
        const drinkId = controller.selectedDrink.id;

        WeightSensor.dispenseDrinkStock(drinkId);

        controller.renderDrinksTable();

        // check if change is required and calculate exact change breakdown
        if (changeNeeded > 0) {
          // calculates if change can be given
          const changeResult = CashSensor.calculateChange(changeNeeded);
          if (!changeResult.success) {
            Modal.message(
              "* Error: Machine cannot give exact change. Transaction cancelled.",
            );
            Logger.log("Error", "Not enough change", changeNeeded);
            // const cancelBtn = document.getElementById("modal-red");
            // cancelBtn.onclick(() => {
            //   Modal.message("");
            //   Modal.hideMessage();
            // });
            return;
          } else {
            ChangeDispenser.dispenseCash(
              "change",
              changeNeeded,
              changeResult.change,
              () => DrinkDispenser.dispenseDrink(drinkName),
            );
            Logger.log(
              "Purchase",
              `${drinkName} (${drinkId}) (Change: £${changeNeeded.toFixed(2)})`,
              PaymentModule.currentPrice,
              "Cash",
            );
            return;
          }
        }

        // this does get called on
        Logger.log(
          "Purchase",
          `${drinkName} (${drinkId})`,
          PaymentModule.currentPrice,
          "Cash",
        );
        DrinkDispenser.dispenseDrink(drinkName);
      } else {
        Modal.hide();
      }
    });

    // this looks so clean
    Modal.show("Pay with Cash", cashHTML, true);
  }

  static insertCash(value, type = "real") {
    // Resets timeout timer
    TransactionTimer.resetTimer(() => {
      Modal.hide();
      controller.clearSelectionDisplay();
      document.getElementById("input-drink-id").value = "";
      VendingController.updateSelectionMessage(
        "* Payment timed out. Session cancelled.",
      );
    });
    // validate cash validity and track inserted totals against target price
    if (CashValidator.checkCashValidity(value, type)) {
      CashSensor.addCash(value);
      // adds value to total
      this.#totalInserted += value;
      // updates the total
      this.updateCashTotal(this.#totalInserted, PaymentModule.currentPrice);
      // allow user to pay if theyve added enough
      if (this.#totalInserted >= PaymentModule.currentPrice) {
        const confirmBtn = document.getElementById("modal-green");
        const btns = document.querySelectorAll(
          ".cash-note-btn, .cash-coin-btn",
        );
        // disables cash buttons
        btns.forEach((btn) => {
          btn.disabled = true;
        });
        if (confirmBtn) {
          confirmBtn.disabled = false;
        }
      }
    } else {
      Logger.log("Error", "Invalid cash inserted", value);
      Modal.message("* Error: Invalid cash inserted.");
    }
  }

  // updates the total inserted cash
  static updateCashTotal(totalInserted, totalPrice) {
    const cashTotalElement = document.getElementById("cash-total");
    if (cashTotalElement) {
      cashTotalElement.textContent = `£${totalInserted.toFixed(
        2,
      )} / £${totalPrice.toFixed(2)}`;
    }
  }
}
