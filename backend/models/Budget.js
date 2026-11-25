const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },

    month: {
        type: String,
        required: true
    },   
});

// Compound Index
budgetSchema.index(
    { userId: 1, month: 1 },
    { unique: true }
);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;