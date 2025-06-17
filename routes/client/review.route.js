const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/review.controller");

router.post("/", controller.review);


module.exports = router