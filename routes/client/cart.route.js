const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");

router.post("/add", controller.addToCart);
router.get("/:userId", controller.getCart);
router.patch("/update", controller.updateCart);
router.delete("/remove", controller.removeFromCart);

module.exports = router;