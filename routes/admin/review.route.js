const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/review.controller");

router.delete("/:id", controller.delete);

router.get("/", controller.getReviews);


module.exports = router