// Drink Class Definition
class Drink {
  #id;
  #name;
  #price;
  #stock;
  // constructor builds drink
  constructor(id, name, price, stock) {
    this.#id = id;
    this.#name = name;
    this.#price = price;
    this.#stock = stock;
  }

  // getters to retrieve data from Drink obj
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get price() {
    return this.#price;
  }
  get stock() {
    return this.#stock;
  }
}
