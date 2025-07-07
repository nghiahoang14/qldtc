const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/upload.middleware");
const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.post("/create", upload.single("image"), controller.createProduct);

router.patch("/update/:id", upload.single("image"), controller.updateProduct);

router.delete("/delete/:id", controller.deleteProduct);

router.get("/detail/:id", controller.detailProduct);

module.exports = router