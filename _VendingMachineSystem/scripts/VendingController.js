// Vending Controller Logic
class VendingController {
  // hardcoded password to display logic for the hardcoded prototype
  #adminPass = "1234";

  // initialisation method that runs at the beginning
  constructor() {
    this.drinks = [];
    this.selectedDrink = null;
    this.refreshInventory();
  }

  // Populates the drinks array with drink objects from the json file
  refreshInventory() {
    this.drinks = [];
    StockSensor.getStock().forEach((stockDrink) => {
      this.drinks.push(
        new Drink(
          stockDrink["id"],
          stockDrink["name"],
          stockDrink["price"],
          stockDrink["stock"],
        ),
      );
    });
  }

  // method to check the admin pin
  checkAdminPass() {
    const adminPassInput = document.getElementById("input-admin-pass");
    const adminPassBtn = document.getElementById("admin-btn");
    const adminMsg = document.getElementById("admin-msg");
    const adminBtns = document.querySelector(".admin-btns");

    const enteredPass = adminPassInput.value;
    // checks if the pin is correct
    if (enteredPass === this.#adminPass) {
      // hides the inputs if correct
      adminMsg.hidden = true;
      adminBtns.hidden = false;
      // displays the hidden buttons
      adminBtns.style.display = "flex";
      adminPassInput.hidden = true;
      adminPassBtn.hidden = true;
      Logger.log("Admin", "Logged into admin panel");
    } else {
      adminMsg.textContent = "* Incorrect PIN. Please try again.";
      adminMsg.hidden = false;
      adminBtns.hidden = true;
      adminBtns.style.display = "none";
    }
  }

  // method to allow a user to select a drink
  selectDrink(id) {
    const msgElement = document.getElementById("sel-msg");
    const trimmedId = id.toString().trim();

    // clear selection and message if input length isnt 3 characters
    if (trimmedId.length < 3) {
      msgElement.hidden = true;
      this.clearSelectionDisplay();
      return;
    }

    // finds the drink that correlates with inputted id
    const drink = this.drinks.find((d) => d.id === trimmedId);

    // handle error if drink id is invalid
    if (!drink) {
      msgElement.textContent = "* Error: Invalid Drink ID.";
      msgElement.hidden = false;
      this.clearSelectionDisplay();
      return;
    }

    // handle error if chosen drink has zero stock
    if (drink.stock <= 0) {
      msgElement.textContent = `*Error: ${drink.name} is out of stock.`;
      msgElement.hidden = false;
      this.clearSelectionDisplay();
      return;
    }

    // selects the drink
    this.selectedDrink = drink;

    // Start a 30s timeout timer
    TransactionTimer.startTimer(() => {
      this.clearSelectionDisplay();
      document.getElementById("input-drink-id").value = "";
      VendingController.updateSelectionMessage(
        "*  Session timed out. Please select again.",
      );
      Modal.hide();
    });

    // hides any messages that may linger
    msgElement.hidden = true;

    // selects the price of the drink
    PaymentModule.currentPrice = drink.price;
    // apply active loyalty discount to item price if user loyalty status is verified
    if (LoyaltyScanner.loyaltyStatus) {
      PaymentModule.currentPrice = PaymentModule.applyLoyaltyDiscount(
        drink.price,
      );
    }
    // updates the display with the available data
    PaymentModule.updatePaymentDisplay(drink.id, drink.name);
  }

  // clears the display if a drink isnt selected
  clearSelectionDisplay() {
    this.selectedDrink = null;
    PaymentModule.currentPrice = 0;
    document.getElementById("sel-drink-id").textContent = "ID: N/A";
    document.getElementById("sel-drink-name").textContent = "Drink: N/A";
    document.getElementById("sel-drink-price").textContent = "Price: £N/A";
  }

  static updateSelectionMessage(message) {
    const msgElement = document.getElementById("sel-msg");
    if (msgElement) {
      msgElement.textContent = message;
      msgElement.hidden = false;
    }
  }

  // renders the drinks table
  renderDrinksTable() {
    this.refreshInventory();
    const table = document.querySelector("#drinks-panel table");
    // redundancy
    if (!table) return;

    let html = `
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          `;

    // dynamically generate table rows for each available drink item in inventory
    this.drinks.forEach((drink) => {
      html += `
              <tr>
                <td>${drink.id}</td>
                <td>${drink.name}</td>
                <td>£${drink.price.toFixed(2)}</td>
                <td>${drink.stock}</td>
              </tr>
            `;
    });

    table.innerHTML = html;
  }
}
