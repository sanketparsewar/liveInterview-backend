const express = require("express");
const router = express.Router();
const { login, register, getMe } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/register", register);
router.get("/me", getMe);

module.exports = router;
