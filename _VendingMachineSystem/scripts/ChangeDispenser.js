// Change Dispenser Handles Physical Payout And Inventory Sync
class ChangeDispenser {
  static dispenseCash(type, value, changeData = [], onCollected = null) {
    TransactionTimer.clearTimer();
    if (type === "change") {
      // deduct dispensed change quantities from internal cash stock data registers
      for (const dispensed of changeData) {
        const cashItem = CashSensor.getCashData().find(
          (c) => c.type === dispensed.type,
        );
        if (cashItem) {
          cashItem.stock -= dispensed.count;
        }
      }

      const breakdownHtml = changeData
        .map((item) => `${item.type}: ${item.count}`)
        .join("<br>");

      const changeHTML = `
            <div class="modal-terminal" style="margin-bottom: 1rem;" >
              ${breakdownHtml}
            </div>
            <p class="msg">* Change succesfully provided</p>
          `;

      // show modal with title "Change" matching layout requirement
      Modal.show("Change", changeHTML, false);

      const confirmBtn = document.getElementById("modal-green");
      confirmBtn.textContent = "Collect";
      confirmBtn.disabled = false;

      Modal.confirmFunction(() => {
        confirmBtn.textContent = "Confirm";
        Modal.hide();
        if (onCollected) {
          onCollected();
        }
      });

      console.log(`Dispensing change: £${value.toFixed(2)}`);
    } else if (type === "rejected") {
      Modal.show(
        "Invalid Cash",
        `<div class="modal-terminal">The cash you inserted (£${value.toFixed(2)}) has been <b style='color: red;'>rejected</b> for being damaged or fake.</div>`,
        false,
      );

      const confirmBtn = document.getElementById("modal-green");
      confirmBtn.textContent = "Confirm";
      confirmBtn.disabled = false;

      Modal.confirmFunction(() => {
        Modal.hide();
        Modal.hideMessage();
      });

      console.log(`Rejecting invalid cash: £${value.toFixed(2)}`);
    }
  }
}
