const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        business: {
            type: String,
            default: "",
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            default: "",
            trim: true
        },

        service: {
            type: String,
            default: "",
            trim: true
        },

        budget: {
            type: String,
            default: "",
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["New", "Contacted", "Converted", "Closed"],
            default: "New"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Lead", leadSchema);