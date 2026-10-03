const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        designation: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        photo: {
            type: String,
            default: ""
        },

        linkedin: {
            type: String,
            default: "",
            trim: true
        },

        instagram: {
            type: String,
            default: "",
            trim: true
        },

        github: {
            type: String,
            default: "",
            trim: true
        },

        displayOrder: {
            type: Number,
            default: 0
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Team", teamSchema);