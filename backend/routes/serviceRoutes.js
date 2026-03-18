const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.post("/", verifyToken, isAdmin, serviceController.createService);
router.put("/:id", verifyToken, isAdmin, serviceController.updateService);
router.delete("/:id", verifyToken, isAdmin, serviceController.deleteService);

module.exports = router;
