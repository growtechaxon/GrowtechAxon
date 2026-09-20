const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();

const cloudinary = require("cloudinary").v2;

const Lead = require("./MODELS/Lead");
const Team = require("./MODELS/Team");

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
// TEAM IMAGE UPLOAD - CLOUDINARY
// =====================================================

const teamUploadFolder = "growtechaxon/team";

// =====================================================
// MULTER MEMORY STORAGE
// =====================================================

const teamStorage = multer.memoryStorage();

const uploadTeamPhoto = multer({
    storage: teamStorage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed."
                )
            );
        }
    }
});

// =====================================================
// CLOUDINARY UPLOAD HELPER
// =====================================================

function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: teamUploadFolder,
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(buffer);
    });
}

// =====================================================
// CLOUDINARY DELETE HELPER
// =====================================================

async function deleteCloudinaryImage(photoUrl) {
    try {
        if (!photoUrl) {
            return;
        }

        if (!photoUrl.includes("res.cloudinary.com")) {
            return;
        }

        const url = new URL(photoUrl);

        const pathParts = url.pathname
            .split("/")
            .filter(Boolean);

        const uploadIndex = pathParts.indexOf("upload");

        if (uploadIndex === -1) {
            return;
        }

        let publicParts = pathParts.slice(
            uploadIndex + 1
        );

        // Remove transformation parameters if present
        if (
            publicParts.length &&
            (
                publicParts[0].includes(",") ||
                publicParts[0].includes("_") ||
                publicParts[0].includes("=")
            )
        ) {
            publicParts.shift();
        }

        let publicId = publicParts.join("/");

        // Remove file extension
        publicId = publicId.replace(
            /\.(jpg|jpeg|png|webp|gif|avif)$/i,
            ""
        );

        if (!publicId) {
            return;
        }

        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image",
                type: "upload"
            }
        );

        console.log(
            "Cloudinary image deleted:",
            publicId
        );

    } catch (error) {
        console.error(
            "Cloudinary image delete error:",
            error.message
        );
    }
}

// =====================================================
// OLD DATA FILE
// =====================================================

const dataFolder = path.join(
    __dirname,
    "data"
);

const leadsFile = path.join(
    dataFolder,
    "leads.json"
);

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(
        dataFolder,
        {
            recursive: true
        }
    );
}

if (!fs.existsSync(leadsFile)) {
    fs.writeFileSync(
        leadsFile,
        "[]"
    );
}

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
    .connect(
        process.env.MONGODB_URI
    )
    .then(() => {
        console.log(
            "MongoDB connected successfully!"
        );
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

app.post(
    "/api/admin/login",
    async (req, res) => {

        try {

            const {
                username,
                password
            } = req.body;

            if (
                !username ||
                !password
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Username and password are required."
                });
            }

            if (
                username !==
                    process.env.ADMIN_USERNAME ||
                password !==
                    process.env.ADMIN_PASSWORD
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
                message:
                    "Login successful!",
                token: token
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
    }
);

// =====================================================
// ADMIN AUTH MIDDLEWARE
// =====================================================

function verifyAdmin(
    req,
    res,
    next
) {

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

        if (
            decoded.role !== "admin"
        ) {
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

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,
            message:
                "GrowtechAxon Backend is running 🚀"
        });
    }
);

// =====================================================
// TEST API
// =====================================================

app.get(
    "/api/test",
    (req, res) => {

        res.json({
            success: true,
            message:
                "API connection successful!"
        });
    }
);

// =====================================================
// LEADS
// =====================================================

// -----------------------------------------------------
// SUBMIT LEAD — PUBLIC
// -----------------------------------------------------

app.post(
    "/api/leads",
    async (req, res) => {

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
    }
);

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
                count: leads.length,
                leads: leads
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
                !allowedStatuses.includes(
                    status
                )
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
                        status: status
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
                lead: lead
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
                count: team.length,
                team: team
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
                count: team.length,
                team: team
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
    uploadTeamPhoto.single("photo"),
    async (req, res) => {

        try {

            const {
                name,
                designation,
                description,
                linkedin,
                instagram,
                github,
                displayOrder,
                active
            } = req.body;

            // ---------------------------------------------
            // VALIDATION
            // ---------------------------------------------

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

            // ---------------------------------------------
            // UPLOAD IMAGE TO CLOUDINARY
            // ---------------------------------------------

            let photo = "";

            if (req.file) {

                const cloudinaryResult =
                    await uploadToCloudinary(
                        req.file.buffer
                    );

                photo =
                    cloudinaryResult.secure_url;

                console.log(
                    "Team image uploaded:",
                    photo
                );
            }

            // ---------------------------------------------
            // ACTIVE VALUE
            // ---------------------------------------------

            const activeValue =
                active === undefined
                    ? true
                    : String(active) === "true";

            // ---------------------------------------------
            // CREATE MEMBER
            // ---------------------------------------------

            const newMember =
                await Team.create({

                    name:
                        name.trim(),

                    designation:
                        designation.trim(),

                    description:
                        description
                            ? description.trim()
                            : "",

                    photo:
                        photo,

                    linkedin:
                        linkedin
                            ? linkedin.trim()
                            : "",

                    instagram:
                        instagram
                            ? instagram.trim()
                            : "",

                    github:
                        github
                            ? github.trim()
                            : "",

                    displayOrder:
                        Number(
                            displayOrder
                        ) || 0,

                    active:
                        activeValue
                });

            res.status(201).json({
                success: true,
                message:
                    "Team member added successfully.",
                team: newMember
            });

        } catch (error) {

            console.error(
                "Add team member error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to add team member.",
                error:
                    error.message
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
    uploadTeamPhoto.single("photo"),
    async (req, res) => {

        try {

            const {
                name,
                designation,
                description,
                linkedin,
                instagram,
                github,
                displayOrder,
                active
            } = req.body;

            // ---------------------------------------------
            // VALIDATION
            // ---------------------------------------------

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

            // ---------------------------------------------
            // FIND EXISTING MEMBER
            // ---------------------------------------------

            const existingMember =
                await Team.findById(
                    req.params.id
                );

            if (!existingMember) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Team member not found."
                });
            }

            // ---------------------------------------------
            // UPDATE DATA
            // ---------------------------------------------

            const updateData = {

                name:
                    name.trim(),

                designation:
                    designation.trim(),

                description:
                    description
                        ? description.trim()
                        : "",

                linkedin:
                    linkedin
                        ? linkedin.trim()
                        : "",

                instagram:
                    instagram
                        ? instagram.trim()
                        : "",

                github:
                    github
                        ? github.trim()
                        : "",

                displayOrder:
                    Number(
                        displayOrder
                    ) || 0,

                active:
                    active === undefined
                        ? true
                        : String(active) === "true"
            };

            // ---------------------------------------------
            // NEW IMAGE
            // ---------------------------------------------

            if (req.file) {

                const cloudinaryResult =
                    await uploadToCloudinary(
                        req.file.buffer
                    );

                updateData.photo =
                    cloudinaryResult.secure_url;

                console.log(
                    "New team image uploaded:",
                    updateData.photo
                );
            } else {

                updateData.photo =
                    existingMember.photo || "";
            }

            // ---------------------------------------------
            // UPDATE DATABASE
            // ---------------------------------------------

            const updatedMember =
                await Team.findByIdAndUpdate(
                    req.params.id,
                    updateData,
                    {
                        new: true,
                        runValidators: true
                    }
                );

            // ---------------------------------------------
            // DELETE OLD CLOUDINARY IMAGE
            // ---------------------------------------------

            if (
                req.file &&
                existingMember.photo
            ) {
                await deleteCloudinaryImage(
                    existingMember.photo
                );
            }

            res.json({
                success: true,
                message:
                    "Team member updated successfully.",
                team: updatedMember
            });

        } catch (error) {

            console.error(
                "Update team member error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to update team member.",
                error:
                    error.message
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

            // ---------------------------------------------
            // FIND MEMBER
            // ---------------------------------------------

            const deletedMember =
                await Team.findById(
                    req.params.id
                );

            if (!deletedMember) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Team member not found."
                });
            }

            // ---------------------------------------------
            // DELETE DATABASE RECORD
            // ---------------------------------------------

            await Team.findByIdAndDelete(
                req.params.id
            );

            // ---------------------------------------------
            // DELETE CLOUDINARY IMAGE
            // ---------------------------------------------

            if (
                deletedMember.photo
            ) {
                await deleteCloudinaryImage(
                    deletedMember.photo
                );
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
                    "Unable to delete team member.",
                error:
                    error.message
            });
        }
    }
);

// =====================================================
// MULTER / UPLOAD ERROR HANDLER
// =====================================================

app.use(
    (error, req, res, next) => {

        if (
            error instanceof multer.MulterError
        ) {

            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Image size must be less than 5MB."
                });
            }

            return res.status(400).json({
                success: false,
                message:
                    error.message
            });
        }

        if (
            error &&
            error.message ===
                "Only JPG, PNG and WEBP images are allowed."
        ) {
            return res.status(400).json({
                success: false,
                message:
                    error.message
            });
        }

        next(error);
    }
);

// =====================================================
// SERVE FRONTEND + ADMIN FILES
// =====================================================

app.use(
    express.static(
        path.join(
            __dirname,
            ".."
        )
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