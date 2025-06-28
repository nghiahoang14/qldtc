const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");

router.get("/", controller.getOrders);

router.get("/detail/:id", controller.getDetailOrder);

module.exports = router;