function Deal(vendor, description, amount) {

    this.id = Date.now() + Math.random();

    this.vendor = vendor;

    this.description = description;

    this.amount = Number(amount);
}


Deal.prototype.getFormattedAmount = function () {

    return `R${this.amount.toFixed(2)}`;

};


Deal.prototype.getDetails = function () {

    return `${this.vendor}: ${this.description}`;

};


export default Deal;
