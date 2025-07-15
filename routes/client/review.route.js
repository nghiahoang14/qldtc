const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/review.controller");

router.post("/", controller.review);

router.get("/:id", controller.getReviews);

module.exports = router