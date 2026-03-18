const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // In production, use environment variables

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            "INSERT INTO users(name, email, password, role) VALUES(?,?,?,'customer')",
            [name, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Account created successfully" });
            }
        );
    } catch (err) {
        res.status(500).json({ message: "Error processing registration" });
    }
};


exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = result[0];
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).json({ message: "Invalid password" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
};