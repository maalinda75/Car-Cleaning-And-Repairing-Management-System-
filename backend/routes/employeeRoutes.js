const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, employeeController.getAllEmployees);
router.post("/", verifyToken, isAdmin, employeeController.createEmployee);
router.delete("/:id", verifyToken, isAdmin, employeeController.deleteEmployee);


module.exports = router;
