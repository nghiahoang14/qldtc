const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.post("/create", controller.createProduct);

router.patch("/update/:id", controller.updateProduct);

router.delete("/delete/:id", controller.deleteProduct);

router.get("/detail/:id", controller.detailProduct);

module.exports = router