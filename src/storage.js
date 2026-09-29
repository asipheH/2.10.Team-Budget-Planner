const STORAGE_KEY = "teamBudgetPlanner";


export function saveBudget(budget) {

    return new Promise(function (resolve, reject) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(budget)
            );

            resolve("Budget saved successfully.");

        } catch (error) {

            reject(error);

        }

    });

}


export async function loadBudget() {

    return new Promise(function (resolve) {

        const data =
            localStorage.getItem(STORAGE_KEY);


        if (!data) {

            resolve(null);

            return;

        }


        resolve(JSON.parse(data));

    });

}


export function clearBudget() {

    return new Promise(function (resolve) {

        localStorage.removeItem(STORAGE_KEY);

        resolve("Budget cleared.");

    });

}
