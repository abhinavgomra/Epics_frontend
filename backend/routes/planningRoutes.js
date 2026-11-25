const express = require("express");
const { getPickupPlan } = require("../controllers/planningController");

const router = express.Router();

// Optional query: /api/planning/pickups?area=Block%20A
router.get("/pickups", getPickupPlan);

module.exports = router;
