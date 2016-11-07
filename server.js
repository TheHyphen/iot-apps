var express = require('express');
var app = express();
var socketio = require('socket.io');
var peer = require('peer');
var PeerServer = peer.ExpressPeerServer;

app.set('view engine', 'pug');
app.set('views', __dirname + "/views/");

app.use(express.static(__dirname));

var server = app.listen(process.env.PORT || 3000, function () {
	console.log("Listening...");
});

// Two Basic Routes
app.get('/', function (req, res, next) {
	res.render('client');
});

app.get('/remote', function (req, res, next) {
	res.render('remote');
});

// Sockets and PeerJS
var io = socketio(server);
app.use('/rtc', PeerServer(server, { debug: true }));

var clientIo = io.of('/client');
var remoteIo = io.of('/remote');

clientIo.on('connection', function (socket) {
	socket.on('disconnect', function () {
		console.log("Disconnected: SocketIO");
		io.emit('remote:remove');
	});
});

remoteIo.on('connection', function (socket) {
	var peerId;
	socket.on('remote:ready', function (data) {
		peerId = data.id;
		clientIo.emit('remote:ready', data);
	});

	socket.on('disconnect', function () {
		clientIo.emit('remote:left',{id: peerId});
		console.log("Disconnected: Remote Socket. Peer ID: " + peerId);
	});
});

