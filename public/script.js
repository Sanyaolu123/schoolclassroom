const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat_window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
let backBtn = document.querySelector(".header__back");
let participants = document.querySelector(".participants");



let messages = document.querySelector(".messages");
myVideo.muted = true;

if(StreamOption == "no"){
	document.querySelector(".header__back").style.display = "none";
	document.querySelector(".main__right").style.display = "flex";
	document.querySelector(".main__right").style.flex = "1";
	document.querySelector(".main__left").style.display = "none";
}

backBtn.addEventListener("click", () => {
	document.querySelector(".main__left").style.display = "flex";
	document.querySelector(".main__left").style.flex = "1";
	document.querySelector(".main__right").style.display = "none";
	document.querySelector(".header__back").style.display = "none";
});



showChat.addEventListener("click", () => {
	$(".classInfo").removeClass("visible").addClass("hidden");
	$(".participants").removeClass("visible").addClass("hidden");
	$(".documents").removeClass("visible").addClass("hidden");

	var element = document.getElementById("all_messages");
			var numberOfChildren = element.children.length
			if(numberOfChildren > 0){
				$(".m-place").addClass("hidden");
			}

	$(".main__chat_window").removeClass("hidden").addClass("visible");
	$(".main__message_container").removeClass("hidden").addClass("visible");
	$("#chat_message").removeClass("hidden").addClass("visible");
	document.querySelector(".main__right").style.display = "flex";
	document.querySelector(".main__right").style.flex = "1";
	document.querySelector(".main__left").style.display = "none";
	document.querySelector(".header__back").style.display = "block";
});

// const user = prompt("Enter your name");

var peer = new Peer(undefined, {
	path: "/peerjs",
	host: "/",
	port: "5000",
});



let myVideoStream;

var getUserMedia =
	navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia;

navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		myVideoStream = stream;
		if(StreamOption == "yes"){
			addVideoStream(myVideo, stream);
		}

		peer.on("call", (call) => {
			call.answer(stream);
			const video = document.createElement("video");

			call.on("stream", (userVideoStream) => {
				if(StreamOption == "yes"){
					addVideoStream(video, userVideoStream);
				}
			});
		});

		socket.on("user-connected", (userId) => {
			connectToNewUser(userId, stream);
		});



		document.addEventListener("keydown", (e) => {
			if (e.which === 13 && chatInputBox.value != "") {
				socket.emit("message", chatInputBox.value);
				chatInputBox.value = "";
			}
		});

		socket.on("createMessage", (message, userName) => {
			// console.log(msg);
			// let li = document.createElement("li");
			// li.innerHTML = msg;
			// all_messages.append(li);

			// if(type == "student"){
			// 	showMessage(fname, lname)
			// 	console.log(fname + " " + lname)
			// }else{
			// 	showMessage(fname, lname)
			// }

			// 	messages.innerHTML =
			// 	messages.innerHTML +
			// 	`<div class="message">
			//     <b><i class="far fa-user-circle"></i> <span>${
			//       userName === user ? "me" : userName

			//     }</span> </b>
			//     <span>${message}</span>
			// </div>`;

			if (gender_user == "male" && type_user == "teacher") {
				let userTeacherMa = sir + fname_user + " " + lname_user;
				messages.innerHTML =
					messages.innerHTML +
					`<div class="message">
					<b><i class="far fa-user-circle"></i> <span>${
						userName === userTeacherMa ? "me" : userName
					}</span> </b>
					<span>${message}</span>
			</div>`;
			var element = document.getElementById("all_messages");
			var numberOfChildren = element.children.length
			if(numberOfChildren > 0){
				$(".m-place").addClass("hidden");
			}
			}

			if (gender_user == "female" && type_user == "teacher") {
				let userTeacherFe = ma + fname_user + " " + lname_user;
			
				messages.innerHTML =
					messages.innerHTML +
					`<div class="message">
						<b><i class="far fa-user-circle"></i> <span>${
							userName === userTeacherFe ? "me" : userName
						}</span> </b>
						<span>${message}</span>
				</div>`;

				var element = document.getElementById("all_messages");
				var numberOfChildren = element.children.length
				if(numberOfChildren > 0){
					$(".m-place").addClass("hidden");
				}
			}
			if (type_user == "student") {
				let userStudent = fname_user + " " + lname_user;
				messages.innerHTML =
					messages.innerHTML +
					`<div class="message">
					<b><i class="far fa-user-circle"></i> <span>${
						userName === userStudent ? "me" : userName
					}</span> </b>
					<span>${message}</span>
			</div>`;
			var element = document.getElementById("all_messages");
			var numberOfChildren = element.children.length
			if(numberOfChildren > 0){
				$(".m-place").addClass("hidden");
			}
			}
			// else{
			// console.log(message)
			// }

			main__chat__window.scrollTop = main__chat__window.scrollHeight;
		});
	});

peer.on("call", function (call) {
	getUserMedia(
		{ video: true, audio: true },
		function (stream) {
			call.answer(stream); // Answer the call with an A/V stream.
			const video = document.createElement("video");
			call.on("stream", function (remoteStream) {
				if(StreamOption == "yes"){
					addVideoStream(video, remoteStream);
				}
			});
		},
		function (err) {
			console.log("Failed to get local stream", err);
		}
	);
});


// function checkParticipants() {
// function process(){
	socket.on("participants", (number) => {
		document.querySelector(".count").innerHTML = number;
	});
// }

// setInterval(process, 1000);
// }

// checkParticipants();

function setExpiry(user) {
	if (user == "teacher") {
		function checkExpiry() {
			let xhr = new XMLHttpRequest();
			let done = XMLHttpRequest.DONE;

			xhr.open("POST", "/checkclassexpiry", true);
			xhr.onload = () => {
				if (xhr.readyState === done) {
					if (xhr.status === 200) {
						let data = xhr.response;
						// console.log(data)
						if (data == "expired") {
							var socketend = io();
							if (socketend.emit("end")) {
								window.location.href = "/class/c/expired";
							}
							window.location.href = "/class/c/expired";
						} else {
							if (data == "not expired") {
								function close() {
									let xhr = new XMLHttpRequest();
									const done = XMLHttpRequest.DONE;

									xhr.open("POST", "/getclassstatus", true);
									xhr.onload = () => {
										if (xhr.readyState === done) {
											if (xhr.status === 200) {
												let data = xhr.response;
												if (data == "success") {
													var socketend = io();
													if (socketend.emit("end")) {
														window.location.href = "/class/c/expired";
													}
												}
												console.log(data);
											}
										}
									};
									xhr.send();
								}

								setTimeout(close, expirytime);
							}
						}
					}
				}
			};
			xhr.send();
		}
		setInterval(checkExpiry, 1000);
		//
	}

	if (user == "student") {
		function checkExpiry() {
			let xhr = new XMLHttpRequest();
			let done = XMLHttpRequest.DONE;

			xhr.open("POST", "/checkclassexpiry", true);
			xhr.onload = () => {
				if (xhr.readyState === done) {
					if (xhr.status === 200) {
						let data = xhr.response;
						// console.log(data)
						if (data == "expired") {
							var socketend = io();
							if (socketend.emit("end")) {
								window.location.href = "/class/c/expired";
							}
						}
					}
				}
			};
			xhr.send();
		}
		setInterval(checkExpiry, 1000);
	}
}

if (gender_user == "female" && type_user == "teacher") {
	try {
		let userTeacher = "Mrs. " + fname_user + " " + lname_user;
		peer.on("open", (id) => {
			socket.emit("join-room", ROOM_ID, id, userTeacher)
				setExpiry("teacher");
		});
	} catch (error) {
		console.log(error);
	}
}
if (type_user == "student") {
	let user = fname_user + " " + lname_user;
	peer.on("open", (id) => {
		socket.emit("join-room", ROOM_ID, id, user);
		setExpiry("student");
	});
}



if (gender_user == "male" && type_user == "teacher") {
	let userTeacherMale = "Mr. " + fname_user + " " + lname_user;
	peer.on("open", (id) => {
		socket.emit("join-room", ROOM_ID, id, userTeacherMale);
		setExpiry("teacher");
	});
}

// CHAT

const connectToNewUser = (userId, streams) => {
	var call = peer.call(userId, streams);
	// console.log(call);
	var video = document.createElement("video");
	call.on("stream", (userVideoStream) => {
		// console.log(userVideoStream);
		if(StreamOption == "yes"){
			addVideoStream(video, userVideoStream);
		}
	});
};

const addVideoStream = (videoEl, stream) => {
	videoEl.srcObject = stream;
	videoEl.addEventListener("loadedmetadata", () => {
		videoEl.play();
	});

	videoGrid.append(videoEl);
	let totalUsers = document.getElementsByTagName("video").length;
	if (totalUsers > 1) {
		for (let index = 0; index < totalUsers; index++) {
			document.getElementsByTagName("video")[index].style.width =
				100 / totalUsers + "%";
		}
	}
};

const playStop = () => {
	let enabled = myVideoStream.getVideoTracks()[0].enabled;
	if (enabled) {
		myVideoStream.getVideoTracks()[0].enabled = false;
		setPlayVideo();
	} else {
		setStopVideo();
		myVideoStream.getVideoTracks()[0].enabled = true;
	}
};

const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled;
	if (enabled) {
		myVideoStream.getAudioTracks()[0].enabled = false;
		setUnmuteButton();
	} else {
		setMuteButton();
		myVideoStream.getAudioTracks()[0].enabled = true;
	}
};

const setPlayVideo = () => {
	const html = `<i class="unmute fa fa-video-slash"></i>`;
	document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
	const html = `<i class=" fa fa-video"></i>`;
	document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
	const html = `<i class="unmute fa fa-microphone-slash"></i>`;
	document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
	const html = `<i class="fa fa-microphone"></i>`;
	document.getElementById("muteButton").innerHTML = html;
};

const inviteButton = document.querySelector("#inviteButton");
inviteButton.addEventListener("click", (e) => {
	prompt(
		"Copy this link and send it to people you want to meet with",
		window.location.href
	);
});
