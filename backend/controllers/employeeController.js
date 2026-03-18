const db = require("../db");
const bcrypt = require("bcrypt");

exports.getAllEmployees = (req, res) => {
    db.query("SELECT id, name, email, role FROM users WHERE role = 'employee'", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.createEmployee = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'employee')",
            [name, email, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Email already exists" });
                    return res.status(500).json(err);
                }
                res.json({ message: "Employee account created", id: result.insertId });
            }
        );
    } catch (err) {
        res.status(500).json({ message: "Error processing request" });
    }
};

exports.deleteEmployee = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE id = ? AND role = 'employee'", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Employee not found" });
        res.json({ message: "Employee account deleted" });
    });
};

