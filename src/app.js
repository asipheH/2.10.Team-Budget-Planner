import "./style.css";

import Budget from "./budget.js";

import Deal from "./deal.js";

import {
    loadBudget,
    saveBudget
} from "./storage.js";


// IIFE
(function () {

    let budget = null;


    const budgetForm =
        document.getElementById("budget-form");


    const dealForm =
        document.getElementById("deal-form");


    const teamNameInput =
        document.getElementById("team-name");


    const annualBudgetInput =
        document.getElementById("annual-budget");


    const vendorInput =
        document.getElementById("vendor-name");


    const descriptionInput =
        document.getElementById("deal-description");


    const amountInput =
        document.getElementById("deal-amount");


    const displayTeam =
        document.getElementById("display-team");


    const displayBudget =
        document.getElementById("display-budget");


    const displayExpenses =
        document.getElementById("display-expenses");


    const displayRemaining =
        document.getElementById("display-remaining");


    const dealList =
        document.getElementById("deal-list");


    const dealTable =
        document.getElementById("deal-table");


    const emptyMessage =
        document.getElementById("empty-message");


    const message =
        document.getElementById("message");


    function formatCurrency(amount) {

        return new Intl.NumberFormat("en-ZA", {

            style: "currency",

            currency: "ZAR"

        }).format(amount);

    }


    function showMessage(
        text,
        type = "success"
    ) {

        message.textContent = text;

        message.className = type;


        setTimeout(function () {

            message.textContent = "";

            message.className = "";

        }, 3000);

    }


    function renderBudget() {

        if (!budget) {

            return;

        }


        displayTeam.textContent =
            budget.teamName;


        displayBudget.textContent =
            formatCurrency(
                budget.annualBudget
            );


        displayExpenses.textContent =
            formatCurrency(
                budget.getTotalExpenses()
            );


        const remaining =
            budget.getRemainingBudget();


        displayRemaining.textContent =
            formatCurrency(remaining);


        if (budget.isOverBudget()) {

            displayRemaining.classList.add(
                "danger"
            );

        } else {

            displayRemaining.classList.remove(
                "danger"
            );

        }


        renderDeals();

    }


    function renderDeals() {

        dealList.innerHTML = "";


        if (
            !budget ||
            budget.deals.length === 0
        ) {

            dealTable.style.display = "none";

            emptyMessage.style.display =
                "block";

            return;

        }


        dealTable.style.display = "table";

        emptyMessage.style.display = "none";


        budget.deals.forEach(function (deal) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(deal.vendor)}
                </td>

                <td>
                    ${escapeHTML(deal.description)}
                </td>

                <td>
                    ${deal.getFormattedAmount()}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        data-id="${deal.id}">
                        Delete
                    </button>

                </td>

            `;


            dealList.appendChild(row);

        });

    }


    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent = value;


        return div.innerHTML;

    }


    budgetForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const teamName =
                teamNameInput.value.trim();


            const annualBudget =
                Number(
                    annualBudgetInput.value
                );


            if (!teamName) {

                showMessage(
                    "Please enter a team name.",
                    "error"
                );

                return;

            }


            if (
                annualBudget <= 0 ||
                Number.isNaN(annualBudget)
            ) {

                showMessage(
                    "Please enter a valid annual budget.",
                    "error"
                );

                return;

            }


            budget =
                new Budget(
                    teamName,
                    annualBudget
                );


            await saveBudget(budget);


            renderBudget();


            showMessage(
                "Team budget has been created."
            );


            budgetForm.reset();

        }
    );


    dealForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!budget) {

                showMessage(
                    "Please set the team budget first.",
                    "error"
                );

                return;

            }


            const vendor =
                vendorInput.value.trim();


            const description =
                descriptionInput.value.trim();


            const amount =
                Number(amountInput.value);


            if (
                !vendor ||
                !description
            ) {

                showMessage(
                    "Please complete all deal fields.",
                    "error"
                );

                return;

            }


            if (
                amount <= 0 ||
                Number.isNaN(amount)
            ) {

                showMessage(
                    "Please enter a valid deal amount.",
                    "error"
                );

                return;

            }


            const deal =
                new Deal(
                    vendor,
                    description,
                    amount
                );


            budget.addDeal(deal);


            await saveBudget(budget);


            renderBudget();


            showMessage(
                "Vendor deal added successfully."
            );


            dealForm.reset();

        }
    );


    dealList.addEventListener(
        "click",
        async function (event) {

            if (
                !event.target.classList.contains(
                    "delete-btn"
                )
            ) {

                return;

            }


            const id =
                Number(
                    event.target.dataset.id
                );


            if (!budget) {

                return;

            }


            budget.removeDeal(id);


            await saveBudget(budget);


            renderBudget();


            showMessage(
                "Vendor deal removed."
            );

        }
    );


    async function initializeApplication() {

        try {

            const savedBudget =
                await loadBudget();


            if (!savedBudget) {

                return;

            }


            budget =
                new Budget(
                    savedBudget.teamName,
                    savedBudget.annualBudget
                );


            savedBudget.deals.forEach(
                function (savedDeal) {

                    const deal =
                        new Deal(
                            savedDeal.vendor,
                            savedDeal.description,
                            savedDeal.amount
                        );


                    deal.id =
                        savedDeal.id;


                    budget.addDeal(deal);

                }
            );


            renderBudget();

        } catch (error) {

            console.error(
                "Could not load budget:",
                error
            );


            showMessage(
                "Could not load saved data.",
                "error"
            );

        }

    }


    initializeApplication();

})();
