/* @wolfram77 */
/* INDEX - main module, creates the server */
/* run: "node index" */

// required modules
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


// http interface
app.all('/', function(req, res) {
	res.sendFile(__dirname+'/assets/index.html');
});
app.all('/user/add', function(req, res) {
	user.add(req, function(errs, rows) {
		res.send({'errs': errs, 'rows': rows});
	});
});

// static dir
app.use(express.static(__dirname+'/assets'));


// start server
var server = app.listen(80, function() {
	console.log(':safemap: started!');
	var gathered = {
		'id': [0, 1, 2, 3],
		'name': ['a', 'b', 'c', 'd']
	};
	var scattered = z.scatter([], gathered);
	console.log(z.mreplace('%s a %d', {'%s': 'name', '%d': 'place'}));
});
