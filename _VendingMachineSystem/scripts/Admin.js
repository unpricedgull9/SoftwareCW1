class Admin {
  static restockDrinks(qty) {
    WeightSensor.restock(qty);
    StockSensor.updateAllStock();
    controller.renderDrinksTable();
    console.log(
      "Restocked successfully. Current Stock:",
      StockSensor.getStock(),
    );

    const msg = document.getElementById("admin-msg");
    msg.innerText = "* Drinks restocked (5)";
    msg.hidden = false;
  }

  static viewCash() {
    const cashData = CashSensor.getCashData();

    // Map cash stock items into the same breakdown format as the change dispenser modal
    const breakdownHtml = cashData
      .map((item) => `${item.type}: ${item.stock}`)
      .join("<br>");

    const cashHTML = `
      <div class="modal-terminal" style="margin-bottom: 1rem;">
        ${breakdownHtml}
      </div>
      <p class="msg">* Current cash inventory loaded</p>
    `;

    // Show modal with title "Cash Inventory" matching your layout format
    Modal.show("Cash Inventory", cashHTML, true);

    const confirmBtn = document.getElementById("modal-green");

    confirmBtn.textContent = "Collect";
    confirmBtn.disabled = false;

    const cancelBtn = document.getElementById("modal-red");
    cancelBtn.onclick = () => {
      Modal.hide();
    };
    Modal.confirmFunction(() => {
      this.collectCash();
    });

    console.log("Viewing cash inventory:", cashData);
  }

  static collectCash() {
    const collectedCash = CashSensor.emptyCash();
    Modal.show(
      "Cash Collected Successfully!",
      `<h3 style="color:var(--green-color);margin-top:0;">£${collectedCash}</h3>All cash in the machine is now empty but one of each.`,
      false,
    );
    const confirmBtn = document.getElementById("modal-green");

    confirmBtn.textContent = "Confirm";
    confirmBtn.disabled = false;

    Modal.confirmFunction(() => {
      Modal.hide();
    });
  }
}
