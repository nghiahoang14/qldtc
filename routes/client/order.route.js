const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order.controller");

router.post("/", controller.order);
<<<<<<< HEAD
router.get("/:id", controller.getOrderById);
=======

router.get("/:userId", controller.getOrdersByUserId)

>>>>>>> ae77ac8cd1fd0a654727c31fa012b5aff22fc106
module.exports = router