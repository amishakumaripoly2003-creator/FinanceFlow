// ================================
// RECURRING TRANSACTIONS
// ================================

const RECURRING_API_URL =
    "http://localhost:5000/api/recurring-transactions";

    let editingRecurringTransactionId = null;


// ================================
// ELEMENTS
// ================================

const recurringModal =
    document.getElementById("recurringModal");

const addRecurringBtn =
    document.getElementById("addRecurringBtn");

const closeRecurringModalBtn =
    document.getElementById(
        "closeRecurringModalBtn"
    );

const cancelRecurringBtn =
    document.getElementById(
        "cancelRecurringBtn"
    );

const recurringForm =
    document.getElementById("recurringForm");

const recurringTransactionsList =
    document.getElementById(
        "recurringTransactionsList"
    );


// ================================
// OPEN MODAL
// ================================

if (addRecurringBtn) {

    addRecurringBtn.addEventListener(
        "click",
        function () {

            recurringModal.classList.add("active");

        }
    );

}


// ================================
// CLOSE MODAL
// ================================

function closeRecurringModal() {

    if (recurringModal) {

        recurringModal.classList.remove(
            "active"
        );

    }

}


if (closeRecurringModalBtn) {

    closeRecurringModalBtn.addEventListener(
        "click",
        closeRecurringModal
    );

}


if (cancelRecurringBtn) {

    cancelRecurringBtn.addEventListener(
        "click",
        closeRecurringModal
    );

}


// ================================
// LOAD RECURRING TRANSACTIONS
// ================================

async function loadRecurringTransactions() {

    try {

        const response =
    await fetch(
        RECURRING_API_URL,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
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
        "Failed to fetch recurring transactions"
    );

}

        const transactions =
            await response.json();

        console.log(
            "Recurring transactions loaded:",
            transactions
        );


        if (!recurringTransactionsList) {
            return;
        }


        recurringTransactionsList.innerHTML = "";


        if (transactions.length === 0) {

            recurringTransactionsList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🔄
                    </div>

                    <h3>
                        No recurring transactions
                    </h3>

                    <p>
                        Add a recurring transaction
                        to manage regular income
                        and expenses.
                    </p>

                </div>

            `;

            return;

        }


        transactions.forEach(
            function (transaction) {

                const card =
                    document.createElement(
                        "div"
                    );

                card.classList.add(
                    "goal-card"
                );


                card.innerHTML = `

                    <div class="goal-card-header">

                        <div>

                            <h3>
                                ${transaction.title}
                            </h3>

                            <p>
                                ${transaction.category}
                                •
                                ${transaction.frequency}
                            </p>

                        </div>

                        <div class="goal-percentage">

                            ${formatAmount(
                                transaction.amount
                            )}

                        </div>

                    </div>


                    <div class="goal-amounts">

                        <div>

                            <span>
                                Type
                            </span>

                            <strong>
                                ${transaction.type}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Next Date
                            </span>

                            <strong>
                                ${transaction.nextDate}
                            </strong>

                        </div>

                    </div>


                    ${
                        transaction.description
                        ? `
                            <p class="goal-description">
                                ${transaction.description}
                            </p>
                        `
                        : ""
                    }

                    <div class="recurring-actions">
                        <button class="edit-recurring-btn">
                            Edit
                        </button>

                        <button class="toggle-recurring-btn ${transaction.active ? "active" : "inactive"}">
                            ${transaction.active ? "Deactivate" : "Activate"}
                        </button>

                        <button class="delete-recurring-btn">
                            Delete
                        </button>
                    </div>

                `;

                // ================================
// EDIT RECURRING TRANSACTION
// ================================

const editRecurringBtn =
    card.querySelector(".edit-recurring-btn");


editRecurringBtn.addEventListener(
    "click",
    function () {

        editingRecurringTransactionId = transaction._id;

        // Fill existing transaction data
        document.getElementById("recurringTitle").value =
            transaction.title;

        document.getElementById("recurringAmount").value =
            transaction.amount;

        document.getElementById("recurringCategory").value =
            transaction.category;

        document.getElementById("recurringFrequency").value =
            transaction.frequency;

        document.getElementById("recurringStartDate").value =
            transaction.startDate;

        document.getElementById("recurringNextDate").value =
            transaction.nextDate;

        document.getElementById("recurringDescription").value =
            transaction.description || "";


        // Select income / expense
        const typeRadio =
            document.querySelector(
                `input[name="recurringType"][value="${transaction.type}"]`
            );

        if (typeRadio) {
            typeRadio.checked = true;
        }


        // Open modal
        recurringModal.classList.add("active");

    }
);


            const toggleBtn = card.querySelector(".toggle-recurring-btn");

toggleBtn.addEventListener("click", async function () {
    try {
        const response = await fetch(
            `${RECURRING_API_URL}/${transaction._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
                },
                body: JSON.stringify({
                    active: !transaction.active
                })
            }
        );

        if (response.status === 401) {

    handleSessionExpiration();

    return;
}

if (!response.ok) {
    throw new Error("Failed to update status");
}

        await loadRecurringTransactions();

    } catch (error) {
        console.error("Error updating recurring transaction status:", error);
        alert("Failed to update recurring transaction status");
    }
});            


                const deleteRecurringBtn =
                card.querySelector(".delete-recurring-btn");


                deleteRecurringBtn.addEventListener("click",async function () {

                    const confirmDelete = confirm( "Are you sure you want to delete this recurring transaction?");

                    if (!confirmDelete) {
                        return;
                    }


                    try {

                        const response =
                        await fetch(
                    `${RECURRING_API_URL}/${transaction._id}`,
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

    throw new Error(
        "Failed to delete recurring transaction"
    );

}


            alert(
                "Recurring transaction deleted successfully!"
            );


            await loadRecurringTransactions();


        } catch (error) {

            console.error(
                "Error deleting recurring transaction:",
                error
            );

            alert(
                "Failed to delete recurring transaction."
            );

        }

    }
);


                recurringTransactionsList.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Error loading recurring transactions:",
            error
        );

    }

}


// ================================
// ADD RECURRING TRANSACTION
// ================================

if (recurringForm) {

    recurringForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const title =
                document.getElementById(
                    "recurringTitle"
                ).value.trim();


            const amount =
                Number(
                    document.getElementById(
                        "recurringAmount"
                    ).value
                );


            const type =
                document.querySelector(
                    'input[name="recurringType"]:checked'
                ).value;


            const category =
                document.getElementById(
                    "recurringCategory"
                ).value;


            const frequency =
                document.getElementById(
                    "recurringFrequency"
                ).value;


            const startDate =
                document.getElementById(
                    "recurringStartDate"
                ).value;


            const nextDate =
                document.getElementById(
                    "recurringNextDate"
                ).value;


            const description =
                document.getElementById(
                    "recurringDescription"
                ).value.trim();


            if (
                !title ||
                !amount ||
                !category ||
                !frequency ||
                !startDate ||
                !nextDate
            ) {

                alert(
                    "Please fill all required fields."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        editingRecurringTransactionId
                            ? `${RECURRING_API_URL}/${editingRecurringTransactionId}`
                            : RECURRING_API_URL,
                        {

                            method: editingRecurringTransactionId
                                ? "PUT"
                                : "POST",

                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("financeflowToken")}`
                            },

                            body:
                                JSON.stringify({

                                    title,
                                    amount,
                                    type,
                                    category,
                                    frequency,
                                    startDate,
                                    nextDate,
                                    description

                                })

                        }
                    );


                if (response.status === 401) {

    handleSessionExpiration();

    return;
}

if (!response.ok) {

    throw new Error(
        "Failed to save recurring transaction"
    );

}


                const data =
                    await response.json();


                console.log(
                    "Recurring transaction saved:",
                    data
                );


                alert(
                    "Recurring transaction added successfully!"
                );


                recurringForm.reset();

                editingRecurringTransactionId = null;

                closeRecurringModal();

                await loadRecurringTransactions();


            } catch (error) {

                console.error(
                    "Error saving recurring transaction:",
                    error
                );

                alert(
                    "Failed to add recurring transaction."
                );

            }

        }
    );

}


// ================================
// INITIAL LOAD
// ================================

loadRecurringTransactions();