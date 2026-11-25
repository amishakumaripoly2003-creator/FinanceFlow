let transactions = [];
let editingId = null;
let currentMonthSpent = 0;

const API_URL = "http://localhost:5000/api/transactions";
const GOALS_API_URL = "http://localhost:5000/api/goals";

// ================================
// ELEMENTS
// ================================

const addTransactionBtn = document.getElementById("addTransactionBtn");
const transactionModal = document.getElementById("transactionModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelTransactionBtn = document.getElementById("cancelTransactionBtn");
const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const analyticsIncome = document.getElementById("analyticsIncome");
const analyticsExpenses = document.getElementById("analyticsExpenses");
const analyticsSavings = document.getElementById("analyticsSavings");
const savingsRate = document.getElementById("savingsRate");

const analyticsBudget =
    document.getElementById("analyticsBudget");

const analyticsActual =
    document.getElementById("analyticsActual");

const analyticsStartDate =
    document.getElementById("analyticsStartDate");

const analyticsEndDate =
    document.getElementById("analyticsEndDate");

const analyticsBudgetPercentage =
    document.getElementById("analyticsBudgetPercentage");

const analyticsBudgetProgress =
    document.getElementById("analyticsBudgetProgress");

const analyticsBudgetStatus =
    document.getElementById("analyticsBudgetStatus");

const topSpendingCategory =
    document.getElementById("topSpendingCategory");

const highestSpendingMonth =
    document.getElementById("highestSpendingMonth");

const averageMonthlySpending =
    document.getElementById("averageMonthlySpending");

const financialInsights =
    document.getElementById("financialInsights");


const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");
const savingsAmount = document.getElementById("savingsAmount");

const saveTransactionBtn = document.getElementById("saveTransactionBtn");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");

const spendingPeriod =
    document.getElementById("spendingPeriod");

const analyticsPeriod =
    document.getElementById("analyticsPeriod");

if (spendingPeriod) {
    spendingPeriod.value = "this-month";
}

const themeToggle = document.getElementById("themeToggle");
const themeBtn = document.getElementById("themeBtn");

const currencySelect = document.getElementById("currencySelect");
const clearTransactionsBtn = document.getElementById("clearTransactionsBtn");

const setBudgetBtn = document.getElementById("setBudgetBtn");
const budgetModal = document.getElementById("budgetModal");
const closeBudgetModalBtn = document.getElementById("closeBudgetModalBtn");
const cancelBudgetBtn = document.getElementById("cancelBudgetBtn");
const budgetForm = document.getElementById("budgetForm");
const budgetInput = document.getElementById("budgetInput");
const budgetAmount = document.getElementById("budgetAmount");
const budgetSpent = document.getElementById("budgetSpent");
const budgetRemaining = document.getElementById("budgetRemaining");
const budgetProgress = document.getElementById("budgetProgress");
const budgetPercentage = document.getElementById("budgetPercentage");

const dashboardSection = document.getElementById("dashboardSection");
const analyticsSection = document.getElementById("analyticsSection");
const settingsSection = document.getElementById("settingsSection");
const transactionsSection = document.getElementById("transactionsSection");

const dashboardLink = document.getElementById("dashboardLink");
const transactionsLink = document.getElementById("transactionsLink");
const analyticsLink = document.getElementById("analyticsLink");
const settingsLink = document.getElementById("settingsLink");

const transactionsPageList =
    document.getElementById("transactionsPageList");

const transactionsAddBtn =
    document.getElementById("transactionsAddBtn");

// ================================
// GOALS ELEMENTS
// ================================

const goalsList = document.getElementById("goalsList");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalModal = document.getElementById("goalModal");
const closeGoalModalBtn = document.getElementById("closeGoalModalBtn");
const cancelGoalBtn = document.getElementById("cancelGoalBtn");
const goalForm = document.getElementById("goalForm");

// ================================
// CURRENCY
// ================================

let selectedCurrency =
    localStorage.getItem("currency") || "₹";

function formatAmount(amount) {
    return `${selectedCurrency}${Number(amount).toLocaleString("en-IN")}`;
}

// ================================
// BUDGET MODAL
// ================================

setBudgetBtn.addEventListener("click", function () {

    budgetInput.value = "";
    budgetModal.style.display = "flex";

});

closeBudgetModalBtn.addEventListener("click", function () {

    budgetModal.style.display = "none";

});

cancelBudgetBtn.addEventListener("click", function () {

    budgetModal.style.display = "none";

});

// ================================
// SAVE MONTHLY BUDGET
// ================================

budgetForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const amount = Number(budgetInput.value);

    if (amount <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    const currentDate = new Date();

    const month =
        `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
        ).padStart(2, "0")}`;

    try {

        const token =
            localStorage.getItem("financeflowToken");

        const response = await fetch(
            "http://localhost:5000/api/budgets",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    amount: amount,
                    month: month
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save budget");
        }

        const data = await response.json();

        console.log("Budget saved:", data);

        alert("Budget saved successfully!");

        budgetModal.style.display = "none";

        budgetInput.value = "";

        await loadBudget();

    } catch (error) {

        console.error("Error saving budget:", error);

        alert("Failed to save budget.");

    }

});

// ================================
// TRANSACTION MODAL
// ================================

function openModal() {
    transactionModal.style.display = "flex";
}

function closeModal() {
    transactionModal.style.display = "none";
}

// ================================
// ADD TRANSACTION BUTTON
// ================================

addTransactionBtn.addEventListener("click", function () {

    editingId = null;

    transactionForm.reset();

    saveTransactionBtn.textContent = "Add Transaction";

    openModal();

});

transactionsAddBtn.addEventListener("click", function () {

    editingId = null;

    transactionForm.reset();

    saveTransactionBtn.textContent = "Add Transaction";

    openModal();

});

// ================================
// CLOSE TRANSACTION MODAL
// ================================

closeModalBtn.addEventListener("click", closeModal);
cancelTransactionBtn.addEventListener("click", closeModal);

// ================================
// TRANSACTION FORM SUBMIT
// ================================

transactionForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const title =
        document.getElementById("transactionTitle").value;

    const amount =
        Number(document.getElementById("transactionAmount").value);

    const category =
        document.getElementById("transactionCategory").value;

    const date =
        document.getElementById("transactionDate").value;

    const description =
        document.getElementById("transactionDescription").value;

    const selectedType =
        document.querySelector(
            'input[name="transactionType"]:checked'
        );

    if (!selectedType) {
        alert("Please select transaction type.");
        return;
    }

    const type = selectedType.value;

    const transaction = {
        title,
        amount,
        type,
        category,
        date,
        description
    };

    // ================================
    // ADD NEW TRANSACTION
    // ================================

    if (editingId === null) {

        try {

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
                },

                body: JSON.stringify(transaction)
            });

            if (!response.ok) {
                throw new Error("Failed to add transaction");
            }

            const data = await response.json();

            transactions.push(data.transaction);

        } catch (error) {

            console.error(
                "Error adding transaction:",
                error
            );

            return;
        }

    }

    // ================================
    // UPDATE EXISTING TRANSACTION
    // ================================

    else {

        try {

            const response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
                    },

                    body: JSON.stringify(transaction)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update transaction");
            }

            const data = await response.json();

            const transactionIndex =
                transactions.findIndex(function (item) {
                    return item._id === editingId;
                });

            if (transactionIndex !== -1) {

                transactions[transactionIndex] =
                    data.transaction;

            }

        } catch (error) {

            console.error(
                "Error updating transaction:",
                error
            );

            return;
        }

        editingId = null;
    }

    renderTransactions();
    renderTransactionsPage();
    calculateTotals();

    transactionForm.reset();

    saveTransactionBtn.textContent =
        "Add Transaction";

    closeModal();

});

// ================================
// RENDER TRANSACTIONS
// ================================

function createTransactionElement(transaction) {

    const transactionItem =
        document.createElement("div");

    transactionItem.classList.add("transaction-item");

    transactionItem.innerHTML = `

        <div class="transaction-left">

            <div class="transaction-icon">
                ${
                    transaction.type === "income"
                    ? "💰"
                    : "🛒"
                }
            </div>

            <div>

                <div class="transaction-title">
                    ${transaction.title}
                </div>

                <div class="transaction-meta">
                    ${transaction.category}
                    •
                    ${transaction.date}
                </div>

            </div>

        </div>

        <div class="transaction-right">

            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === "income" ? "+" : "-"}
                ${formatAmount(transaction.amount)}
            </div>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        </div>
    `;

    // ================================
    // EDIT TRANSACTION
    // ================================

    const editBtn =
        transactionItem.querySelector(".edit-btn");

    editBtn.addEventListener("click", function () {

        editingId = transaction._id;

        saveTransactionBtn.textContent =
            "Save Changes";

        document.getElementById(
            "transactionTitle"
        ).value = transaction.title;

        document.getElementById(
            "transactionAmount"
        ).value = transaction.amount;

        document.getElementById(
            "transactionCategory"
        ).value = transaction.category;

        document.getElementById(
            "transactionDate"
        ).value = transaction.date;

        document.getElementById(
            "transactionDescription"
        ).value =
            transaction.description || "";

        const typeRadio =
            document.querySelector(
                `input[name="transactionType"][value="${transaction.type}"]`
            );

        if (typeRadio) {
            typeRadio.checked = true;
        }

        openModal();

    });

    // ================================
    // DELETE TRANSACTION
    // ================================

    const deleteBtn =
        transactionItem.querySelector(".delete-btn");

    deleteBtn.addEventListener(
        "click",
        async function () {

            const confirmDelete = confirm(
                "Are you sure you want to delete this transaction?"
            );

            if (!confirmDelete) {
                return;
            }

            try {

                const response = await fetch(
                    `${API_URL}/${transaction._id}`,
                    {
                        method: "DELETE",
                        headers: {
                        "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to delete transaction"
                    );
                }

                transactions =
                    transactions.filter(function (item) {

                        return item._id !== transaction._id;

                    });

                renderTransactions();
                renderTransactionsPage();
                calculateTotals();

            } catch (error) {

                console.error(
                    "Error deleting transaction:",
                    error
                );

            }

        }
    );

    return transactionItem;
}


// ================================
// DASHBOARD TRANSACTIONS
// ================================

function renderTransactions(list = transactions) {

    transactionList.innerHTML = "";

    const recentTransactions =
        list.slice(-5).reverse();

    if (recentTransactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🧾
                </div>

                <h3>
                    No transactions found
                </h3>

                <p>
                    Add a transaction to start
                    tracking your finances.
                </p>

            </div>

        `;

        return;
    }

    recentTransactions.forEach(
        function (transaction) {

            transactionList.appendChild(
                createTransactionElement(transaction)
            );

        }
    );

}


// ================================
// TRANSACTIONS PAGE
// ================================

function renderTransactionsPage(
    list = transactions
) {

    transactionsPageList.innerHTML = "";

    if (list.length === 0) {

        transactionsPageList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🧾
                </div>

                <h3>
                    No matching transactions found
                </h3>

                <p>
                    Try changing your search
                    or filters.
                </p>

            </div>

        `;

        return;
    }

    list.forEach(function (transaction) {

        transactionsPageList.appendChild(
            createTransactionElement(transaction)
        );

    });

}


// ================================
// CHARTS
// ================================

let incomeExpenseChart = null;
let monthlyTrendChart = null;
let categoryChart = null;
let dashboardCategoryChart = null;


// ================================
// INCOME VS EXPENSE CHART
// ================================

const incomeExpenseCanvas =
    document.getElementById(
        "incomeExpenseChart"
    );
 
    incomeExpenseCanvas &&
    typeof Chart !== "undefined"
{

    incomeExpenseChart =
        new Chart(
            incomeExpenseCanvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Income",
                        "Expenses"
                    ],

                    datasets: [
                        {
                            label: "Amount",
                            data: [0, 0]
                        }
                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

}


// ================================
// MONTHLY TREND CHART
// ================================

const monthlyTrendCanvas =
    document.getElementById(
        "monthlyTrendChart"
    );

if (
    monthlyTrendCanvas &&
    typeof Chart !== "undefined"
) {

    monthlyTrendChart =
        new Chart(
            monthlyTrendCanvas,
            {

                type: "line",

                data: {

                    labels: [],

                    datasets: [

                        {
                            label: "Income",
                            data: [],
                            tension: 0.3
                        },

                        {
                            label: "Expenses",
                            data: [],
                            tension: 0.3
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: "top"
                        },

                        tooltip: {

                            callbacks: {

                                label: function (context) {

                                    const value =
                                        context.raw;

                                    return `${context.dataset.label}: ${selectedCurrency}${Number(value).toLocaleString("en-IN")}`;

                                }

                            }

                        }

                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

}


// ================================
// CATEGORY CHART
// ================================

const categoryCtx =
    document.getElementById(
        "categoryChart"
    );

if (
    categoryCtx &&
    typeof Chart !== "undefined"
) {

    categoryChart =
        new Chart(
            categoryCtx,
            {

                type: "doughnut",

                data: {

                    labels: [],

                    datasets: [

                        {

                            data: [],

                            backgroundColor: [
                                "#f59e0b",
                                "#8b5cf6",
                                "#3b82f6",
                                "#22c55e",
                                "#ef4444",
                                "#06b6d4",
                                "#ec4899",
                                "#64748b"
                            ],

                            borderWidth: 2,

                            borderColor: "#ffffff"

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: "right"
                        }

                    }

                }

            }
        );

}

// ================================
// DASHBOARD SPENDING OVERVIEW
// ================================

const dashboardCategoryCanvas =
    document.getElementById("dashboardCategoryChart");

if (
    dashboardCategoryCanvas &&
    typeof Chart !== "undefined"
) {

    dashboardCategoryChart =
        new Chart(
            dashboardCategoryCanvas,
            {
                type: "doughnut",

                data: {
                    labels: [],

                    datasets: [
                        {
                            data: [],

                            backgroundColor: [
                                "#6366f1",
                                "#8b5cf6",
                                "#3b82f6",
                                "#22c55e",
                                "#f59e0b",
                                "#ec4899",
                                "#06b6d4",
                                "#64748b"
                            ],

                            borderWidth: 3,

                            borderColor: "#ffffff"
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "68%",

                    plugins: {

                        legend: {
                            position: "right",

                            labels: {
                                usePointStyle: true,
                                padding: 14,
                                font: {
                                    size: 12
                                }
                            }
                        },

                        tooltip: {

                            callbacks: {

                                label: function (context) {

                                    const value =
                                        context.raw || 0;

                                    return `${context.label}: ${selectedCurrency}${Number(value).toLocaleString("en-IN")}`;
                                }

                            }

                        }

                    }

                }

            }
        );

}


// ================================
// SPENDING OVERVIEW PERIOD FILTER
// ================================

if (spendingPeriod) {

    spendingPeriod.addEventListener(
        "change",
        function () {

            const selectedPeriod =
                spendingPeriod.value;

            let selectedTotals = {};

            const today = new Date();

            let targetYear =
                today.getFullYear();

            let targetMonth =
                today.getMonth();

            // Last month select kiya
            if (selectedPeriod === "last-month") {

                targetMonth--;

                // January handle karo
                if (targetMonth < 0) {
                    targetMonth = 11;
                    targetYear--;
                }
            }

            transactions.forEach(
                function (transaction) {

                    if (
                        transaction.type !==
                        "expense"
                    ) {
                        return;
                    }

                    const transactionDate =
                        new Date(
                            transaction.date
                        );

                    if (
                        transactionDate.getFullYear() !==
                            targetYear ||
                        transactionDate.getMonth() !==
                            targetMonth
                    ) {
                        return;
                    }

                    const category =
                        transaction.category ||
                        "other";

                    selectedTotals[category] =
                        (
                            selectedTotals[category] ||
                            0
                        ) +
                        Number(
                            transaction.amount
                        );

                }
            );


            const labels =
                Object.keys(selectedTotals);

            const values =
                Object.values(selectedTotals);


            // Update chart
            dashboardCategoryChart.data.labels =
                labels;

            dashboardCategoryChart.data.datasets[0].data =
                values;

            dashboardCategoryChart.update();


            // Empty state
            const emptyState =
                document.getElementById(
                    "spendingOverviewEmpty"
                );

            if (emptyState) {

                emptyState.style.display =
                    labels.length === 0
                        ? "flex"
                        : "none";

            }

        }
    );

}

async function updateAnalyticsBudgetVsActual(months, actualSpending) {

    if (!analyticsBudget || !analyticsActual) {
        return;
    }

    let totalBudget = 0;

    try {

        const budgetRequests = months.map(function (month) {

            const token = localStorage.getItem("financeflowToken");

return fetch(
    `http://localhost:5000/api/budgets/${month}`,
    {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
)
                .then(function (response) {

                    if (!response.ok) {
                        return null;
                    }

                    return response.json();
                })
                .catch(function () {
                    return null;
                });

        });

        const budgets = await Promise.all(budgetRequests);

        budgets.forEach(function (budget) {

            if (budget && budget.amount) {
                totalBudget += Number(budget.amount);
            }

        });

        analyticsBudget.textContent =
            formatAmount(totalBudget);

        analyticsActual.textContent =
            formatAmount(actualSpending);

        if (totalBudget > 0) {

    const percentage =
        (actualSpending / totalBudget) * 100;

    const displayedPercentage =
        Math.min(percentage, 100);

    analyticsBudgetPercentage.textContent =
        `${percentage.toFixed(1)}%`;

    analyticsBudgetProgress.style.width =
        `${displayedPercentage}%`;

    if (actualSpending <= totalBudget) {

        const remaining =
            totalBudget - actualSpending;

        analyticsBudgetStatus.textContent =
            `${formatAmount(remaining)} remaining`;

    }
    else {

        const exceeded =
            actualSpending - totalBudget;

        analyticsBudgetStatus.textContent =
            `Over budget by ${formatAmount(exceeded)}`;

    }

}
else {

    analyticsBudgetPercentage.textContent =
        "0%";

    analyticsBudgetProgress.style.width =
        "0%";

    analyticsBudgetStatus.textContent =
        "No budget data available";

}
        

    } catch (error) {

        console.error(
            "Error loading analytics budget:",
            error
        );

    }
}


function updateFinancialInsights(
    categoryTotals,
    totalIncome,
    totalExpenses,
    previousExpenses
) {

    if (!financialInsights) {
        return;
    }

    const insights = [];


    // =================================
    // 1. TOP SPENDING CATEGORY
    // =================================

    let topCategory = "—";
    let topCategoryAmount = 0;

    Object.keys(categoryTotals).forEach(function (category) {

        if (categoryTotals[category] > topCategoryAmount) {

            topCategoryAmount =
                categoryTotals[category];

            topCategory = category;
        }

    });


    if (topCategory !== "—") {

        const formattedCategory =
            topCategory.charAt(0).toUpperCase() +
            topCategory.slice(1);

        insights.push({
            icon: "🛒",
            title: "Top Spending Category",
            text:
                `${formattedCategory} is your highest spending category at ${formatAmount(topCategoryAmount)}.`
        });

    }


    // =================================
    // 2. SAVINGS INSIGHT
    // =================================

    const savings =
        totalIncome - totalExpenses;

    if (totalIncome > 0) {

        const savingsPercentage =
            (savings / totalIncome) * 100;

        if (savings > 0) {

            insights.push({
                icon: "💰",
                title: "Savings Insight",
                text:
                    `You saved ${formatAmount(savings)} during this period, which is ${savingsPercentage.toFixed(1)}% of your income.`
            });

        }
        else {

            insights.push({
                icon: "⚠️",
                title: "Savings Insight",
                text:
                    "Your expenses are equal to or higher than your income during this period."
            });

        }

    }


    // =================================
    // 3. SPENDING INSIGHT
    // =================================

    if (totalExpenses > 0) {

        insights.push({
            icon: "📊",
            title: "Spending Insight",
            text:
                `Your total spending during this period was ${formatAmount(totalExpenses)}.`
        });

    }


    // =================================
    // 4. SPENDING COMPARISON
    // =================================

    if (previousExpenses !== null &&
        previousExpenses !== undefined) {

        if (previousExpenses === 0) {

            if (totalExpenses > 0) {

                insights.push({
                    icon: "📈",
                    title: "Spending Comparison",
                    text:
                        `You spent ${formatAmount(totalExpenses)} during this period, while there was no spending in the previous period.`
                });

            }
            else {

                insights.push({
                    icon: "⚖️",
                    title: "Spending Comparison",
                    text:
                        "There was no spending in either period."
                });

            }

        }
        else {

            const difference =
                totalExpenses - previousExpenses;

            const percentageChange =
                (Math.abs(difference) / previousExpenses) * 100;


            if (difference > 0) {

                insights.push({
                    icon: "📈",
                    title: "Spending Comparison",
                    text:
                        `Your spending increased by ${percentageChange.toFixed(1)}% compared to the previous period.`
                });

            }
            else if (difference < 0) {

                insights.push({
                    icon: "📉",
                    title: "Spending Comparison",
                    text:
                        `Your spending decreased by ${percentageChange.toFixed(1)}% compared to the previous period.`
                });

            }
            else {

                insights.push({
                    icon: "⚖️",
                    title: "Spending Comparison",
                    text:
                        "Your spending is the same as the previous period."
                });

            }

        }

    }


    // =================================
    // DISPLAY INSIGHTS
    // =================================

    if (insights.length === 0) {

        financialInsights.innerHTML = `
            <div class="insight-item">

                <span class="insight-icon">
                    💡
                </span>

                <div class="insight-content">

                    <strong>
                        Financial Insight
                    </strong>

                    <p>
                        Add some transactions to generate insights.
                    </p>

                </div>

            </div>
        `;

        return;
    }


    financialInsights.innerHTML =
        insights.map(function (insight) {

            return `
                <div class="insight-item">

                    <span class="insight-icon">
                        ${insight.icon}
                    </span>

                    <div class="insight-content">

                        <strong>
                            ${insight.title}
                        </strong>

                        <p>
                            ${insight.text}
                        </p>

                    </div>

                </div>
            `;

        }).join("");

}

// ================================
// ANALYTICS PERIOD FILTER
// ================================

function renderAnalyticsForPeriod() {

    if (!analyticsPeriod) {
        return;
    }

    const selectedPeriod =
        analyticsPeriod.value;

    const today = new Date();

    const currentYear =
        today.getFullYear();

    const currentMonth =
        today.getMonth();

    // ================================
    // CREATE MONTH KEY
    // ================================

    function getMonthKey(year, month) {

        return `${year}-${String(month + 1).padStart(2, "0")}`;

    }


    // ================================
    // GET MONTH RANGE
    // ================================

    let startDate;
    let endDate;

    if (selectedPeriod === "this-month") {

        startDate =
            new Date(
                currentYear,
                currentMonth,
                1
            );

        endDate =
            new Date(
                currentYear,
                currentMonth,
                1
            );

    }

    else if (selectedPeriod === "last-month") {

        startDate =
            new Date(
                currentYear,
                currentMonth - 1,
                1
            );

        endDate =
            new Date(
                currentYear,
                currentMonth - 1,
                1
            );

    }

    else if (selectedPeriod === "last-3-months") {

        startDate =
            new Date(
                currentYear,
                currentMonth - 2,
                1
            );

        endDate =
            new Date(
                currentYear,
                currentMonth,
                1
            );

    }

    else if (selectedPeriod === "last-6-months") {

        startDate =
            new Date(
                currentYear,
                currentMonth - 5,
                1
            );

        endDate =
            new Date(
                currentYear,
                currentMonth,
                1
            );

    }

    else if (selectedPeriod === "this-year") {

        startDate =
            new Date(
                currentYear,
                0,
                1
            );

        endDate =
            new Date(
                currentYear,
                currentMonth,
                1
            );

    }

    else if (selectedPeriod === "custom") {

    if (
        !analyticsStartDate ||
        !analyticsEndDate ||
        !analyticsStartDate.value ||
        !analyticsEndDate.value
    ) {
        return;
    }

    startDate =
        new Date(
            analyticsStartDate.value + "T00:00:00"
        );

    endDate =
        new Date(
            analyticsEndDate.value + "T23:59:59"
        );

    if (startDate > endDate) {
        return;
    }

}
else {
    return;
}


    // ================================
    // CREATE MONTH LIST
    // ================================

    const months = [];

    let datePointer =
        new Date(startDate);

    while (datePointer <= endDate) {

        months.push(
            getMonthKey(
                datePointer.getFullYear(),
                datePointer.getMonth()
            )
        );

        datePointer.setMonth(
            datePointer.getMonth() + 1
        );

    }


    // ================================
    // FILTER TRANSACTIONS
    // ================================

    const filteredTransactions =
    transactions.filter(function (transaction) {

        if (!transaction.date) {
            return false;
        }

        if (selectedPeriod === "custom") {

            const transactionDate =
                new Date(transaction.date);

            return (
                transactionDate >= startDate &&
                transactionDate <= endDate
            );
        }

        const transactionMonth =
            transaction.date.substring(0, 7);

        return months.includes(transactionMonth);

    });


    // ================================
    // CALCULATE ANALYTICS TOTALS
    // ================================

    let totalIncome = 0;
    let totalExpenses = 0;

    const categoryTotals = {};

    const monthlyTotals = {};

    // Create all selected months
    months.forEach(
        function (month) {

            monthlyTotals[month] = {
                income: 0,
                expenses: 0
            };

        }
    );


    filteredTransactions.forEach(
        function (transaction) {

            const amount =
                Number(transaction.amount) || 0;

            const month =
                transaction.date.substring(0, 7);


            if (transaction.type === "income") {

                totalIncome += amount;

                if (monthlyTotals[month]) {

                    monthlyTotals[month].income +=
                        amount;

                }

            }

            else {

                totalExpenses += amount;

                const category =
                    transaction.category ||
                    "other";

                if (categoryTotals[category]) {

                    categoryTotals[category] +=
                        amount;

                }

                else {

                    categoryTotals[category] =
                        amount;

                }


                if (monthlyTotals[month]) {

                    monthlyTotals[month].expenses +=
                        amount;

                }

            }

        }
    );

    // =================================
// CALCULATE PREVIOUS PERIOD SPENDING
// =================================

let previousStartDate;
let previousEndDate;

if (selectedPeriod === "this-month") {

    previousStartDate =
        new Date(
            currentYear,
            currentMonth - 1,
            1
        );

    previousEndDate =
        new Date(
            currentYear,
            currentMonth,
            1
        );

}
else if (selectedPeriod === "last-month") {

    previousStartDate =
        new Date(
            currentYear,
            currentMonth - 2,
            1
        );

    previousEndDate =
        new Date(
            currentYear,
            currentMonth - 1,
            1
        );

}
else if (selectedPeriod === "last-3-months") {

    previousStartDate =
        new Date(
            currentYear,
            currentMonth - 5,
            1
        );

    previousEndDate =
        new Date(
            currentYear,
            currentMonth - 2,
            1
        );

}
else if (selectedPeriod === "last-6-months") {

    previousStartDate =
        new Date(
            currentYear,
            currentMonth - 11,
            1
        );

    previousEndDate =
        new Date(
            currentYear,
            currentMonth - 5,
            1
        );

}
else if (selectedPeriod === "this-year") {

    previousStartDate =
        new Date(
            currentYear - 1,
            0,
            1
        );

    previousEndDate =
        new Date(
            currentYear - 1,
            currentMonth + 1,
            1
        );

}
else if (selectedPeriod === "custom") {

    const selectedDuration =
        endDate.getTime() -
        startDate.getTime();

    previousEndDate =
        new Date(
            startDate.getTime() - 1000
        );

    previousStartDate =
        new Date(
            previousEndDate.getTime() -
            selectedDuration
        );

}


// Calculate previous expenses

let previousExpenses = 0;

if (previousStartDate && previousEndDate) {

    transactions.forEach(function (transaction) {

        if (
            !transaction.date ||
            transaction.type !== "expense"
        ) {
            return;
        }

        const transactionDate =
            new Date(transaction.date);

        if (
            transactionDate >= previousStartDate &&
            transactionDate <= previousEndDate
        ) {

            previousExpenses +=
                Number(transaction.amount) || 0;

        }

    });

}


    // ================================
    // SAVINGS
    // ================================

    const totalSavings =
        totalIncome - totalExpenses;


    const rate =
        totalIncome > 0
        ? (totalSavings / totalIncome) * 100
        : 0;

    // Calculate Spending Metrics

let topCategory = "—";
let topCategoryAmount = 0;

Object.keys(categoryTotals).forEach(function (category) {

    if (categoryTotals[category] > topCategoryAmount) {

        topCategoryAmount =
            categoryTotals[category];

        topCategory = category;
    }
});


let highestMonth = "—";
let highestMonthAmount = 0;

Object.keys(monthlyTotals).forEach(function (month) {

    const monthlyExpense =
        monthlyTotals[month].expenses;

    if (monthlyExpense > highestMonthAmount) {

        highestMonthAmount =
            monthlyExpense;

        highestMonth = month;
    }
});


const averageSpendingAmount =
    months.length > 0
    ? totalExpenses / months.length
    : 0;
// Update Spending Metrics

if (topSpendingCategory) {

    topSpendingCategory.textContent =
        topCategory === "—"
        ? "—"
        : topCategory.charAt(0).toUpperCase() +
          topCategory.slice(1);

}

if (highestSpendingMonth) {

    if (highestMonth === "—") {

        highestSpendingMonth.textContent =
            "—";

    }
    else {

        const [year, monthNumber] =
            highestMonth.split("-");

        const date =
            new Date(
                Number(year),
                Number(monthNumber) - 1
            );

        highestSpendingMonth.textContent =
            date.toLocaleString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );
    }
}

if (averageMonthlySpending) {

    averageMonthlySpending.textContent =
        formatAmount(averageSpendingAmount);

}


    // ================================
    // UPDATE SUMMARY CARDS
    // ================================

    if (analyticsIncome) {

        analyticsIncome.textContent =
            formatAmount(totalIncome);

    }


    if (analyticsExpenses) {

        analyticsExpenses.textContent =
            formatAmount(totalExpenses);

    }


    if (analyticsSavings) {

        analyticsSavings.textContent =
            formatAmount(totalSavings);

    }


    if (savingsRate) {

        savingsRate.textContent =
            `${rate.toFixed(1)}%`;

    }


    // ================================
    // UPDATE INCOME VS EXPENSES
    // ================================

    if (incomeExpenseChart) {

        incomeExpenseChart.data.datasets[0].data = [
            totalIncome,
            totalExpenses
        ];

        incomeExpenseChart.update();

    }


    // ================================
    // UPDATE CATEGORY CHART
    // ================================

    if (categoryChart) {

        categoryChart.data.labels =
            Object.keys(categoryTotals);

        categoryChart.data.datasets[0].data =
            Object.values(categoryTotals);

        categoryChart.update();

    }


    // ================================
    // UPDATE MONTHLY TREND
    // ================================

    const monthLabels =
        months.map(
            function (month) {

                const [
                    year,
                    monthNumber
                ] = month.split("-");

                const date =
                    new Date(
                        Number(year),
                        Number(monthNumber) - 1
                    );

                return date.toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        year: "numeric"
                    }
                );

            }
        );


    const incomeData =
        months.map(
            function (month) {

                return monthlyTotals[month].income;

            }
        );


    const expenseData =
        months.map(
            function (month) {

                return monthlyTotals[month].expenses;

            }
        );


    if (monthlyTrendChart) {

        monthlyTrendChart.data.labels =
            monthLabels;

        monthlyTrendChart.data.datasets[0].data =
            incomeData;

        monthlyTrendChart.data.datasets[1].data =
            expenseData;

        monthlyTrendChart.update();

    }

    updateAnalyticsBudgetVsActual(
    months,
    totalExpenses
    );

    updateFinancialInsights(
    categoryTotals,
    totalIncome,
    totalExpenses,
    previousExpenses
    );

}

// ================================
// ANALYTICS PERIOD CHANGE
// ================================

const customDateRange =
    document.getElementById("customDateRange");

if (analyticsPeriod) {

    analyticsPeriod.addEventListener(
        "change",
        function () {

            if (customDateRange) {

                customDateRange.style.display =
                    analyticsPeriod.value === "custom"
                    ? "flex"
                    : "none";

            }

            renderAnalyticsForPeriod();

        }
    );

}

if (analyticsStartDate) {

    analyticsStartDate.addEventListener(
        "change",
        function () {

            if (analyticsPeriod.value === "custom") {
                renderAnalyticsForPeriod();
            }

        }
    );

}

if (analyticsEndDate) {

    analyticsEndDate.addEventListener(
        "change",
        function () {

            if (analyticsPeriod.value === "custom") {
                renderAnalyticsForPeriod();
            }

        }
    );

}


// ================================
// CALCULATE TOTALS
// ================================

function calculateTotals() {

    let totalIncome = 0;
    let totalExpenses = 0;

    let categoryTotals = {};
    let currentMonthCategoryTotals = {};
    let monthlyTotals = {};

    // Reset first
    currentMonthSpent = 0;

    const currentDate = new Date();

    const currentMonth =
        `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
        ).padStart(2, "0")}`;


    transactions.forEach(function (transaction) {

        const amount =
            Number(transaction.amount) || 0;


        // ================================
        // INCOME
        // ================================

        if (transaction.type === "income") {

            totalIncome += amount;

        }

        // ================================
        // EXPENSE
        // ================================

        else {

            totalExpenses += amount;

            if (
                categoryTotals[
                    transaction.category
                ]
            ) {

                categoryTotals[
                    transaction.category
                ] += amount;

            } else {

                categoryTotals[
                    transaction.category
                ] = amount;

            }


            // Current month spending

            if (
                transaction.date &&
                transaction.date.startsWith(
                    currentMonth
                )
            ) {

                currentMonthSpent += amount;
                if (currentMonthCategoryTotals[transaction.category]) {

                    currentMonthCategoryTotals[transaction.category] += amount;

                } else {

                currentMonthCategoryTotals[ transaction.category] = amount;

            }

            }

        }


        // ================================
        // MONTHLY TOTALS
        // ================================

        if (transaction.date) {

            const month =
                transaction.date.substring(0, 7);

            if (!monthlyTotals[month]) {

                monthlyTotals[month] = {
                    income: 0,
                    expenses: 0
                };

            }

            if (
                transaction.type === "income"
            ) {

                monthlyTotals[month].income += amount;

            } else {

                monthlyTotals[month].expenses += amount;

            }

        }

    });


    const totalBalance =
        totalIncome - totalExpenses;


    // ================================
    // BUDGET SPENT
    // ================================

    if (budgetSpent) {

        budgetSpent.textContent =
            formatAmount(currentMonthSpent);

    }


    // ================================
    // CATEGORY CHART
    // ================================

    if (categoryChart) {

        categoryChart.data.labels =
            Object.keys(categoryTotals);

        categoryChart.data.datasets[0].data =
            Object.values(categoryTotals);

        categoryChart.update();

    }

    // ================================
// DASHBOARD SPENDING OVERVIEW
// ================================

if (dashboardCategoryChart) {

    const dashboardLabels =
        Object.keys(
            currentMonthCategoryTotals
        );

    const dashboardValues =
        Object.values(
            currentMonthCategoryTotals
        );

    dashboardCategoryChart.data.labels =
        dashboardLabels;

    dashboardCategoryChart.data.datasets[0].data =
        dashboardValues;

    dashboardCategoryChart.update();


    const emptyState =
        document.getElementById(
            "spendingOverviewEmpty"
        );

    if (emptyState) {

        if (dashboardLabels.length === 0) {

            emptyState.style.display = "flex";

        } else {

            emptyState.style.display = "none";

        }

    }

}


    // ================================
    // MONTHLY TREND
    // ================================

    const existingMonths =
        Object.keys(monthlyTotals).sort();

    if (existingMonths.length > 0) {

        const startDate =
            new Date(
                existingMonths[0] + "-01"
            );

        const endDate =
            new Date(
                existingMonths[
                    existingMonths.length - 1
                ] + "-01"
            );

        let datePointer =
            new Date(startDate);

        while (datePointer <= endDate) {

            const year =
                datePointer.getFullYear();

            const monthNumber =
                String(
                    datePointer.getMonth() + 1
                ).padStart(2, "0");

            const monthKey =
                `${year}-${monthNumber}`;

            if (!monthlyTotals[monthKey]) {

                monthlyTotals[monthKey] = {
                    income: 0,
                    expenses: 0
                };

            }

            datePointer.setMonth(
                datePointer.getMonth() + 1
            );

        }

    }


    const months =
        Object.keys(monthlyTotals).sort();


    const monthLabels =
        months.map(function (month) {

            const [
                year,
                monthNumber
            ] = month.split("-");

            const date =
                new Date(
                    Number(year),
                    Number(monthNumber) - 1
                );

            return date.toLocaleString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );

        });


    const incomeData =
        months.map(function (month) {

            return monthlyTotals[month].income;

        });


    const expenseData =
        months.map(function (month) {

            return monthlyTotals[month].expenses;

        });


    if (monthlyTrendChart) {

        monthlyTrendChart.data.labels =
            monthLabels;

        monthlyTrendChart.data.datasets[0].data =
            incomeData;

        monthlyTrendChart.data.datasets[1].data =
            expenseData;

        monthlyTrendChart.update();

    }


    // ================================
    // SAVINGS
    // ================================

    const totalSavings =
        totalBalance;


    analyticsIncome.textContent =
        formatAmount(totalIncome);

    analyticsExpenses.textContent =
        formatAmount(totalExpenses);

    analyticsSavings.textContent =
        formatAmount(totalSavings);


    const rate =
        totalIncome > 0
        ? (totalSavings / totalIncome) * 100
        : 0;


    savingsRate.textContent =
        `${rate.toFixed(1)}%`;


    // ================================
    // INCOME VS EXPENSE CHART
    // ================================

    if (incomeExpenseChart) {

        incomeExpenseChart.data.datasets[0].data = [
            totalIncome,
            totalExpenses
        ];

        incomeExpenseChart.update();

    }


    // ================================
    // DASHBOARD CARDS
    // ================================

    incomeAmount.textContent =
        formatAmount(totalIncome);

    expenseAmount.textContent =
        formatAmount(totalExpenses);

    balanceAmount.textContent =
        formatAmount(totalBalance);

    savingsAmount.textContent =
        formatAmount(totalSavings);


    // ================================
    // UPDATE BUDGET UI
    // ================================

    updateBudgetProgress();

    // ================================
    // UPDATE ANALYTICS
    // ================================

    renderAnalyticsForPeriod();


}


// ================================
// LOAD TRANSACTIONS
// ================================

async function loadTransactions() {

    try {

        const token = localStorage.getItem("financeflowToken");

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        // Check if authentication token has expired
if (response.status === 401) {

    handleSessionExpiration();

    return;
}

if (!response.ok) {
    throw new Error(
        "Failed to fetch transactions"
    );
}

        transactions = await response.json();

        renderTransactions();
        renderTransactionsPage();
        calculateTotals();

    } catch (error) {

        console.error(
            "Error loading transactions:",
            error
        );

    }

}


// ================================
// LOAD MONTHLY BUDGET
// ================================

async function loadBudget() {

    const currentDate = new Date();

    const month =
        `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
        ).padStart(2, "0")}`;

    try {

        const token =
            localStorage.getItem("financeflowToken");

        const response = await fetch(
            `http://localhost:5000/api/budgets/${month}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        // Check if authentication token has expired
if (response.status === 401) {

    handleSessionExpiration();

    return;
}

if (!response.ok) {
    throw new Error(
        "Failed to fetch budget"
    );
}
        const data = await response.json();

        console.log(
            "Budget loaded:",
            data
        );

        if (budgetAmount) {
            budgetAmount.textContent =
                formatAmount(data.amount);
        }

        updateBudgetProgress(data.amount);

    } catch (error) {

        console.error(
            "Error loading budget:",
            error
        );

        if (budgetAmount) {
            budgetAmount.textContent =
                formatAmount(0);
        }

        updateBudgetProgress(0);

    }

}


// ================================
// UPDATE BUDGET PROGRESS
// ================================

function updateBudgetProgress(
    budget = null
) {

    if (!budgetAmount ||
        !budgetSpent ||
        !budgetRemaining) {

        return;

    }

    let budgetValue;

    if (budget !== null) {

        budgetValue =
            Number(budget);

    } else {

        const text =
            budgetAmount.textContent
                .replace(/[^\d.-]/g, "");

        budgetValue =
            Number(text) || 0;

    }

    const spent =
        Number(currentMonthSpent) || 0;

    const remaining =
        budgetValue - spent;

    const percentage =
        budgetValue > 0
        ? Math.min(
            (spent / budgetValue) * 100,
            100
        )
        : 0;


    budgetSpent.textContent =
        formatAmount(spent);

    budgetRemaining.textContent =
        formatAmount(
            Math.max(remaining, 0)
        );


    if (budgetProgress) {

        budgetProgress.style.width =
            `${percentage}%`;

    }


    if (budgetPercentage) {

        budgetPercentage.textContent =
            `${percentage.toFixed(0)}%`;

    }

}


// ================================
// TRANSACTION FILTER
// ================================

function filterTransactions() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        typeFilter.value;

    const selectedCategory =
        categoryFilter.value;


    const filteredTransactions =
        transactions.filter(
            function (transaction) {

                const title =
                    transaction.title || "";

                const category =
                    transaction.category || "";

                const description =
                    transaction.description || "";


                const matchesSearch =
                    title
                        .toLowerCase()
                        .includes(searchText)
                    ||
                    category
                        .toLowerCase()
                        .includes(searchText)
                    ||
                    description
                        .toLowerCase()
                        .includes(searchText);


                const matchesType =
                    selectedType === "all"
                    ||
                    transaction.type ===
                    selectedType;


                const matchesCategory =
                    selectedCategory === "all"
                    ||
                    transaction.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesCategory
                );

            }
        );


    renderTransactions(
        filteredTransactions
    );

}


// ================================
// TRANSACTION PAGE FILTER
// ================================

const transactionsSearchInput =
    document.getElementById(
        "transactionsSearchInput"
    );

const transactionsTypeFilter =
    document.getElementById(
        "transactionsTypeFilter"
    );

const transactionsCategoryFilter =
    document.getElementById(
        "transactionsCategoryFilter"
    );

const exportCsvBtn =
    document.getElementById("exportCsvBtn");

const importCsvBtn =
    document.getElementById("importCsvBtn");

const csvFileInput =
    document.createElement("input");

csvFileInput.type = "file";
csvFileInput.accept = ".csv,text/csv";
csvFileInput.style.display = "none";

document.body.appendChild(csvFileInput);

importCsvBtn.addEventListener(
    "click",
    function () {
        csvFileInput.click();
    }
);

csvFileInput.addEventListener(
    "change",
    function () {

        const file = csvFileInput.files[0];

        if (!file) {
            return;
        }

        if (!file.name.toLowerCase().endsWith(".csv")) {
            alert("Please select a CSV file.");
            csvFileInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = async function (event) {

    const csvText = event.target.result.trim();

    if (!csvText) {
        alert("CSV file is empty.");
        return;
    }

    const lines = csvText.split(/\r?\n/);

    if (lines.length < 2) {
        alert("CSV file does not contain any transactions.");
        return;
    }

    const headers = lines[0]
        .split(",")
        .map(function(header) {
            return header
                .trim()
                .replace(/^"|"$/g, "");
        });

    const requiredHeaders = [
        "Title",
        "Amount",
        "Type",
        "Category",
        "Date",
        "Description"
    ];

    const hasValidHeaders =
        requiredHeaders.every(function(header) {
            return headers.includes(header);
        });

    if (!hasValidHeaders) {
        alert(
            "Invalid CSV format. Please use a FinanceFlow transaction CSV file."
        );
        return;
    }

    console.log("CSV headers are valid.");
    console.log(headers);

    // ================================
// PARSE & VALIDATE CSV ROWS
// ================================

const dataLines = lines.slice(1);

const importedTransactions = [];
const invalidRows = [];

dataLines.forEach(function(line, index) {

    if (!line.trim()) {
        return;
    }

    // Handle CSV values wrapped in quotes
    const values =
        line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
            ?.map(function(value) {
                return value
                    .trim()
                    .replace(/^"|"$/g, "")
                    .replace(/""/g, '"');
            }) || [];

    if (values.length !== 6) {
        invalidRows.push(index + 2);
        return;
    }

    const title = values[0].trim();
    const amount = Number(values[1]);
    const type = values[2].trim().toLowerCase();
    const category = values[3].trim();
    const date = values[4].trim();
    const description = values[5].trim();

    const isValid =
        title &&
        Number.isFinite(amount) &&
        amount > 0 &&
        (type === "income" || type === "expense") &&
        category &&
        date;

    if (!isValid) {
        invalidRows.push(index + 2);
        return;
    }

    importedTransactions.push({
        title: title,
        amount: amount,
        type: type,
        category: category,
        date: date,
        description: description
    });

});

console.log(
    "Valid transactions:",
    importedTransactions
);

console.log(
    "Invalid rows:",
    invalidRows
);

if (importedTransactions.length === 0) {

    alert(
        "No valid transactions found in the CSV file."
    );

    return;
}

// ================================
// IMPORT TRANSACTIONS TO DATABASE
// ================================

let importedCount = 0;
let failedCount = 0;
let duplicateCount = 0;


// ================================
// CREATE TRANSACTION SIGNATURE
// ================================

function getTransactionSignature(transaction) {

    return [
        transaction.title || "",
        Number(transaction.amount) || 0,
        transaction.type || "",
        transaction.category || "",
        transaction.date || "",
        transaction.description || ""
    ]
        .map(function(value) {
            return String(value)
                .trim()
                .toLowerCase();
        })
        .join("|");
}


// ================================
// EXISTING TRANSACTIONS
// ================================

const existingTransactionSignatures =
    new Set(
        transactions.map(function(transaction) {
            return getTransactionSignature(transaction);
        })
    );


// ================================
// IMPORT TRANSACTIONS
// ================================

for (const transaction of importedTransactions) {

    const signature =
        getTransactionSignature(transaction);


    // Duplicate check
    if (existingTransactionSignatures.has(signature)) {

        duplicateCount++;

        continue;
    }


    try {

        const response = await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
    },
    body: JSON.stringify(transaction)
    });


        if (!response.ok) {
            throw new Error(
                "Failed to import transaction"
            );
        }


        const data = await response.json();

        importedCount++;


        // Add newly imported transaction
        // to the Set so duplicates inside
        // the same CSV are also prevented.

        existingTransactionSignatures.add(
            getTransactionSignature(data.transaction)
        );


    } catch (error) {

        console.error(
            "Failed to import transaction:",
            transaction,
            error
        );

        failedCount++;
    }
}
 
// ================================
// REFRESH TRANSACTIONS
// ================================

await loadTransactions();

renderTransactions();

calculateTotals();


// ================================
// IMPORT RESULT
// ================================
    let importMessage =
    `${importedCount} transaction(s) imported successfully.`;

if (duplicateCount > 0) {

    importMessage +=
        `\n${duplicateCount} duplicate transaction(s) skipped.`;
}

if (failedCount > 0) {

    importMessage +=
        `\n${failedCount} transaction(s) failed to import.`;
}

alert(importMessage);


    };

        reader.onerror = function () {

            alert(
                "Failed to read CSV file."
            );

        };

        reader.readAsText(file);

        csvFileInput.value = "";

    }
);


function filterTransactionsPage() {

    const searchText =
        transactionsSearchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        transactionsTypeFilter.value;

    const selectedCategory =
        transactionsCategoryFilter.value;


    const filteredTransactions =
        transactions.filter(
            function (transaction) {

                const title =
                    transaction.title || "";

                const category =
                    transaction.category || "";

                const description =
                    transaction.description || "";


                const matchesSearch =
                    title
                        .toLowerCase()
                        .includes(searchText)
                    ||
                    category
                        .toLowerCase()
                        .includes(searchText)
                    ||
                    description
                        .toLowerCase()
                        .includes(searchText);


                const matchesType =
                    selectedType === "all"
                    ||
                    transaction.type ===
                    selectedType;


                const matchesCategory =
                    selectedCategory === "all"
                    ||
                    transaction.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesCategory
                );

            }
        );


    renderTransactionsPage(
        filteredTransactions
    );

}


// ================================
// EXPORT FILTERED TRANSACTIONS TO CSV
// ================================

function exportTransactionsToCSV() {

    const searchText =
        transactionsSearchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        transactionsTypeFilter.value;

    const selectedCategory =
        transactionsCategoryFilter.value;


    // Apply current Transactions page filters

    const filteredTransactions =
        transactions.filter(function(transaction) {

            const title =
                transaction.title || "";

            const category =
                transaction.category || "";

            const description =
                transaction.description || "";


            const matchesSearch =
                title
                    .toLowerCase()
                    .includes(searchText) ||

                category
                    .toLowerCase()
                    .includes(searchText) ||

                description
                    .toLowerCase()
                    .includes(searchText);


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );

        });


    // No matching transactions

    if (filteredTransactions.length === 0) {

        alert(
            "No transactions found for the selected filters."
        );

        return;
    }


    const headers = [
        "Title",
        "Amount",
        "Type",
        "Category",
        "Date",
        "Description"
    ];


    const rows =
        filteredTransactions.map(function(transaction) {

            return [
                transaction.title || "",
                transaction.amount || 0,
                transaction.type || "",
                transaction.category || "",
                transaction.date || "",
                transaction.description || ""
            ];

        });


    const csvContent = [
        headers,
        ...rows
    ]
        .map(function(row) {

            return row
                .map(function(value) {

                    const text =
                        String(value)
                            .replace(/"/g, '""');

                    return `"${text}"`;

                })
                .join(",");

        })
        .join("\n");


    const csvBlob =
        new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const downloadUrl =
        URL.createObjectURL(csvBlob);


    const downloadLink =
        document.createElement("a");


    downloadLink.href =
        downloadUrl;

    downloadLink.download =
        "FinanceFlow_Transactions.csv";


    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();

    document.body.removeChild(
        downloadLink
    );


    URL.revokeObjectURL(
        downloadUrl
    );
}


exportCsvBtn.addEventListener(
    "click",
    exportTransactionsToCSV
);


// ================================
// FILTER EVENTS
// ================================

searchInput.addEventListener(
    "input",
    filterTransactions
);

typeFilter.addEventListener(
    "change",
    filterTransactions
);

categoryFilter.addEventListener(
    "change",
    filterTransactions
);


transactionsSearchInput.addEventListener(
    "input",
    filterTransactionsPage
);

transactionsTypeFilter.addEventListener(
    "change",
    filterTransactionsPage
);

transactionsCategoryFilter.addEventListener(
    "change",
    filterTransactionsPage
);


// ================================
// GOALS
// ================================

let editingGoalId = null;


// ================================
// OPEN GOAL MODAL
// ================================

function openGoalModal() {

    if (goalModal) {

        goalModal.style.display =
            "flex";

    }

}


// ================================
// CLOSE GOAL MODAL
// ================================

function closeGoalModal() {

    if (goalModal) {

        goalModal.style.display =
            "none";

    }

    editingGoalId = null;

}


// ================================
// ADD GOAL BUTTON
// ================================

if (addGoalBtn) {

    addGoalBtn.addEventListener(
        "click",
        function () {

            editingGoalId = null;

            goalForm.reset();

            const goalSubmitBtn =
                goalForm.querySelector(
                    'button[type="submit"]'
                );

            if (goalSubmitBtn) {

                goalSubmitBtn.textContent =
                    "Add Goal";

            }

            openGoalModal();

        }
    );

}


// ================================
// CLOSE GOAL MODAL BUTTONS
// ================================

if (closeGoalModalBtn) {

    closeGoalModalBtn.addEventListener(
        "click",
        closeGoalModal
    );

}

if (cancelGoalBtn) {

    cancelGoalBtn.addEventListener(
        "click",
        closeGoalModal
    );

}


// ================================
// SAVE / UPDATE GOAL
// ================================

if (goalForm) {

    goalForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "goalName"
                ).value.trim();

            const targetAmount =
                Number(
                    document.getElementById(
                        "goalTargetAmount"
                    ).value
                );

            const targetDate =
                document.getElementById(
                    "goalTargetDate"
                ).value;

            const descriptionElement =
                document.getElementById(
                    "goalDescription"
                );

            const description =
                descriptionElement
                ? descriptionElement.value.trim()
                : "";


            if (
                !name ||
                targetAmount <= 0 ||
                !targetDate
            ) {

                alert(
                    "Please enter valid goal details."
                );

                return;

            }


            const goalData = {

                name: name,

                targetAmount:
                    targetAmount,

                targetDate:
                    targetDate,

                description:
                    description

            };


            try {

                let response;


                // ================================
                // UPDATE
                // ================================

                if (editingGoalId) {

                    response =
                        await fetch(
                            `${GOALS_API_URL}/${editingGoalId}`,
                            {

                                method: "PUT",

                                headers: {
                                    "Content-Type": "application/json",
                                         "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
                                    },
                                body:
                                    JSON.stringify(
                                        goalData
                                    )

                            }
                        );

                }


                // ================================
                // CREATE
                // ================================

                else {

                    response =
                        await fetch(
                            GOALS_API_URL,
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type": "application/json",
                                     "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
                                },

                                body:
                                    JSON.stringify({
                                        ...goalData,
                                        savedAmount: 0
                                    })

                            }
                        );

                }


                if (!response.ok) {

                    throw new Error(
                        "Failed to save goal"
                    );

                }


                const data =
                    await response.json();

                console.log(
                    "Goal saved:",
                    data
                );


                alert(
                    editingGoalId
                    ? "Goal updated successfully!"
                    : "Goal added successfully!"
                );


                closeGoalModal();

                goalForm.reset();

                await loadGoals();

            } catch (error) {

                console.error(
                    "Error saving goal:",
                    error
                );

                alert(
                    "Failed to save goal."
                );

            }

        }
    );

}


// ================================
// LOAD GOALS
// ================================

async function loadGoals() {

    try {

        const token =
    localStorage.getItem("financeflowToken");

const response = await fetch(
    GOALS_API_URL,
    {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    );
        // Check if authentication token has expired
if (response.status === 401) {

    handleSessionExpiration();

    return;
}

if (!response.ok) {

    throw new Error(
        "Failed to fetch goals"
    );

}

        const goals =
            await response.json();

        console.log(
            "Goals loaded:",
            goals
        );


        if (!goalsList) {
            return;
        }


        goalsList.innerHTML = "";


        if (goals.length === 0) {

            goalsList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🎯
                    </div>

                    <h3>
                        No goals yet
                    </h3>

                    <p>
                        Add a financial goal
                        to start saving.
                    </p>

                </div>

            `;

            return;

        }


        goals.forEach(
            function (goal) {

                const targetAmount =
                    Number(
                        goal.targetAmount
                    ) || 0;

                const savedAmount =
                    Number(
                        goal.savedAmount
                    ) || 0;


                const progress =
                    targetAmount > 0
                    ? Math.min(
                        (
                            savedAmount /
                            targetAmount
                        ) * 100,
                        100
                    )
                    : 0;


                const goalCard =
                    document.createElement(
                        "div"
                    );

                goalCard.classList.add(
                    "goal-card"
                );


                goalCard.innerHTML = `

                    <div class="goal-card-header">

                        <div>

                            <h3>
                                ${goal.name}
                            </h3>

                            <p>
                                Target date:
                                ${goal.targetDate}
                            </p>

                        </div>

                        <div class="goal-percentage">

                            ${progress.toFixed(0)}%

                        </div>

                    </div>


                    <div class="goal-amounts">

                        <div>

                            <span>
                                Saved
                            </span>

                            <strong>
                                ${formatAmount(
                                    savedAmount
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Target
                            </span>

                            <strong>
                                ${formatAmount(
                                    targetAmount
                                )}
                            </strong>

                        </div>

                    </div>


                    <div class="goal-progress-container">

                        <div class="goal-progress-bar">

                            <div
                                class="goal-progress"
                                style="
                                    width: ${progress}%;
                                "
                            ></div>

                        </div>

                    </div>


                    ${
                        goal.description
                        ? `
                            <p class="goal-description">
                                ${goal.description}
                            </p>
                        `
                        : ""
                    }


                    <div class="goal-actions">

                        <button
                            class="add-money-btn"
                        >
                            Add Money
                        </button>

                        <button
                            class="edit-goal-btn"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-goal-btn"
                        >
                            Delete
                        </button>

                    </div>

                `;


                goalsList.appendChild(
                    goalCard
                );


                // ================================
                // ADD MONEY
                // ================================

                const addMoneyBtn =
                    goalCard.querySelector(
                        ".add-money-btn"
                    );


                addMoneyBtn.addEventListener(
                    "click",
                    async function () {

                        const amount =
                            prompt(
                                "Enter amount to add:"
                            );


                        if (
                            amount === null
                        ) {

                            return;

                        }


                        const money =
                            Number(amount);


                        if (
                            !money ||
                            money <= 0
                        ) {

                            alert(
                                "Please enter a valid amount."
                            );

                            return;

                        }


                        try {

                            const response =
                                await fetch(
                                    `${GOALS_API_URL}/${goal._id}/add-money`,
                                    {

                                        method: "PUT",

                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
                                        },

                                        body:
                                            JSON.stringify({
                                                amount:
                                                    money
                                            })

                                    }
                                );


                            if (response.status === 401) {
                                handleSessionExpiration();
                                return;
                            }

                            if (!response.ok) {
                                throw new Error("Failed to add money");
                            }


                            const data =
                                await response.json();


                            console.log(
                                "Money added:",
                                data
                            );


                            alert(
                                "Money added successfully!"
                            );


                            await loadGoals();

                        } catch (error) {

                            console.error(
                                "Error adding money:",
                                error
                            );

                            alert(
                                "Failed to add money."
                            );

                        }

                    }
                );


                // ================================
                // EDIT GOAL
                // ================================

                const editGoalBtn =
                    goalCard.querySelector(
                        ".edit-goal-btn"
                    );


                editGoalBtn.addEventListener(
                    "click",
                    function () {

                        editingGoalId =
                            goal._id;


                        document.getElementById(
                            "goalName"
                        ).value =
                            goal.name;


                        document.getElementById(
                            "goalTargetAmount"
                        ).value =
                            goal.targetAmount;


                        document.getElementById(
                            "goalTargetDate"
                        ).value =
                            goal.targetDate;


                        const descriptionElement =
                            document.getElementById(
                                "goalDescription"
                            );


                        if (
                            descriptionElement
                        ) {

                            descriptionElement.value =
                                goal.description ||
                                "";

                        }


                        const goalSubmitBtn =
                            goalForm.querySelector(
                                'button[type="submit"]'
                            );


                        if (goalSubmitBtn) {

                            goalSubmitBtn.textContent =
                                "Save Changes";

                        }


                        openGoalModal();

                    }
                );


                // ================================
                // DELETE GOAL
                // ================================

                const deleteGoalBtn =
                    goalCard.querySelector(
                        ".delete-goal-btn"
                    );


                deleteGoalBtn.addEventListener(
                    "click",
                    async function () {

                        const confirmDelete =
                            confirm(
                                "Are you sure you want to delete this goal?"
                            );


                        if (!confirmDelete) {

                            return;

                        }


                        try {

                            const response =
    await fetch(
        `${GOALS_API_URL}/${goal._id}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
            }
        }
    );


                            if (response.status === 401) {
                                handleSessionExpiration();
                                return;
                            }

                            if (!response.ok) {
                                throw new Error("Failed to delete goal");
                            }


                            await loadGoals();

                        } catch (error) {

                            console.error(
                                "Error deleting goal:",
                                error
                            );

                            alert(
                                "Failed to delete goal."
                            );

                        }

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Error loading goals:",
            error
        );

    }

}


// ================================
// CLEAR ALL TRANSACTIONS
// ================================

clearTransactionsBtn.addEventListener(
    "click",
    async function () {

        const confirmClear =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (!confirmClear) {
            return;
        }


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete all transactions"
                );

            }


            transactions = [];

            renderTransactions();

            renderTransactionsPage();

            calculateTotals();

        } catch (error) {

            console.error(
                "Error deleting all transactions:",
                error
            );

        }

    }
);


function updateAnalyticsChartTheme() {
    const isDarkMode =
        document.body.classList.contains("dark-mode");

    const textColor = isDarkMode
        ? "#9ca3af"
        : "#4b5563";

    const gridColor = isDarkMode
        ? "#374151"
        : "#e5e7eb";


    /* Income vs Expenses */
    if (incomeExpenseChart) {
        incomeExpenseChart.options.scales.x.ticks.color = textColor;
        incomeExpenseChart.options.scales.y.ticks.color = textColor;
        incomeExpenseChart.options.scales.y.grid.color = gridColor;

        incomeExpenseChart.update();
    }


    /* Monthly Financial Trend */
    if (monthlyTrendChart) {
        monthlyTrendChart.options.scales.x.ticks.color = textColor;
        monthlyTrendChart.options.scales.y.ticks.color = textColor;

        monthlyTrendChart.options.scales.x.grid.color = gridColor;
        monthlyTrendChart.options.scales.y.grid.color = gridColor;

        monthlyTrendChart.options.plugins.legend.labels.color =
            textColor;

        monthlyTrendChart.update();
    }


    /* Expenses by Category */
    if (categoryChart) {
        categoryChart.options.plugins.legend.labels.color =
            textColor;

        categoryChart.update();
    }
}


// ================================
// THEME
// ================================

function updateThemeUI() {

    const isDarkMode =
        document.body.classList.contains(
            "dark-mode"
        );


    if (isDarkMode) {

        themeToggle.textContent =
            "☀️ Light Mode";

        themeBtn.textContent =
            "☀️";

    } else {

        themeToggle.textContent =
            "🌙 Dark Mode";

        themeBtn.textContent =
            "🌙";

    }

}


function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const isDarkMode =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        "theme",
        isDarkMode
        ? "dark"
        : "light"
    );


    updateThemeUI();
    updateAnalyticsChartTheme();

}


themeToggle.addEventListener(
    "click",
    toggleTheme
);

themeBtn.addEventListener(
    "click",
    toggleTheme
);


const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

}


updateThemeUI();


// ================================
// CURRENCY
// ================================

currencySelect.value =
    selectedCurrency;


currencySelect.addEventListener(
    "change",
    function () {

        selectedCurrency =
            currencySelect.value;

        localStorage.setItem(
            "currency",
            selectedCurrency
        );

        renderTransactions();

        renderTransactionsPage();

        calculateTotals();

        loadBudget();

        loadGoals();

    }
);


// ================================
// NAVIGATION
// ================================

function showSection(
    section,
    activeLink
) {

    dashboardSection.style.display =
        "none";

    transactionsSection.style.display =
        "none";

    analyticsSection.style.display =
        "none";

    settingsSection.style.display =
        "none";


    section.style.display =
        "block";


    dashboardLink.classList.remove(
        "active"
    );

    transactionsLink.classList.remove(
        "active"
    );

    analyticsLink.classList.remove(
        "active"
    );

    settingsLink.classList.remove(
        "active"
    );


    activeLink.classList.add(
        "active"
    );

}


dashboardLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSection(
            dashboardSection,
            dashboardLink
        );

    }
);


transactionsLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSection(
            transactionsSection,
            transactionsLink
        );

        renderTransactionsPage();

    }
);


analyticsLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSection(
            analyticsSection,
            analyticsLink
        );

    }
);


settingsLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSection(
            settingsSection,
            settingsLink
        );

    }
);


// ================================
// INITIAL LOAD
// ================================

showSection(
    dashboardSection,
    dashboardLink
);

loadTransactions();

loadBudget();

loadGoals();

// =================================
// AUTHENTICATION FORM SWITCHING
// =================================

document.body.classList.add("auth-active");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// ================================
// HANDLE EXPIRED SESSION
// ================================

function handleSessionExpiration() {

    // Remove authentication data
    localStorage.removeItem("financeflowToken");
    localStorage.removeItem("financeflowUser");

    // Show authentication screen
    document.body.classList.add("auth-active");

    // Show login form
    registerForm.style.display = "none";
    loginForm.style.display = "block";

    // Display expiration message
    const authMessage =
        document.getElementById("authMessage");

    authMessage.textContent =
        "Your session has expired. Please log in again.";

    authMessage.style.color = "red";

}

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

// Open Register Form
showRegister.addEventListener("click", function (e) {
    e.preventDefault();

    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

// Open Login Form
showLogin.addEventListener("click", function (e) {
    e.preventDefault();

    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

// =================================
// USER REGISTRATION
// =================================

registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const authMessage = document.getElementById("authMessage");

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        authMessage.textContent = "Account created successfully! Please login.";
        authMessage.style.color = "green";

        // Switch to Login Form
        registerForm.style.display = "none";
        loginForm.style.display = "block";

        // Automatically fill registered email
        document.getElementById("loginEmail").value = email;

        registerForm.reset();

    } catch (error) {

        authMessage.textContent = error.message;
        authMessage.style.color = "red";

    }
});

// =================================
// USER LOGOUT
// =================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
        return;
    }

    // Remove authentication data
    localStorage.removeItem("financeflowToken");
    localStorage.removeItem("financeflowUser");

    // Hide dashboard and show login screen
    document.body.classList.add("auth-active");

    // Show Login Form
    registerForm.style.display = "none";
    loginForm.style.display = "block";

    // Clear login form
    loginForm.reset();

    // Clear authentication message
    document.getElementById("authMessage").textContent = "";

});

// =================================
// USER LOGIN
// =================================

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const authMessage = document.getElementById("authMessage");

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Store authentication token
        localStorage.setItem("financeflowToken", data.token);

        // Store user details
        localStorage.setItem(
            "financeflowUser",
            JSON.stringify(data.user)
        );

        // Update dashboard welcome message
        const welcomeMessage = document.getElementById("welcomeMessage");

        welcomeMessage.textContent =
        `Good Morning, ${data.user.name}! 👋`;

        authMessage.textContent = "Login successful!";
        authMessage.style.color = "green";

        // Hide authentication screen
        document.body.classList.remove("auth-active");

        loginForm.reset();

        // Load dashboard data
        loadTransactions();
        loadBudget();
        loadGoals();

    } catch (error) {

        authMessage.textContent = error.message;
        authMessage.style.color = "red";

    }
});

// =================================
// RESTORE USER SESSION
// =================================

async function checkAuthSession() {

    const token = localStorage.getItem("financeflowToken");

    // If no token exists, show login screen
    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/me",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Session expired");
        }

        // Valid session: open dashboard
        document.body.classList.remove("auth-active");

        // Restore user's name after refresh
        const savedUser = JSON.parse(
        localStorage.getItem("financeflowUser") || "null"
        );

        const welcomeMessage =
        document.getElementById("welcomeMessage");

        if (savedUser && savedUser.name) {
        welcomeMessage.textContent =
        `Good Morning, ${savedUser.name}! 👋`;
        }

        // Load dashboard data
        loadTransactions();
        loadBudget();
        loadGoals();

    } catch (error) {

        // Invalid or expired token
        localStorage.removeItem("financeflowToken");
        localStorage.removeItem("financeflowUser");

        document.body.classList.add("auth-active");

        loginForm.style.display = "block";
        registerForm.style.display = "none";

    }
}

// Check session when page loads
checkAuthSession();