const express = require("express");
const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE OR UPDATE USER'S BUDGET
router.post("/", authMiddleware, async (req, res) => {
    try {

        const { amount, month } = req.body;

        const budget = await Budget.findOneAndUpdate(
            {
                userId: req.userId,
                month: month
            },
            {
                userId: req.userId,
                amount: amount,
                month: month
            },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Budget saved successfully",
            budget: budget
        });

    } catch (error) {

        res.status(400).json({
            message: "Please enter a valid budget",
            error: error.message
        });

    }
});

// GET USER'S BUDGET FOR A MONTH
router.get("/:month", authMiddleware, async (req, res) => {
    try {

        const budget = await Budget.findOne({
            userId: req.userId,
            month: req.params.month
        });

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        res.json(budget);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch budget",
            error: error.message
        });

    }
});

module.exports = router;