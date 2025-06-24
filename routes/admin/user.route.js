const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/user.controller");

router.get("/", controller.index);

router.post("/", controller.createUser);

router.patch("/:id", controller.updateUser);

router.delete("/:id", controller.deleteUser);

module.exports = router