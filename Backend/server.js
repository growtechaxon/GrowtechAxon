const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Lead = require("./models/Lead");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

// ===============================
// APP SETUP
// ===============================

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ===============================
// OLD DATA FILE
// ===============================

const dataFolder = path.join(__dirname, "data");
const leadsFile = path.join(dataFolder, "leads.json");

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

if (!fs.existsSync(leadsFile)) {
    fs.writeFileSync(leadsFile, "[]");
}

// ===============================
// ADMIN LOGIN
// ===============================

app.post("/api/admin/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        if (
            username !== process.env.ADMIN_USERNAME ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const token = jwt.sign(
            {
                username: username,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            success: true,
            message: "Login successful!",
            token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login server error."
        });
    }
});

// ===============================
// AUTH MIDDLEWARE
// ===============================

function verifyAdmin(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required."
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "GrowtechAxon Backend is running 🚀"
    });
});

// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API connection successful!"
    });
});

// ===============================
// SUBMIT LEAD — MONGODB
// ===============================

app.post("/api/leads", async (req, res) => {

    try {

        const {
            name,
            business,
            email,
            phone,
            city,
            service,
            budget,
            message
        } = req.body;

        if (!name || !email || !phone || !message) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }

        const newLead = await Lead.create({

            name,
            business: business || "",
            email,
            phone,
            city: city || "",
            service: service || "",
            budget: budget || "",
            message,

            status: "New"
        });

        res.status(201).json({

            success: true,

            message:
                "Project request received successfully!",

            lead: newLead

        });

    } catch (error) {

        console.error("Lead save error:", error);

        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

});

// ===============================
// GET LEADS — ADMIN ONLY
// ===============================

app.get("/api/leads", verifyAdmin, async (req, res) => {

    try {

        const leads = await Lead.find()
            .sort({ createdAt: -1 });

        res.json({

            success: true,

            count: leads.length,

            leads

        });

    } catch (error) {

        console.error("Get leads error:", error);

        res.status(500).json({

            success: false,

            message: "Unable to load leads."

        });

    }

});

// ===============================
// UPDATE LEAD STATUS — ADMIN ONLY
// ===============================

app.put("/api/leads/:id/status", verifyAdmin, async (req, res) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [
            "New",
            "Contacted",
            "Converted",
            "Closed"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid status."
            });

        }

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (!lead) {

            return res.status(404).json({
                success: false,
                message: "Lead not found."
            });

        }

        res.json({

            success: true,

            message:
                "Lead status updated successfully.",

            lead

        });

    } catch (error) {

        console.error("Update status error:", error);

        res.status(500).json({

            success: false,

            message: "Unable to update lead status."

        });

    }

});

// ===============================
// DELETE LEAD — ADMIN ONLY
// ===============================

app.delete("/api/leads/:id", verifyAdmin, async (req, res) => {

    try {

        const lead = await Lead.findByIdAndDelete(
            req.params.id
        );

        if (!lead) {

            return res.status(404).json({
                success: false,
                message: "Lead not found."
            });

        }

        res.json({

            success: true,

            message:
                "Lead deleted successfully."

        });

    } catch (error) {

        console.error("Delete lead error:", error);

        res.status(500).json({

            success: false,

            message: "Unable to delete lead."

        });

    }

});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `GrowtechAxon Backend running on http://localhost:${PORT}`
    );

});