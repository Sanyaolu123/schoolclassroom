const express = require("express");
const router = express.Router();
const passport = require("passport");
const Class = require("../models/CreateClass");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const controller = require("../controllers/controller");

router.get("/:room", checkAuthenticated, controller.sendToClass)
router.get("/c/expired", checkAuthenticated, controller.expiredClass)



function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect("/");
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("dashboard");
	}

	next();
}
module.exports = router;
