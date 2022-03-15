const express = require("express");
const controller = require("../controllers/controller");
const router = express.Router();
const passport = require("passport");
const passPortConfig = require("../../passport-config");
const initialized = passPortConfig;
const Students = require("../models/RegisterStudent");
const Admins = require("../models/RegisterAdmin");
const Teachers = require("../models/RegisterTeacher");

//Get
router.get("/", controller.homepage);
router.get("/student-login", checkNotAuthenticated, controller.studentLogin);
router.get("/teacher-login", checkNotAuthenticated, controller.teacherLogin);
router.get("/admin-login", checkNotAuthenticated, controller.adminLogin);
router.get("/admin-register", checkNotAuthenticated, controller.adminRegister);

router.get(
	"/join-class",
	checkAuthenticated,
	checkStudentValidation,
	controller.JoinClass
);
router.get(
	"/create-class",
	checkAuthenticated,
	checkTeacherValidation,
	controller.createClass
);
router.get(
	"/activate-class",
	checkAuthenticated,
	checkTeacherValidation,
	controller.activateClass
);
router.get(
	"/register-student",
	checkAuthenticated,
	checkAdminValidation,
	controller.RegisterStudent
);
router.get(
	"/register-teacher",
	checkAuthenticated,
	checkAdminValidation,
	controller.RegisterTeacher
);
router.get("/dashboard", checkAuthenticated, controller.dashboard);

//Post
router.post(
	"/student-login",
	getStudentData,
	passport.authenticate("local-authenticate", {
		successRedirect: "/dashboard",
		failureRedirect: "/student-login",
		failureFlash: true,
	})
);
router.post(
	"/teacher-login",
	getteacherData,
	passport.authenticate("local-authenticate", {
		successRedirect: "/dashboard",
		failureRedirect: "/teacher-login",
		failureFlash: true,
	})
);

router.post(
	"/admin-login",
	getAdminData,
	passport.authenticate("local-authenticate", {
		successRedirect: "/dashboard",
		failureRedirect: "/admin-login",
		failureFlash: true,
	})
);

router.post("/register-student", controller.PostRegisterStudent);
router.post("/register-teacher", controller.PostRegisterTeacher);
router.post("/register-admin", controller.PostRegisterAdmin);
router.post("/create-class", controller.PostCreateClass);
router.post("/join-class", controller.PostJoinClass);
router.post("/getclassstatus", controller.getClassStatus);
router.post("/checkclassexpiry", controller.checkClassExpiry);

router.post("/activate-class", controller.PostActivateClass);

router.delete("/logout", (req, res) => {
	req.logOut();
	res.redirect("/");
});

function checkAdminValidation(req, res, next) {
	if (req.user.type != "admin") {
		return res.redirect("/dashboard");
	}
	next();
}

function checkStudentValidation(req, res, next) {
	if (req.user.type != "student") {
		return res.redirect("/dashboard");
	}
	next();
}

function checkTeacherValidation(req, res, next) {
	if (req.user.type != "teacher") {
		return res.redirect("/dashboard");
	}
	next();
}

async function getStudentData(req, res, next) {
	try {
		const studentsData = await Students.find({
			username: req.body.username,
		}).limit();

		initialized(
			passport,
			(username) => studentsData.find((user) => user.username === username),
			(id) => studentsData.find((user) => user.timeId === id)
		);
	} catch (error) {
		alert(error);
	}

	next();
}

async function getAdminData(req, res, next) {
	try {
		const adminData = await Admins.find({
			username: req.body.username,
		}).limit();

		initialized(
			passport,
			(username) => adminData.find((user) => user.username === username),
			(id) => adminData.find((user) => user.timeId === id)
		);
	} catch (error) {
		alert(error);
	}

	next();
}

async function getteacherData(req, res, next) {
	try {
		const teacherData = await Teachers.find({
			username: req.body.username,
		}).limit();

		initialized(
			passport,
			(username) => teacherData.find((user) => user.username === username),
			(id) => teacherData.find((user) => user.timeId === id)
		);
	} catch (error) {
		alert(error);
	}

	next();
}

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
