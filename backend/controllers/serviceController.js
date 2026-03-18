const db = require("../db");

exports.getAllServices = (req, res) => {
    db.query("SELECT * FROM services", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.getServiceById = (req, res) => {
    db.query("SELECT * FROM services WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Service not found" });
        res.json(result[0]);
    });
};

exports.createService = (req, res) => {
    const { name, description, price } = req.body;
    db.query(
        "INSERT INTO services (name, description, price) VALUES (?, ?, ?)",
        [name, description, price],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Service created", id: result.insertId });
        }
    );
};

exports.updateService = (req, res) => {
    const { name, description, price } = req.body;
    db.query(
        "UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?",
        [name, description, price, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Service updated" });
        }
    );
};

exports.deleteService = (req, res) => {
    db.query("DELETE FROM services WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Service deleted" });
    });
};
