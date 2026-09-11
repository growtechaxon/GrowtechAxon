const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Lead = require("./MODELS/Lead");
const Team = require("./MODELS/Team");

// =====================================================
// APP SETUP
// =====================================================

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// OLD DATA FILE
// =====================================================

const dataFolder = path.join(__dirname, "data");
const leadsFile = path.join(dataFolder, "leads.json");

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

if (!fs.existsSync(leadsFile)) {
    fs.writeFileSync(leadsFile, "[]");
}

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });

// =====================================================
// ADMIN LOGIN
// =====================================================

app.post("/api/admin/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Username and password are required."
            });

        }

        if (
            username !== process.env.ADMIN_USERNAME ||
            password !== process.env.ADMIN_PASSWORD
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid username or password."
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

        console.error(
            "Admin login error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Login server error."
        });

    }

});

// =====================================================
// ADMIN AUTH MIDDLEWARE
// =====================================================

function verifyAdmin(req, res, next) {

    const authHeader =
        req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {

        return res.status(401).json({
            success: false,
            message:
                "Unauthorized access."
        });

    }

    const token =
        authHeader.split(" ")[1];

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (decoded.role !== "admin") {

            return res.status(403).json({
                success: false,
                message:
                    "Admin access required."
            });

        }

        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired token."
        });

    }

}

// =====================================================
// BACKEND HOME
// =====================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message:
            "GrowtechAxon Backend is running 🚀"
    });

});

// =====================================================
// TEST API
// =====================================================

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message:
            "API connection successful!"
    });

});

// =====================================================
// LEADS
// =====================================================

// -----------------------------------------------------
// SUBMIT LEAD — PUBLIC
// -----------------------------------------------------

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

        if (
            !name ||
            !email ||
            !phone ||
            !message
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required fields."
            });

        }

        const newLead =
            await Lead.create({

                name: name,

                business:
                    business || "",

                email: email,

                phone: phone,

                city:
                    city || "",

                service:
                    service || "",

                budget:
                    budget || "",

                message: message,

                status: "New"

            });

        res.status(201).json({

            success: true,

            message:
                "Project request received successfully!",

            lead: newLead

        });

    } catch (error) {

        console.error(
            "Lead save error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error."

        });

    }

});

// -----------------------------------------------------
// GET LEADS — ADMIN ONLY
// -----------------------------------------------------

app.get(
    "/api/leads",
    verifyAdmin,
    async (req, res) => {

        try {

            const leads =
                await Lead.find()
                    .sort({
                        createdAt: -1
                    });

            res.json({

                success: true,

                count:
                    leads.length,

                leads:
                    leads

            });

        } catch (error) {

            console.error(
                "Get leads error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to load leads."

            });

        }

    }
);

// -----------------------------------------------------
// UPDATE LEAD STATUS — ADMIN ONLY
// -----------------------------------------------------

app.put(
    "/api/leads/:id/status",
    verifyAdmin,
    async (req, res) => {

        try {

            const {
                status
            } = req.body;

            const allowedStatuses = [
                "New",
                "Contacted",
                "Converted",
                "Closed"
            ];

            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid status."

                });

            }

            const lead =
                await Lead.findByIdAndUpdate(

                    req.params.id,

                    {
                        status:
                            status
                    },

                    {
                        new: true
                    }

                );

            if (!lead) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Lead not found."

                });

            }

            res.json({

                success: true,

                message:
                    "Lead status updated successfully.",

                lead:
                    lead

            });

        } catch (error) {

            console.error(
                "Update status error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to update lead status."

            });

        }

    }
);

// -----------------------------------------------------
// DELETE LEAD — ADMIN ONLY
// -----------------------------------------------------

app.delete(
    "/api/leads/:id",
    verifyAdmin,
    async (req, res) => {

        try {

            const lead =
                await Lead.findByIdAndDelete(
                    req.params.id
                );

            if (!lead) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Lead not found."

                });

            }

            res.json({

                success: true,

                message:
                    "Lead deleted successfully."

            });

        } catch (error) {

            console.error(
                "Delete lead error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to delete lead."

            });

        }

    }
);

// =====================================================
// TEAM MANAGEMENT
// =====================================================

// -----------------------------------------------------
// GET ACTIVE TEAM — PUBLIC
// -----------------------------------------------------

app.get(
    "/api/team",
    async (req, res) => {

        try {

            const team =
                await Team.find({
                    active: true
                }).sort({
                    displayOrder: 1,
                    createdAt: 1
                });

            res.json({

                success: true,

                count:
                    team.length,

                team:
                    team

            });

        } catch (error) {

            console.error(
                "Get team error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to load team members."

            });

        }

    }
);

// -----------------------------------------------------
// GET ALL TEAM — ADMIN ONLY
// -----------------------------------------------------

app.get(
    "/api/admin/team",
    verifyAdmin,
    async (req, res) => {

        try {

            const team =
                await Team.find()
                    .sort({
                        displayOrder: 1,
                        createdAt: 1
                    });

            res.json({

                success: true,

                count:
                    team.length,

                team:
                    team

            });

        } catch (error) {

            console.error(
                "Get admin team error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to load team members."

            });

        }

    }
);

// -----------------------------------------------------
// ADD TEAM MEMBER — ADMIN ONLY
// -----------------------------------------------------

app.post(
    "/api/admin/team",
    verifyAdmin,
    async (req, res) => {

        try {

            const {
                name,
                designation,
                description,
                photo,
                linkedin,
                instagram,
                github,
                displayOrder,
                active
            } = req.body;

            if (
                !name ||
                !designation
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name and designation are required."

                });

            }

            const newMember =
                await Team.create({

                    name:
                        name,

                    designation:
                        designation,

                    description:
                        description || "",

                    photo:
                        photo || "",

                    linkedin:
                        linkedin || "",

                    instagram:
                        instagram || "",

                    github:
                        github || "",

                    displayOrder:
                        Number(displayOrder) || 0,

                    active:
                        active !== false

                });

            res.status(201).json({

                success: true,

                message:
                    "Team member added successfully.",

                team:
                    newMember

            });

        } catch (error) {

            console.error(
                "Add team member error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to add team member."

            });

        }

    }
);

// -----------------------------------------------------
// UPDATE TEAM MEMBER — ADMIN ONLY
// -----------------------------------------------------

app.put(
    "/api/admin/team/:id",
    verifyAdmin,
    async (req, res) => {

        try {

            const {
                name,
                designation,
                description,
                photo,
                linkedin,
                instagram,
                github,
                displayOrder,
                active
            } = req.body;

            if (
                !name ||
                !designation
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name and designation are required."

                });

            }

            const updatedMember =
                await Team.findByIdAndUpdate(

                    req.params.id,

                    {

                        name:
                            name,

                        designation:
                            designation,

                        description:
                            description || "",

                        photo:
                            photo || "",

                        linkedin:
                            linkedin || "",

                        instagram:
                            instagram || "",

                        github:
                            github || "",

                        displayOrder:
                            Number(displayOrder) || 0,

                        active:
                            active !== false

                    },

                    {

                        new: true,

                        runValidators: true

                    }

                );

            if (!updatedMember) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Team member not found."

                });

            }

            res.json({

                success: true,

                message:
                    "Team member updated successfully.",

                team:
                    updatedMember

            });

        } catch (error) {

            console.error(
                "Update team member error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to update team member."

            });

        }

    }
);

// -----------------------------------------------------
// DELETE TEAM MEMBER — ADMIN ONLY
// -----------------------------------------------------

app.delete(
    "/api/admin/team/:id",
    verifyAdmin,
    async (req, res) => {

        try {

            const deletedMember =
                await Team.findByIdAndDelete(
                    req.params.id
                );

            if (!deletedMember) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Team member not found."

                });

            }

            res.json({

                success: true,

                message:
                    "Team member deleted successfully."

            });

        } catch (error) {

            console.error(
                "Delete team member error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to delete team member."

            });

        }

    }
);

// =====================================================
// SERVE FRONTEND + ADMIN FILES
// =====================================================

// This makes these URLs work:
//
// http://localhost:5000/
// http://localhost:5000/admin/login.html
// http://localhost:5000/admin/dashboard.html

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
    PORT,
    () => {

        console.log(
            `GrowtechAxon Backend running on http://localhost:${PORT}`
        );

    }
);