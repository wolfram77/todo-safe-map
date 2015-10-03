/* @wolfram77 */
/* DB - manages db operations */
/* fn: */

// required modules
var sqlite3 = require('sqlite3');
var _ = require('lodash');


// define
module.exports = function(z) {
	var o = new sqlite3.Database('data/data.db');

	// insert batch
	o.insert = function(tab, req) {
		var keys = z.gskeys(req);
		o.rbatch('INSERT INTO '+tab+'('+keys.join()+') VALUES ($'+keys.join(',$')+')', req);
	};

	// run batch
	o.rbatch = function(cmd, req) {
		var stmt = db.prepare(cmd);
		if(!_.isArray(req)) req = z.scatter([], req);
		for(var i=0; i<req.length; i++)
			stmt.run(z.krename({}, req[i], '$%i'));
	};

	// get batch
	o.gbatch = function(cmd, req, fn) {
		var stmt = db.prepare(cmd), res = [];
		if(!_.isArray(req)) req = z.scatter([], req);
		db.serialize(function() {
			for(var i=0; i<req.length; i++)
				stmt.all(z.krename({}, req[i], '$%i'), function(err, rows) {
					z.apush(res, rows);
				});
			db.run('PRAGMA no_op', function() {
				if(fn) fn(res);
			});
		});
	};

	// ready
	console.log('db> ready!');
	return o;
};
