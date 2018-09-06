var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = 8080

io.on('connection', function(socket){
	console.log("Connected");
	socket.on('change', function () {
		console.log("Change");
	});
	socket.on('disconnect', function () {
		console.log("Disconnected");
	});
});

server.listen(port, function() {
	console.log('Listening on: '+ port);
	console.log('________________________');
});