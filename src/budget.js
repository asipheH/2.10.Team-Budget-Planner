import Deal from "./deal.js";


function Budget(teamName, annualBudget) {

    this.teamName = teamName;

    this.annualBudget = Number(annualBudget);

    this.deals = [];

}


Budget.prototype.addDeal = function (deal) {

    if (!(deal instanceof Deal)) {

        throw new Error("Invalid deal.");

    }

    this.deals.push(deal);

};


Budget.prototype.removeDeal = function (id) {

    this.deals = this.deals.filter(function (deal) {

        return deal.id !== id;

    });

};


Budget.prototype.getTotalExpenses = function () {

    return this.deals.reduce(function (total, deal) {

        return total + deal.amount;

    }, 0);

};


Budget.prototype.getRemainingBudget = function () {

    return this.annualBudget -
        this.getTotalExpenses();

};


Budget.prototype.isOverBudget = function () {

    return this.getRemainingBudget() < 0;

};


export default Budget;
