const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    targetAmount: {
        type: Number,
        required: true,
        min: 0.01
    },

    savedAmount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },

    targetDate: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    }
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;