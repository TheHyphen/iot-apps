$(function () {

	var chart = new SmoothieChart(),
		canvas = document.getElementById('chart'),
		series = new TimeSeries();
	chart.addTimeSeries(series, { lineWidth: 2, strokeStyle: '#00ff00' });
	chart.streamTo(canvas,1000);

	var $id = $("#id");
	var $received = $("#received");

	var socket = io('/remote');

	// Peer Events
	var peer = new Peer({port: location.port, path: '/rtc', host: location.host.replace(":" + location.port, "")});
	
	peer.on('open',function (id) {
		console.log(id);
		$id.html(id);
		socket.emit('remote:ready',{id:id});
	});

	// Connection by Client
	peer.on('connection',function (conn) {
		// Receiving Data
		conn.on('data',function (data) {
			$received.html(data.n);
			series.append(new Date()
			.getTime(), data.n);
		});
	})


});

