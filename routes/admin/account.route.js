const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);

router.post("/create", controller.createAccount);

router.patch("/update/:id", controller.updateAccount);

router.delete("/delete/:id", controller.deleteAccount);

router.get("/detail/:id", controller.detailAccount);

router.post("/login", controller.login);

module.exports = router