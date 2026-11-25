
const mongoose = require("mongoose");

const recurringTransactionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0.01
    },

    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    frequency: {
        type: String,
        enum: ["weekly", "monthly", "yearly"],
        required: true
    },

    startDate: {
        type: String,
        required: true
    },

    nextDate: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    active: {
        type: Boolean,
        default: true
    }

});

const RecurringTransaction =
    mongoose.model(
        "RecurringTransaction",
        recurringTransactionSchema
    );

module.exports = RecurringTransaction;