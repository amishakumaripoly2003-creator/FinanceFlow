require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const recurringTransactionRoutes =
    require("./routes/recurringTransactions");
const authRoutes = require("./routes/authRoutes");

const {
    processDueRecurringTransactions
} = recurringTransactionRoutes;

const app = express();

const PORT = 5000;


mongoose.connect("mongodb://127.0.0.1:27017/financeDB")
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });


// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);

app.use(
    "/api/recurring-transactions",
    recurringTransactionRoutes
);
app.use("/api/auth", authRoutes);



// Test Route
app.get("/", (req, res) => {
    res.send("FinanceFlow Backend is running!");
});


// Check recurring transactions when server starts
processDueRecurringTransactions()
    .then(() => {
        console.log("Initial recurring transaction check completed.");
    })
    .catch((error) => {
        console.log(
            "Initial recurring transaction check failed:",
            error.message
        );
    });
    

setInterval(async () => {

    try {

        await processDueRecurringTransactions();

        console.log("Recurring transactions checked.");

    } catch (error) {

        console.log(
            "Recurring transaction processing failed:",
            error.message
        );

    }

}, 24 * 60 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});