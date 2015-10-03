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


// http interface
app.all('/', function(req, res) {
	res.sendFile(__dirname+'/assets/index.html');
});

// static dir
app.use(express.static(__dirname+'/assets'));


// start server
var server = app.listen(80, function() {
	console.log(':safemap: started!');
	var arranged = {
		'id': [0, 1, 2, 3],
		'name': ['a', 'b', 'c', 'd']
	};
	var krenamed = z.krename({}, arranged, '$%s');
	console.log('krenamed = %j', krenamed);
});
