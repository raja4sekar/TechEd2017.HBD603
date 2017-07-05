/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var xsjs = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port = process.env.PORT || 3000;
var express = require("express");
var server = require("http").createServer();
var chatServer = require("./chatServer");

var app = express();
app.use("/node/chat", chatServer(server));

var options = {
	anonymous: true, // remove to authenticate calls
	redirectUrl: "/index.xsjs"
};

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({
		hana: {
			tag: "hana"
		}
	}));
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
var xsjsApp = xsjs(options);
app.use(xsjsApp);
server.on("request", app);
server.listen(port, function() {
	console.log("HTTP Server: " + server.address().port);
});