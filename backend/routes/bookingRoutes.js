const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken, isAdmin, isEmployee } = require("../middleware/authMiddleware");

router.post("/", verifyToken, bookingController.createBooking);
router.get("/", verifyToken, isAdmin, bookingController.getAllBookings);
router.get("/user/:userId", verifyToken, bookingController.getUserBookings);
router.get("/employee/:employeeId", verifyToken, isEmployee, bookingController.getEmployeeBookings);
router.put("/:id/status", verifyToken, isEmployee, bookingController.updateBookingStatus);
router.put("/:id/assign", verifyToken, isAdmin, bookingController.assignEmployee);

module.exports = router;