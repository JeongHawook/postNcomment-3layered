const express = require("express");
const router = express.Router();
const { Users, UserInfos, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { tryCatch } = require("../utils/tryCatch");

const UserController = require("../controllers/users.controller");
const userController = new UserController();
router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;
