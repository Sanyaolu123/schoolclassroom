const bcrypt = require("bcrypt");
const app = require("express")();
const StudentRegistration = require("../models/RegisterStudent");
const TeacherRegistration = require("../models/RegisterTeacher");
const ClassRegistration = require("../models/CreateClass");
const crypto = require("crypto");
const flash = require("express-flash");
const Class = require("../models/CreateClass");
const { v4: uuidv4 } = require("uuid");

app.use(flash());

var sess;

/**
 *
 *Gets Homepage
 */
exports.homepage = (req, res) => {
	res.render("index", { title: "HomePage" });
};

/**
 *
 *Gets Dashboard
 */
exports.dashboard = async (req, res) => {
	let courseRole = req.user.course || req.user.role;

	let search = await ClassRegistration.find({ course: courseRole }).limit();
	let searchCourseRole = await search.find(
		(searchC) => searchC.course === courseRole
	);

	try {
		if (typeof searchCourseRole == "undefined") {
			res.render("dashboard", {
				title: "Dashboard",
				init: "dashboard",
				type: req.user.type,
				fname: req.user.fname,
				lname: req.user.lname,
				username: req.user.username,
			});
			// res.redirect("/")
		} else {
			if (searchCourseRole.teacherLogin == "no" && searchCourseRole.expired == "no") {
				res.render("dashboard", {
					title: "Dashboard",
					init: "dashboard",
					type: req.user.type,
					fname: req.user.fname,
					lname: req.user.lname,
					username: req.user.username,
					info: searchCourseRole,
				});
			}else{

			if (searchCourseRole.teacherLogin == "yes" && searchCourseRole.expired == "no") {
				res.render("dashboard", {
					title: "Dashboard",
					init: "dashboard",
					type: req.user.type,
					fname: req.user.fname,
					lname: req.user.lname,
					username: req.user.username,
					infoYes: searchCourseRole,
				});
			}else{
				res.render("dashboard", {
					title: "Dashboard",
					init: "dashboard",
					type: req.user.type,
					fname: req.user.fname,
					lname: req.user.lname,
					username: req.user.username,
				});
			}
			}
		}
	} catch (error) {
		console.log(error);
	}
};

/**
 *
 *Gets Student Login
 */
exports.studentLogin = (req, res) => {
	res.render("login", {
		title: "Student Login",
		header: "Student Login",
		type: "student",
	});
};

/**
 *
 *Gets Teacher Login
 */
exports.teacherLogin = (req, res) => {
	res.render("login", {
		title: "Teacher Login",
		header: "Teacher Login",
		type: "teacher",
	});
};

/**
 *
 *Gets Admin Login
 */
exports.adminLogin = (req, res) => {
	res.render("login", {
		title: "Admin Login",
		header: "Admin Login",
		type: "admin",
	});
};

/**
 *
 *Join Class
 */
exports.JoinClass = async (req, res) => {
	let course = req.user.course;
	let search = await ClassRegistration.find({ course: course }).limit();
	let searchCourse = await search.find((searchC) => searchC.course === course);

	try {
		if (typeof searchCourse.teacherLogin == "undefined") {
			res.render("class", { title: "Join Class", type: "join", message: "" });
		} else {
			try{
				if (
					searchCourse.teacherLogin == "no" && searchCourse.expired == "no" ||
					searchCourse.teacherLogin == "yes" && searchCourse.expired == "yes"
				) {
					res.render("class", { title: "Join Class", type: "join", message: "" });
				} else {
					if(searchCourse.teacherLogin == "yes" && searchCourse.expired == "no"){
						res.render("class", {
							title: "Join Class",
							type: "join",
							info: searchCourse,
							message: "",
						});
					}
				}
			}
			catch(error){
				console.log(error)
			}
		}
	} catch (error) {console.log(error)}
};

/**
 *
 *Create Class
 */
exports.createClass = async (req, res) => {
	res.render("class", { title: "Create a Class", type: "create", message: "" });
};

/**
 *
 *Activate Class
 */
exports.activateClass = async (req, res) => {
	res.render("class", {
		title: "Class Activation",
		type: "activate",
		message: "",
	});
};

/**
 *
 *Register Student
 */
exports.RegisterStudent = async (req, res) => {
	res.render("register", { title: "Register Student", type: "student" });
};


/**
 *
 *Get Register Teacher
 */
exports.RegisterTeacher = async (req, res) => {
	res.render("register", { title: "Register Teacher", type: "teacher" });
};

// POSTS
/**
 *
 *Post Register Student
 */
exports.PostRegisterStudent = async (req, res) => {
	try {
		lname = req.body.lname;
		const student = new StudentRegistration({
			timeId: Date.now(),
			fname: req.body.fname,
			mname: req.body.mname,
			lname: lname,
			date: req.body.dob,
			course: req.body.course,
			transfer: req.body.transfer,
			gender: req.body.gender,
			username: "MAT" + Date.now(),
			type: "student",
			password: await bcrypt.hash(lname.toLowerCase(), 10),
		});

		const setCookie = 1 * 60 * 1000;
		req.session.cookie.expires = new Date(Date.now() + setCookie);
		req.session.cookie.maxAge = setCookie;

		await student.save();

		res.render("register", {
			title: "Register Student",
			type: "student",
			message: "Student Registered Successfully!",
		});
	} catch (error) {
		res.render("register", {
			title: "Register Teacher",
			type: "teacher",
			message: error,
		});
	}
};

/**
 *
 *Post Register Teacher
 */
exports.PostRegisterTeacher = async (req, res) => {
	try {
		lname = req.body.lname;
		const teacher = new TeacherRegistration({
			timeId: Date.now(),
			fname: req.body.fname,
			mname: req.body.mname,
			lname: lname,
			date: req.body.dob,
			gender: req.body.gender,
			username: "TEA" + Date.now(),
			type: "teacher",
			password: await bcrypt.hash(lname.toLowerCase(), 10),
			role: req.body.role,
		});

		await teacher.save();

		res.render("register", {
			title: "Register Teacher",
			type: "teacher",
			message: "Teacher Registered Successfully!",
		});
	} catch (error) {
		res.render("register", {
			title: "Register Teacher",
			type: "teacher",
			message: error,
		});
	}
};

/**
 *
 *Post Create Class
 */
exports.PostCreateClass = async (req, res) => {
	try {
		let role = req.user.role;
		const checkIfClassExists = await Class.find({ course: role }).limit();
		if (checkIfClassExists.length !== 0) {
			try {
				let searchParameter = checkIfClassExists.find(
					(key) => key.course === req.user.role
				);
				if (searchParameter.teacherLogin == "no") {
					res.render("class", {
						title: "Create a Class",
						type: "create",
						message: `The class ${role} has been created earlier and is waiting for validation`,
					});
				} else {
					if (await Class.deleteOne({ _id: searchParameter._id })) {
						execCreateClass(req, res);
					}
				}
				// console.log(checkIfClassExists);
			} catch (error) {
				console.log(error);
			}
		} else {
			if (checkIfClassExists.length === 0) execCreateClass(req, res);
		}
	} catch (error) {
		res.render("class", {
			title: "Create a Class",
			type: "create",
			message: error,
		});
	}
};

/**
 *
 *Post Join Class
 */
exports.PostJoinClass = async (req, res) => {
	try {
		// console.log(req.body.class);
		// console.log(req.body.matricClassNo);
		// console.log(req.body.classPassword);

		if (typeof req.body.class == "undefined") {
			redirecttoJoinClass(req, res, "classPreference");
		} else {
			if (req.body.matricClassNo == "") {
				redirecttoJoinClass(req, res, "matricNumber");
			} else {
				if (req.body.classPassword == "") {
					redirecttoJoinClass(req, res, "classPassword");
				} else {
					let ClassPreference = req.body.class;
					let matricno = req.body.matricClassNo;
					let password = req.body.classPassword;
					validateandSendToClass(req, res, ClassPreference, matricno, password);
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
};

exports.sendToClass = async (req, res) => {
	try {
		let course = req.user.course || req.user.role;
		const classDetails = await ClassRegistration.find({
			course: course,
		});
		let searchTerm = classDetails.find(
			(searchC) => searchC.course === course
		);
		// console.log(searchTerm.classDuration);
		function getClassTime(duration, term) {
			if (term == "minutes") {
				const classtime = duration * 60 * 1000;
				return classtime;
			}

			if (term == "seconds") {
				const classtime = duration * 1000;
				return classtime;
			}
		}

		let roomId = req.params.room;
		if(roomId.length != "36"){
			res.render("utilities", { title: "Broken Class Link", type: "brokenLink" })
		}else{
			// let regno = searchTerm
			// const teacherDetails = await ClassRegistration.find({
			// 	course: course,
			// });
		// let classtime = getClassTime(searchTerm.classDuration, searchTerm.Durate);
		res.render("class", {
			title: "Class is Ongoing",
			type: "started",
			roomId: req.params.room,
			fname: req.user.fname,
			lname: req.user.lname,
			topic: searchTerm.topic,
			gender: req.user.gender,
			liveStream: searchTerm.LiveStream,
			joinType: req.user.type,
			course: searchTerm.course,
			teacher: searchTerm.teacher,
			classInfo: searchTerm.classInfo,
			documents: searchTerm.document,
			classTime: getClassTime(searchTerm.classDuration, searchTerm.Durate),
		});
		}
	} catch (error) {
		console.log(error);
	}
};


exports.expiredClass = async (req, res) => {
	res.render("utilities", { title: "Expired Class", type: "expired" });
};



exports.getClassStatus = async (req, res) => {
	try{
		const classData = await Class.find({
			course: req.user.role,
		}).limit();
		const searchAndValidateClass = classData.find(
			(classDetails) => classDetails.course === req.user.role
		);
		if (searchAndValidateClass.length !== 0) {
			const result = await Class.updateOne(
				{ _id: searchAndValidateClass._id },
				{ expired: "yes" }
			);
			result.n;
			result.nModified;
			if(result){
				res.send("success")
			}
		}
	}
	catch(error){
		console.log(error)
	}
}


exports.checkClassExpiry = async (req, res) => {
	try{
		let course = req.user.course || req.user.role;
		const classData = await Class.find({
			course: course,
		}).limit();
		const searchTerm = classData.find(
			(classDetails) => classDetails.course === course
		);

		if(searchTerm.expired == "yes"){
			res.send("expired")
		}else{
			res.send("not expired")
		}
	}
	catch(error){
		console.log(error)
	}
}


/**
 *
 *Post Join Class
 */
exports.PostActivateClass = async (req, res) => {
	// try {
	// 	res.render("class", { title: "Class is Ongoing", type: "started" })
	// } catch (error) {
	// 	console.log(error)
	// }
	getClassInfo();

	async function getClassInfo() {
		try {
			const classData = await Class.find({
				course: req.user.role,
			}).limit();
			if (classData) {
				try {
					const searchAndValidateClass = classData.find(
						(classDetails) => classDetails.course === req.user.role
					);
					if (searchAndValidateClass.length !== 0) {
						if (searchAndValidateClass.teacherLogin == "no") {
							try {
								if (searchAndValidateClass.teacherRegNo == req.body.username) {
									if (
										await bcrypt.compare(
											req.body.password,
											searchAndValidateClass.hashedPassword
										)
									) {
										const result = await Class.updateOne(
											{ _id: searchAndValidateClass._id },
											{ teacherLogin: "yes" }
										);
										result.n;
										result.nModified;
										res.render("class", {
											title: "Class Activation",
											type: "activate",
											message: "success",
										});
									} else {
										res.render("class", {
											title: "Class Activation",
											type: "activate",
											message: "Incorrect Password",
										});
									}
								} else {
									res.render("class", {
										title: "Class Activation",
										type: "activate",
										message: "Incorrect Registration No",
									});
								}
							} catch (error) {
								console.log(error);
							}
						} else {
							console.log("Already Activated");
						}
					} else {
						console.log("You have to create a class first!");
					}
				} catch (error) {
					console.log(error);
				}
			}
			// initializeClass(
			// 	passport,
			// 	(username) => classData.find((teacher) => teacher.teacherRegNo === username),
			// 	(id) => classData.find((teacher) => teacher.timeId === id)
			// );
		} catch (error) {
			console.log(error);
		}
	}
};

async function execCreateClass(req, res) {
	if (req.body.course == "") {
		res.render("class", {
			title: "Create a Class",
			type: "create",
			message: "Course field is Needed",
		});
	} else if (req.body.topic == "") {
		res.render("class", {
			title: "Create a Class",
			type: "create",
			message: "Topic Field is Needed",
		});
	} else if (req.body.classInfo == "") {
		res.render("class", {
			title: "Create a Class",
			type: "create",
			message: "Class Info Field is Needed",
		});
	} else if (typeof req.body.stream == "undefined") {
		res.render("class", {
			title: "Create a Class",
			type: "create",
			message: "You need to select Stream Option",
		});
	} else if (req.body.timeDurate == "") {
		res.render("class", {
			title: "Create a Class",
			type: "create",
			message: "Class Duration Field Needed",
		});
	} else if (typeof req.body.time == "undefined") {
		res.render("class", {
			title: "Create a Class",
			type: "create",
			message: "You need to select Time Duration Option",
		});
	} else if (req.files == null) {
		res.render("class", {
			title: "Create a Class",
			type: "create",
			message: "You need to select a document to upload",
		});
	} else {
		let role = req.user.role;
		const TeacherDetails = await TeacherRegistration.find({
			role: role,
		});

		const searchIfValidateClassCreation = TeacherDetails.find(
			(teacher) => teacher.role === req.user.role
		);

		if (searchIfValidateClassCreation.role === req.body.course) {
			function bin2hex(bytesLength) {
				let bin = crypto.randomBytes(bytesLength);
				return new Buffer(bin).toString("hex");
			}

			let imageUploadFile;
			let uploadPath;
			let newImageName;

			//     // if(req.files || Object.keys(req.files).length === 0){
			//     //     console.log("No files where uploaded.");
			//     // }else{

			imageUploadFile = req.files.image;
			newImageName = imageUploadFile.name;

			uploadPath =
				require("path").resolve("./") + "/public/pdfs/" + newImageName;

			imageUploadFile.mv(uploadPath, function (err) {
				if (err) return res.status(500).send(err);
			});

			//     // }
			let generatedPass = bin2hex(3);
			let teacher_fname = req.user.fname;
			let teacher_lname = req.user.lname;
			let gender = req.user.gender;

			function getTeacher(){
				if(gender == "female"){
					let teacher = `Mrs. ${teacher_fname} ${teacher_lname}`; 
					return teacher;
				}else{
					let teacher = `Mr. ${teacher_fname} ${teacher_lname}`; 
					return teacher;
				}
			}
			

			const registerClass = new ClassRegistration({
				timeId: Date.now(),
				course: req.body.course,
				topic: req.body.topic,
				classInfo: req.body.classInfo,
				LiveStream: req.body.stream,
				teacherLogin: "no",
				teacher: getTeacher(),
				teacherRegNo: req.user.username,
				classDuration: req.body.timeDurate,
				Durate: req.body.time,
				document: newImageName,
				password: generatedPass,
				hashedPassword: await bcrypt.hash(generatedPass, 10),
				link: `${uuidv4()}`,
				expired: "no",
			});

			await registerClass.save();

			res.render("class", {
				title: "Create a Class",
				type: "create",
				message: "success",
			});
		} else {
			res.render("class", {
				title: "Create a Class",
				type: "create",
				message: `You can only organize classes for the ${req.user.role} department!`,
			});
		}
	}
}

async function redirecttoJoinClass(req, res, type) {
	let course = req.user.course;
	let search = await ClassRegistration.find({ course: course }).limit();
	let searchCourse = await search.find((searchC) => searchC.course === course);

	try {
		if (typeof searchCourse.teacherLogin == "undefined") {
			res.render("class", { title: "Join Class", type: "join", message: "" });
		} else {
			if (type == "classPreference") {
				res.render("class", {
					title: "Join Class",
					type: "join",
					info: searchCourse,
					message: "Please select a class to join!",
				});
			}
			if (type == "matricNumber") {
				res.render("class", {
					title: "Join Class",
					type: "join",
					info: searchCourse,
					message: "Please input your Matric Number!",
				});
			}
			if (type == "classPassword") {
				res.render("class", {
					title: "Join Class",
					type: "join",
					info: searchCourse,
					message: "Please input the Class Password!",
				});
			}
		}
	} catch (error) {}
}

async function validateandSendToClass(req, res, Selection, matric, password) {
	try {
		let course = req.user.course;
		let search = await ClassRegistration.find({ course: course }).limit();
		let searchCourse = await search.find(
			(searchC) => searchC.course === course
		);
		const checkIfClassNotExpired = await Class.find({
			course: Selection,
		});
		let searchParameterClass = checkIfClassNotExpired.find(
			(key) => key.course === Selection
		);
		// console.log(searchParameter);
		if (searchParameterClass.length !== 0) {
			const checkIfMatricExists = await StudentRegistration.find({
				username: matric,
			}).limit();
			let searchParameterMatric = checkIfMatricExists.find(
				(key) => key.username === matric
			);
			if (typeof searchParameterMatric == "undefined") {
				res.render("class", {
					title: "Join Class",
					type: "join",
					info: searchCourse,
					message: "Incorrect Matric Number",
				});
			} else {
				if (
					await bcrypt.compare(password, searchParameterClass.hashedPassword)
				) {
					// console.log(classtime)
					res.redirect(`/class/${searchParameterClass.link}`);
				} else {
					res.render("class", {
						title: "Join Class",
						type: "join",
						info: searchCourse,
						message: "Incorrect Class Password",
					});
				}
			}
			// if(searchParameterMatric.length === 0){
			// 	res.render("class", { title: "Join Class", type: "join", message: "Incorrect Matric No." });
			// }
		} else {
			console.log("Error Occured!");
		}
	} catch (error) {
		console.log(error);
	}
}
