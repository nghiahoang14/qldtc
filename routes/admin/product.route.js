const express = require("express");
const router = express.Router();

const uploadCloudinary = require("../../middlewares/upload.middleware");
const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.post("/create", uploadCloudinary("image"), controller.createProduct);

router.patch("/update/:id", uploadCloudinary("image"), controller.updateProduct);

router.delete("/delete/:id", controller.deleteProduct);

router.get("/detail/:id", controller.detailProduct);

module.exports = router