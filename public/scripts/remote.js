$(function () {

	var chartContainer = $("#canvas-container");
	var canvas = $("#chart");
	refresh();
	var chart = new SmoothieChart(),
		series = new TimeSeries();
	chart.addTimeSeries(series, { lineWidth: 2, strokeStyle: '#00ff00' });
	chart.streamTo(canvas.get(0),1000);

	var browser = true;

	var $id = $("#id");
	var $received = $("#received");

	var socket = io('/remote');

	// Peer Events
	var peer = new Peer({port: location.port, path: '/rtc', host: location.host.replace(":" + location.port, "")});

	// Handling Browser Incompatibiliy
	peer.on('error',function (err) {
		if(err.type == 'browser-incompatible'){
			browser = false;
			$("#browser").html("<div class='alert alert-danger' role='alert'>This browser is incompatible. Check <a href='http://iswebrtcready.appear.in/'>compatibiliy</a>.</div>");
		}
		else
			$("#browser").html("<div class='alert alert-danger' role='alert'>An error occured: "+ err.type +".</div>");
	});

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

	// Event registration
	$(window).resize(refresh);

	// Refresh canvas
	function refresh() {
		canvas.attr('width',chartContainer.width() * 0.9);
	}


});

