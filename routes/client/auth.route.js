const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/auth.controller");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword)

router.post("/password/otp", controller.verifyOtp);

router.post("/password/reset", controller.resetPassword);

router.patch("/password/change", controller.changePassword);



module.exports = router