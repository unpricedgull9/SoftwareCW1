// Cash Sensor Component
class CashSensor {
  static #CASH_DATA = [
    { type: "£10", worth: 10, stock: 10 },
    { type: "£5", worth: 5, stock: 10 },
    { type: "£2", worth: 2, stock: 10 },
    { type: "£1", worth: 1, stock: 10 },
    { type: "50p", worth: 0.5, stock: 10 },
    { type: "20p", worth: 0.2, stock: 10 },
    { type: "10p", worth: 0.1, stock: 10 },
  ];

  static getCashData() {
    return this.#CASH_DATA;
  }

  static addCash(value) {
    const cashItem = this.#CASH_DATA.find((item) => item.worth === value);
    if (!cashItem) {
      throw new RangeError(`Unsupported cash denomination: ${value}`);
    }

    cashItem.stock += 1;
  }

  // calculate exact change breakdown by trying to fit largest value into remaining cash
  static calculateChange(changeNeeded) {
    const changeToDispense = [];
    // checks all objects in json
    for (let i = 0; i < this.#CASH_DATA.length; i++) {
      const item = this.#CASH_DATA[i];
      if (changeNeeded <= 0) {
        break;
      }
      // rounds the number down but now thinking about it while commenting this might need changing? OLIVER
      let count = Math.floor(changeNeeded / item.worth);

      if (count > item.stock) {
        count = item.stock;
      }

      if (count > 0) {
        changeToDispense.push({
          type: item.type,
          worth: item.worth,
          count: count,
        });
        changeNeeded = parseFloat(
          (changeNeeded - count * item.worth).toFixed(2),
        );
      }
    }

    // return failure flag if exact change cannot be taken out of stock
    if (changeNeeded > 0) {
      console.log("Machine cannot provide exact change!");
      return { success: false, change: [] };
    }

    console.log("Machine can provide exact change.");
    return { success: true, change: changeToDispense };
  }
  // only empties to 1 (in case people need change)
  static emptyCash() {
    // sets total
    let total = 0.00;
    // gets current cash
    const currentCash = this.getCashData();
    // for every cash type, add worth to total (minus 1)
    currentCash.forEach((cash) => {
      total += (cash.stock - 1) * cash.worth;
      // sets stock to one
      cash.stock = 1;
    });
    return total.toFixed(2);
  }
}
