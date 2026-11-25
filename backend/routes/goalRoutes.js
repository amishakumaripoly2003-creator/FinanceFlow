const express = require("express");
const Goal = require("../models/Goal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE GOAL
router.post("/", authMiddleware, async (req, res) => {
    try {

        const {
            name,
            targetAmount,
            savedAmount,
            targetDate,
            description
        } = req.body;

        const goal = new Goal({
            userId: req.userId,
            name,
            targetAmount,
            savedAmount,
            targetDate,
            description
        });

        const savedGoal = await goal.save();

        res.status(201).json({
            message: "Goal saved successfully",
            goal: savedGoal
        });

    } catch (error) {

        res.status(400).json({
            message: "Please enter valid goal details",
            error: error.message
        });

    }
});


// GET USER'S GOALS
router.get("/", authMiddleware, async (req, res) => {
    try {

        const goals = await Goal.find({
            userId: req.userId
        });

        res.json(goals);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch goals",
            error: error.message
        });

    }
});


// ADD MONEY TO GOAL
router.put("/:id/add-money", authMiddleware, async (req, res) => {
    try {

        const amount = Number(req.body.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Please enter a valid amount"
            });
        }

        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!goal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        goal.savedAmount += amount;

        const updatedGoal = await goal.save();

        res.json({
            message: "Money added successfully",
            goal: updatedGoal
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to add money",
            error: error.message
        });

    }
});


// UPDATE GOAL
router.put("/:id", authMiddleware, async (req, res) => {
    try {

        const updatedGoal = await Goal.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                name: req.body.name,
                targetAmount: req.body.targetAmount,
                targetDate: req.body.targetDate,
                description: req.body.description
            },
            {
    returnDocument: "after",
    runValidators: true
    }
        );

        if (!updatedGoal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        res.json({
            message: "Goal updated successfully",
            goal: updatedGoal
        });

    } catch (error) {

        res.status(400).json({
            message: "Failed to update goal",
            error: error.message
        });

    }
});


// DELETE GOAL
router.delete("/:id", authMiddleware, async (req, res) => {
    try {

        const deletedGoal = await Goal.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!deletedGoal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        res.json({
            message: "Goal deleted successfully",
            goal: deletedGoal
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete goal",
            error: error.message
        });

    }
});

module.exports = router;