const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByIdentification, getUserByID) {
	const authenticateUser = async (username, password, done) => {
		const user = getUserByIdentification(username);

		if (user == null) {
			return done(null, false, { message: "Username Incorrect" });
		}

		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Password Incorrect" });
			}
		} catch (error) {
			return done(error);
		}
	};

	passport.use('local-authenticate', new LocalStrategy({ usernameField: "username" }, authenticateUser));
	passport.serializeUser((user, done) => done(null, user.timeId));
	passport.deserializeUser((id, done) => {
		return done(null, getUserByID(id));
	});
}




module.exports = initialize;

