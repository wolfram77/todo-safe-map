/* @wolfram77 */
/* DB - manages db operations */
/* fn: */

// required modules
var sqlite3 = require('sqlite3');


// define
module.exports = function() {
	var o = new sqlite3.Database('data/data.db');

	// data length
	var dlen = function(data) {
		for(var k in data)
			return data[k].length;
	};

	// run batch
	o.batch = function(cmd, data) {
		var stmt = db.prepare(cmd);
		for(var i=0,I=dlen(data); i<I; i++)
			stmt.run();
	};


	// ready
	console.log('db> ready!');
	return o;
};
