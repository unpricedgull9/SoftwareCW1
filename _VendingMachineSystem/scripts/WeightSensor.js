// Weight Sensor Tracking Component
class WeightSensor {
  static #WEIGHT_DATA = [
    {
      id: "000",
      name: "Espresso",
      weight: 3300,
      fakeStock: 22,
      individualWeight: 150,
    },
    {
      id: "001",
      name: "Latte",
      weight: 350,
      fakeStock: 1,
      individualWeight: 350,
    },
    {
      id: "002",
      name: "Hot Chocolate",
      weight: 5250,
      fakeStock: 15,
      individualWeight: 350,
    },
    {
      id: "003",
      name: "Bottled Water",
      weight: 10000,
      fakeStock: 20,
      individualWeight: 500,
    },
  ];
  static #totalWeights = [];

  // OLIVER i havent checked if these methods all work correctly
  static calculateRealStock() {
    // compute real stock levels based on current weights divided by item individual weights
    this.#totalWeights = this.#WEIGHT_DATA.map((drink) => {
      const realStock = Math.floor(drink.weight / drink.individualWeight);
      return { id: drink.id, name: drink.name, realStock };
    });
  }

  static getRealStock() {
    this.calculateRealStock();
    return this.#totalWeights;
  }

  // reduce drink weight when purchased (at least should)
  static dispenseDrinkStock(drinkId) {
    const drink = this.#WEIGHT_DATA.find((d) => d.id === drinkId);
    if (drink && drink.weight >= drink.individualWeight) {
      drink.weight -= drink.individualWeight;
    }
  }

  static getDrinkIndividualWeight(drinkId) {
    const drink = this.#WEIGHT_DATA.find((d) => d.id === drinkId);
    return drink ? drink.individualWeight : null;
  }

  static restock(qty) {
    this.#WEIGHT_DATA.forEach((drink) => {
      drink.weight += drink.individualWeight * qty;
    });
    return true;
  }
}
