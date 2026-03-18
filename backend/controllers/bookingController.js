const db = require("../db");

exports.createBooking = (req, res) => {
    const { user_id, service_ids, booking_date, location } = req.body;
    
    // Start a transaction if possible, or just nested queries
    db.query(
        "INSERT INTO bookings(user_id, service_id, booking_date, location) VALUES(?,?,?,?)",
        [user_id, service_ids[0], booking_date, location],
        (err, result) => {
            if (err) return res.status(500).json(err);
            const bookingId = result.insertId;

            // Insert multiple services into booking_services
            const values = service_ids.map(sid => [bookingId, sid]);
            db.query(
                "INSERT INTO booking_services(booking_id, service_id) VALUES ?",
                [values],
                (err2) => {
                    if (err2) return res.status(500).json(err2);
                    res.json({ message: "Booking created with multiple services", id: bookingId });
                }
            );
        }
    );
};

exports.getAllBookings = (req, res) => {
    const sql = `
        SELECT b.*, u.name as customer_name, e.name as employee_name,
               COALESCE(GROUP_CONCAT(s.name SEPARATOR ', '), 'No services') as service_names,
               COALESCE(SUM(s.price), 0) as total_price
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        LEFT JOIN users e ON b.employee_id = e.id
        LEFT JOIN booking_services bs ON b.id = bs.booking_id
        LEFT JOIN services s ON bs.service_id = s.id
        GROUP BY b.id
        ORDER BY b.booking_date DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.getUserBookings = (req, res) => {
    const sql = `
        SELECT b.*, 
               COALESCE(GROUP_CONCAT(s.name SEPARATOR ', '), 'No services') as service_names,
               COALESCE(SUM(s.price), 0) as total_price
        FROM bookings b
        LEFT JOIN booking_services bs ON b.id = bs.booking_id
        LEFT JOIN services s ON bs.service_id = s.id
        WHERE b.user_id = ?
        GROUP BY b.id
        ORDER BY b.booking_date DESC
    `;
    db.query(sql, [req.params.userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.getEmployeeBookings = (req, res) => {
    const sql = `
        SELECT b.*, u.name as customer_name,
               COALESCE(GROUP_CONCAT(s.name SEPARATOR ', '), 'No services') as service_names
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        LEFT JOIN booking_services bs ON b.id = bs.booking_id
        LEFT JOIN services s ON bs.service_id = s.id
        WHERE b.employee_id = ?
        GROUP BY b.id
        ORDER BY b.booking_date DESC
    `;
    db.query(sql, [req.params.employeeId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.updateBookingStatus = (req, res) => {
    const { status } = req.body;
    db.query(
        "UPDATE bookings SET status = ? WHERE id = ?",
        [status, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Booking status updated" });
        }
    );
};

exports.assignEmployee = (req, res) => {
    const { employee_id } = req.body;
    db.query(
        "UPDATE bookings SET employee_id = ? WHERE id = ?",
        [employee_id, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Employee assigned to booking" });
        }
    );
};