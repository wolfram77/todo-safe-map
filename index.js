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


// http interface
app.all('/', function(req, res) {
	res.sendFile(__dirname+'/assets/index.html');
});

// static dir
app.use(express.static(__dirname+'/assets'));


// start server
var server = app.listen(80, function() {
	console.log(':safemap: started!');
});
