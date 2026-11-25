const express = require("express");
const Transaction = require("../models/Transaction");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =================================
// CREATE TRANSACTION
// =================================

router.post("/", authMiddleware, async (req, res) => {
    try {

        const {
            title,
            amount,
            type,
            category,
            date
        } = req.body;

        const transaction = new Transaction({
            title,
            amount,
            type,
            category,
            date,
            userId: req.userId
        });

        const savedTransaction = await transaction.save();

        res.status(201).json({
            message: "Transaction added successfully",
            transaction: savedTransaction
        });

    } catch (error) {

        if (error.name === "ValidationError") {

            const errors = {};

            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({
                message: "Please enter valid transaction details",
                errors
            });
        }

        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});


// =================================
// GET USER TRANSACTIONS
// =================================

router.get("/", authMiddleware, async (req, res) => {
    try {

        const transactions = await Transaction.find({
            userId: req.userId
        });

        res.json(transactions);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
});


// =================================
// UPDATE TRANSACTION
// =================================

router.put("/:id", authMiddleware, async (req, res) => {
    try {

        const {
            title,
            amount,
            type,
            category,
            date
        } = req.body;

        const updatedTransaction =
            await Transaction.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.userId
                },
                {
                    title,
                    amount,
                    type,
                    category,
                    date
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            );

        if (!updatedTransaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            message: "Transaction updated successfully",
            transaction: updatedTransaction
        });

    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        if (error.name === "ValidationError") {

            const errors = {};

            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({
                message: "Please enter valid transaction details",
                errors
            });
        }

        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});


// =================================
// DELETE ALL USER TRANSACTIONS
// =================================

router.delete("/", authMiddleware, async (req, res) => {
    try {

        await Transaction.deleteMany({
            userId: req.userId
        });

        res.json({
            message: "Your transactions deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete transactions",
            error: error.message
        });
    }
});


// =================================
// DELETE SINGLE TRANSACTION
// =================================

router.delete("/:id", authMiddleware, async (req, res) => {
    try {

        const deletedTransaction =
            await Transaction.findOneAndDelete({
                _id: req.params.id,
                userId: req.userId
            });

        if (!deletedTransaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            message: "Transaction deleted successfully",
            transaction: deletedTransaction
        });

    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});


module.exports = router;