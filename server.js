var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var port = 8080

server.listen(port, function () {
	console.log("Listening on: " + port);
	console.log("________________________");
});

io.on("connection", function (socket) {
	console.log("Connected ", socket.id);
	socket.on("changeRequest", changeRequestHandler);
	socket.on("disconnect", disconnectHandler);
}
);

function changeRequestHandler() {
	console.log("Change");
}
function disconnectHandler() {
	console.log("Disconnected");
}