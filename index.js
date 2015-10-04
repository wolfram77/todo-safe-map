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
// db interface
app.all('/i/db/expand', function(req, res) {
	var p = req.body;
	res.send({'status': 'ok', 'res': db.expand(p.cmd)});
});
app.all('/i/db/filter', function(req, res) {
	var p = req.body;
	res.send({'status': 'ok', 'res': db.filter(p.flt)});
});
app.all('/i/db/batch', function(req, res) {
	var p = req.body;
	db.batch(p.stmts, function(errs, grows) {
		res.send({'status': 'ok', 'res': {'errs': errs, 'grows': grows}});
	});
});
app.all('/i/db/create', function(req, res) {
	var p = req.body;
	db.create(p.tab, p.flds, p.sfx);
	res.send({'status': 'ok'});
});
app.all('/i/db/drop', function(req, res) {
	var p = req.body;
	db.drop(p.tab);
	res.send({'status': 'ok'});
});
app.all('/i/db/insert', function(req, res) {
	var p = req.body;
	db.insert(p.tab, p.gvals, function(errs, grows) {
		res.send({'status': 'ok', 'res': {'errs': errs, 'grows': grows}});
	});
});
app.all('/i/db/delete', function(req, res) {
	var p = req.body;
	db.delete(p.tab, p.flts, function(errs, grows) {
		res.send({'status': 'ok', 'res': {'errs': errs, 'grows': grows}});
	});
});
app.all('/i/db/select', function(req, res) {
	var p = req.body;
	db.select(p.tab, p.flts, function(errs, grows) {
		res.send({'status': 'ok', 'res': {'errs': errs, 'grows': grows}});
	});
});
app.all('/i/db/update', function(req, res) {
	var p = req.body;
	db.update(p.tab, p.acts, function(errs, grows) {
		res.send({'status': 'ok', 'res': {'errs': errs, 'grows': grows}});
	});
});
// user interface
app.all('/i/user/signup', function(req, res) {
	var p = req.body;
	user.signup(p.vals, function(q) {
		res.send(q);
	});
});
app.all('/i/user/signoff', function(req, res) {
	var p = req.body;
	user.signoff(p.key, function(q) {
		res.send(q);
	});
});
app.all('/i/user/signin', function(req, res) {
	var p = req.body;
	user.signin(p.req, function(q) {
		res.send(q);
	});
});
app.all('/i/user/get', function(req, res) {
	var p = req.body;
	user.get(p.flt, function(q) {
		res.send(q);
	});
});
app.all('/i/user/update', function(req, res) {
	var p = req.body;
	user.update(p.flt, p.vals, function(q) {
		res.send(q);
	});
});
// event interface
app.all('/i/event/get', function(req, res) {
	var p = req.body;
	event.get(p.flt, function(q) {
		res.send(q);
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
