var dispatcher = require('../../../util/dispatcher');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.queryEntry = function(msg, session, next) {
	console.log("queryEntry");
	var uid = msg.uid;
	if(!uid) {
		next(null, {
			code: 500
		});
		return;
	}
	// get all connectors
	var connectors = this.app.getServersByType('connector');
	if(!connectors || connectors.length === 0) {
		next(null, {
			code: 500
		});
		return;
	}
	// select connector
	var res = dispatcher.dispatch(uid, connectors);
	next(null, {
		code: 200,
		host: res.host,
		port: res.clientPort
	});

	console.log("gat a rpc test");
	var routeParam = Math.floor(Math.random()*10);
	this.app.rpc.time.timeRemote.getCurrentTime(routeParam, "arg111", "arg222",  function(hour, min, sec) {
		// ...
		console.log("gete==========rpc test call back========>"+hour+"|"+min+"|"+sec);
	});


};




