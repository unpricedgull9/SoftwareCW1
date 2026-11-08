// Stock Sensor Module
class StockSensor {
  // dont ask me why this stupid json is formatted like this when you hit quick format
  static #STOCK_DATA = [
    { id: "000", name: "Espresso", price: 1.5, weight: 150, stock: 0 },
    { id: "001", name: "Latte", price: 2.2, weight: 350, stock: 0 },
    {
      id: "002",
      name: "Hot Chocolate",
      price: 2.0,
      weight: 350,
      stock: 0,
    },
    {
      id: "003",
      name: "Bottled Water",
      price: 1.0,
      weight: 500,
      stock: 0,
    },
  ];

  // stock sensor requests weight sensor to calculate how many drinks are in each compartment??? (dunno what its called)
  static getStock() {
    // sets the genuine calculated stock data from the weight sensor
    const realStockData = WeightSensor.getRealStock();
    // prepares a list that will be populated with stock
    const updatedStockList = [];

    // iterate through stock items to match and update stock counts dynamically based on weight sensor readings
    for (const drink of this.#STOCK_DATA) {
      // matches item (drink from weight sensor) with drink (from STOCK_DATA)
      const match = realStockData.find((item) => item.id === drink.id);
      // if match, assign stock, if not, 0
      const currentStock = match ? match.realStock : 0;

      // populates the object
      const drinkWithStock = {
        id: drink.id,
        name: drink.name,
        price: drink.price,
        stock: currentStock,
      };

      // appends it to the json
      updatedStockList.push(drinkWithStock);
    }

    return updatedStockList;
  }

  // literally replaces placeholder stock with calculated stock
  static updateStock(drinkId, newStock) {
    const drink = this.#STOCK_DATA.find((d) => d.id === drinkId);
    if (drink) {
      drink.stock = newStock;
    }
  }

  // Implemented updateAllStock
  static updateAllStock() {
    const latestStock = this.getStock();
    latestStock.forEach((item) => {
      this.updateStock(item.id, item.stock);
    });
    return this.#STOCK_DATA;
  }
}
