const express = require("express");
const router = express.Router();

const uploadCloudinary = require("../../middlewares/upload.middleware");

const controller = require("../../controllers/admin/category.controller");

router.get("/", controller.index);

router.post("/create", uploadCloudinary("image"),controller.createCategory);

router.patch("/update/:id",uploadCloudinary("image"), controller.updateCategory);

router.delete("/delete/:id", controller.deleteCategory);

router.get("/detail/:id", controller.detailCategory);   

module.exports = router