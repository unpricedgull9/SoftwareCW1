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
    msg.innerText = "*  Drinks restocked (5)";
    msg.hidden = false;
    Logger.log("Admin", "Drinks restocked (5)");
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
    // function also returns total cash collected
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
    Logger.log("Admin", `Cash collected (£${collectedCash})`);
  }

  static viewLog() {
    const logs = Logger.getLogs();

    // Checks if logs exist (I dont know why they wouldnt since accessing the admin panel gets logged)
    if (logs.length === 0) {
      Modal.show("Transaction Log", "<p>No transaction logs recorded in this session yet.</p>", false);
    } else {
      let logHtml = "";
      logs.forEach((log) => {
        let amountText = "";
        let paymentType = "";
        if (log.amount) {
          amountText = ` (£${log.amount.toFixed(2)})`;
        }
        if (log.paymentType) {
          paymentType = ` (${log.paymentType})`
        }
        logHtml += `[${log.timestamp}] <b>${log.type}</b>: ${log.description}${amountText}${paymentType}<br><br>`;
      });

      logHtml = logHtml.substring(0, logHtml.length - 4); // Remove the last linebreak from the log
      Modal.show("Transaction Log", `<div class="modal-terminal">${logHtml}</div>`, false);
    }

    const confirmBtn = document.getElementById("modal-green");
    confirmBtn.textContent = "Close";
    confirmBtn.disabled = false;

    Modal.confirmFunction(() => {
      confirmBtn.textContent = "Confirm"; // So other modals dont get messed with
      Modal.hide();
    });
  }
}