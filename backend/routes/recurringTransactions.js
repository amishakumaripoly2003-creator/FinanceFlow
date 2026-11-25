const express = require("express");
const RecurringTransaction = require("../models/RecurringTransaction");
const Transaction = require("../models/Transaction");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ================================
// PROCESS DUE RECURRING TRANSACTIONS
// ================================

async function processDueRecurringTransactions() {

    const today = new Date().toISOString().split("T")[0];

    const dueTransactions =
    await RecurringTransaction.find({
        active: true,
        userId: { $exists: true, $ne: null },
        nextDate: { $lte: today }
    });

    for (const recurring of dueTransactions) {

        await Transaction.create({
    userId: recurring.userId,
    title: recurring.title,
    amount: recurring.amount,
    type: recurring.type,
    category: recurring.category,
    date: recurring.nextDate
                                  });

        const nextDate = new Date(recurring.nextDate);

        if (recurring.frequency === "weekly") {
            nextDate.setDate(nextDate.getDate() + 7);
        }

        else if (recurring.frequency === "monthly") {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        else if (recurring.frequency === "yearly") {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        }

        recurring.nextDate =
            nextDate.toISOString().split("T")[0];

        await recurring.save();
    }
}


// ================================
// CREATE RECURRING TRANSACTION
// ================================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const recurringTransaction =
            new RecurringTransaction({
                userId: req.userId,
                title: req.body.title,
                amount: req.body.amount,
                type: req.body.type,
                category: req.body.category,
                frequency: req.body.frequency,
                startDate: req.body.startDate,
                nextDate: req.body.nextDate,
                description: req.body.description,
                active: req.body.active
            });

        const savedTransaction =
            await recurringTransaction.save();

        res.status(201).json({
            message: "Recurring transaction saved successfully",
            recurringTransaction: savedTransaction
        });

    } catch (error) {

        res.status(400).json({
            message: "Please enter valid recurring transaction details",
            error: error.message
        });

    }

});


// ================================
// GET ALL RECURRING TRANSACTIONS
// ================================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const recurringTransactions =
            await RecurringTransaction.find({
                userId: req.userId
            });

        res.json(recurringTransactions);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch recurring transactions",
            error: error.message
        });

    }

});

// ================================
// DELETE RECURRING TRANSACTION
// ================================

router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const deletedTransaction =
            await RecurringTransaction.findOneAndDelete({
                _id: req.params.id,
                userId: req.userId
            });

        if (!deletedTransaction) {

            return res.status(404).json({
                message: "Recurring transaction not found"
            });

        }

        res.json({
            message: "Recurring transaction deleted successfully",
            recurringTransaction: deletedTransaction
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete recurring transaction",
            error: error.message
        });

    }

});

// ================================
// EDIT RECURRING TRANSACTION
// ================================

// ================================
// EDIT RECURRING TRANSACTION
// ================================

router.put("/:id", authMiddleware, async (req, res) => {

    try {

        const updatedTransaction =
            await RecurringTransaction.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.userId
                },
                {
                    title: req.body.title,
                    amount: req.body.amount,
                    type: req.body.type,
                    category: req.body.category,
                    frequency: req.body.frequency,
                    startDate: req.body.startDate,
                    nextDate: req.body.nextDate,
                    description: req.body.description,
                    active: req.body.active
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedTransaction) {

            return res.status(404).json({
                message: "Recurring transaction not found"
            });

        }

        res.json({
            message: "Recurring transaction updated successfully",
            recurringTransaction: updatedTransaction
        });

    } catch (error) {

        res.status(400).json({
            message: "Please enter valid recurring transaction details",
            error: error.message
        });

    }

});


module.exports = router;
module.exports.processDueRecurringTransactions = processDueRecurringTransactions;