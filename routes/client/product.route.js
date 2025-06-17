const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);


// router.post("/create", controller.createProduct);
router.get("/search", controller.searchProduct);
router.get("/detail/:id", controller.detailProduct);

module.exports = router