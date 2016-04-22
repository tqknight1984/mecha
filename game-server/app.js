var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo-websocket');

// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useDict : true,
			useProtobuf : true
		});
});

app.configure('production|development','gate', function() {
	app.set('connectorConfig', {
		connector: pomelo.connectors.hybridconnector,
		useDict: true,
		useProtobuf : true
	});
});

// app configure
app.configure('production|development', function() {
	// route configures
	app.route('chat', routeUtil.chat);

	// filter configures
	app.filter(pomelo.timeout());
});

// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});

//filter
var abuseFilter = require('./app/servers/chat/filter/abuseFilter');
app.configure('production|development', 'chat', function() {
	app.filter(abuseFilter());
});

//route  rpc
console.log("app==================> begin");
var router = function(routeParam, msg, context, cb) {
	console.log("app============call function======> router()");
	var timeServers = app.getServersByType('time');
	var id = timeServers[routeParam % timeServers.length].id;
	cb(null, id);
}

app.route('time', router);
console.log("app==================> end");


//component
var helloWorld = require('./app/components/HelloWorld');
app.configure('production|development', 'master', function() {
	app.load(helloWorld, {interval: 5000});
});

//module
var timeReport = require('./app/modules/timeReport');
app.registerAdmin(timeReport, {app: app});