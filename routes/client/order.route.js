const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order.controller");

router.post("/", controller.order);

router.get("/:id", controller.getOrderById);


router.get("/user/:userId", controller.getOrdersByUserId)


module.exports = router