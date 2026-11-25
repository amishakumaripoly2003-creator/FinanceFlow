const jwt = require("jsonwebtoken");


// ================================
// AUTHENTICATION MIDDLEWARE
// ================================

const authMiddleware = (req, res, next) => {

    try {

        // Check JWT secret configuration
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment variables");

            return res.status(500).json({
            message: "Server authentication configuration error"
            });
        }

        // Get Authorization header
        const authHeader =
            req.headers.authorization;


        // Check if token exists
        if (!authHeader) {

            return res.status(401).json({
                message: "Authentication token is required"
            });

        }


        // Expected format:
        // Authorization: Bearer TOKEN

        const tokenParts =
            authHeader.split(" ");

        if (
            tokenParts.length !== 2 ||
            tokenParts[0] !== "Bearer"
        ) {

            return res.status(401).json({
                message: "Invalid authentication format"
            });

        }


        const token =
            tokenParts[1];


        // Verify JWT token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Store user ID in request
        req.userId =
            decoded.userId;


        // Continue to protected route
        next();


    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired authentication token"
        });

    }

};


module.exports = authMiddleware;