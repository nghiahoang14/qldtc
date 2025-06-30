const express = require("express");
const router = express.Router();


const controller = require("../../controllers/admin/category.controller");

router.get("/", controller.index);

router.post("/create", controller.createCategory);

router.patch("/update/:id", controller.updateCategory);

router.delete("/delete/:id", controller.deleteCategory);

router.get("/detail/:id", controller.detailCategory);

module.exports = router