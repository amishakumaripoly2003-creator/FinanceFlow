const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ================================
// REGISTER USER
// ================================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
    typeof email !== "string" ||
    !emailRegex.test(email.trim())
) {
    return res.status(400).json({
        message: "Please enter a valid email address"
    });
}


        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }

        // Validate password length
if (typeof password !== "string" ||
    password.trim().length === 0 ||
    password.length < 8 ||
    password.length > 72) {

    return res.status(400).json({
        message: "Password must be between 8 and 72 characters"
    });

}


        // Check if user already exists
        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(409).json({
                message: "User with this email already exists"
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const user =
            await User.create({
                name: name,
                email: email,
                password: hashedPassword
            });


        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message: "Failed to register user",
            error: error.message
        });

    }

});

// ================================
// LOGIN USER
// ================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
    typeof email !== "string" ||
    !emailRegex.test(email.trim())
) {
    return res.status(400).json({
        message: "Please enter a valid email address"
    });
}

// Validate password input
if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 72
) {
    return res.status(400).json({
        message: "Invalid password format"
    });
}


        // Check required fields
        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }


        // Find user
        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Compare password
        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Create JWT token
        const token =
            jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );


        // Send response
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Failed to login",
            error: error.message
        });

    }

});

// ================================
// GET CURRENT USER
// ================================

router.get("/me", authMiddleware, async (req, res) => {

    try {

        const user =
            await User.findById(req.userId)
                .select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json({
            user: user
        });

    } catch (error) {

        console.error(
            "Get current user error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch user"
        });

    }

});

module.exports = router;