/* @wolfram77 */
/* DB - manages db operations */
/* fn: */

// required modules
var sqlite3 = require('sqlite3');


// define
module.exports = function(z) {
	var o = new sqlite3.Database('data/data.db');

	// insert batch
	o.insert = function() {

	};

	// run batch
	o.batch = function(cmd, data) {
		var stmt = db.prepare(cmd);
		if(typeof data==='object') data = z.scatter([], data);
		for(var i=0,I=dlen(data); i<I; i++)
			stmt.run(z.krename({}, data[i], '$%s'));
	};

	// ready
	console.log('db> ready!');
	return o;
};
