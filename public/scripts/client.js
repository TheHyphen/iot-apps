$(function () {
	$start = $("button#start");
	$stop = $("button#stop");
	$error = $("div#error");
	$interval = $("input#rate");
	$statusText = $("#status-text");
	$statusImg = $("#status-image");
	$current = $("p#current");
	$clients = $("#clients");

	var intId;
	var clientId;
	var clients = [];
	var connections = [];

	// Establishing Sockets and Peers
	var socket = io('/client');
	var peer = new Peer({ path: '/rtc', port: location.port, host: location.host.replace(":" + location.port, "") });

	// Socket Events
	socket.on('remote:ready', function (data) {
		clients.push(data.id);
		refreshClients();
		var conn = peer.connect(data.id);
		connections.push({ id: data.id, conn: conn });
		console.log("Remote added: ");
		console.log(data.id);
	});

	socket.on('remote:left', function (data) {
		console.log(data);
		removeClient(data.id);
		refreshClients();
	});


	// Button Events
	$start.click(function (e) {
		e.preventDefault();
		$start.prop('disabled', true);
		var interval = $interval.val();
		intId = setInterval(function () {
			var current = getRand();
			setCurrent(current);
			sendToAll(current);
		}, interval);
		setStatus(true);
	});

	$stop.click(function (e) {
		e.preventDefault();
		$start.prop('disabled', false);
		setStatus(false);
		setCurrent("None");
		clearInterval(intId);
	});

	// Utilities
	function getRand() {
		return Math.floor((Math.random() * 100) + 1);
	}

	function setCurrent(val) {
		$current.html(val);
	}

	function setStatus(bool) {
		if (bool) {
			$statusText.html("Streaming a number every " + $interval.val() + "ms");
			$statusImg.html("<img src='/public/img/radio.gif' height='14px'>");
		} else {
			$statusText.html("Not streaming now");
			$statusImg.html("<i class='glyphicon glyphicon-remove text-danger'></i>");
		}
	}

	function refreshClients() {
		$clients.html("");
		for (var i = 0; i < clients.length; i++) {
			$clients.append("<li class='list-group-item' data-client-id='" + clients[i] + "'>" + clients[i] + "</li>");
		}
		$("#clients-count").html(clients.length);
	}

	function removeClient(id) {
		clients.splice(clients.indexOf(id), 1);
		for (var i = 0; i < connections.length; i++) {
			if(connections[i].id == id){
				connections.splice(i,1);
				break;
			}
		}
	}

	function sendToAll(current) {
		console.log("Sending to: " + connections.length + " connections");
		var length = connections.length;
		for (var i = 0; i < length; i++) {
			connections[i].conn.send({ n: current });
		}
	}

});

