const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret_key";

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Require Admin Role" });
    }
    next();
};

const isEmployee = (req, res, next) => {
    if (req.user.role !== "employee" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Require Employee or Admin Role" });
    }
    next();
};

module.exports = { verifyToken, isAdmin, isEmployee };
