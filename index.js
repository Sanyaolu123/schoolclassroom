const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;
const router = require("./server/routes/route");
const classRouter = require("./server/routes/class");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");


// Connect to mongodb

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});



app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(fileUpload());
app.use(
	session({
		secret: "School Lab",
		resave: false,
		saveUninitialized: false
	})
);

app.use(cookieParser("SchoolLabSecure"));

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));


app.use("/", router)


const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);
app.use("/class", classRouter)

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

		// Send Number of Participants
		let participants = io.engine.clientsCount;
		io.to(roomId).emit("participants", participants)
		

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });

		socket.on('end', function(){
			socket.disconnect(0);
		})
  });
	let participants = io.engine.clientsCount;
	socket.on("disconnect", () => {
		io.to(roomId).emit("participants", participants)
	})
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
