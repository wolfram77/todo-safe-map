/* @wolfram77 */
/* INDEX - main module, creates the server */
/* run: "node index" */

// required modules
var fs = require('fs');
var readline = require('readline');
var express = require('express');
var bodyParser = require('body-parser');


// start express
var app = express();
app.use(bodyParser.urlencoded({'extended': true}));
app.use(bodyParser.json());

// start mods
var z = require('./mods/zed')();
var db = require('./mods/db')(z);
var user = require('./mods/user')(z, db);
var event = require('./mods/event')(z, db, user);


// root page
app.all('/', function(req, res) {
	res.sendFile(__dirname+'/assets/index.html');
});
// user interface
app.all('/i/user/signup', function(req, res) {
	var freq = req.body;
	user.signup(freq, function(fres) {
		res.send(fres);
	});
});
app.all('/i/user/signoff', function(req, res) {
	var freq = req.body;
	user.signoff(freq, function(fres) {
		res.send(fres);
	});
});
app.all('/i/user/signin', function(req, res) {
	var freq = req.body;
	user.signin(freq, function(fres) {
		res.send(fres);
	});
});
app.all('/i/user/update', function(req, res) {
	var freq = req.body;
	user.update(freq.key, freq.req, function(fres) {
		res.send(fres);
	});
});
app.all('/i/event/get', function(req, res) {
	var freq = req.body;
	event.get(freq, function(fres) {
		res.send(fres);
	});
});

// static dir
app.use(express.static(__dirname+'/assets'));


// sample data
var sampledata = function() {
	var id = 0;
	var datard = readline.createInterface({'input': fs.createReadStream('data/data.csv')});
	console.log('sample insert');
	datard.on('line', function(line) {
		p = line.split(',');
		db.insert('event', {'id': id++, 'x': p[1], 'y': p[0], 'type': 'crime/muggle', 'factor': 1.0});
	});
};

// start server
var server = app.listen(80, function() {
	console.log('safemap>> ready!');
});
