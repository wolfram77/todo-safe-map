/* @wolfram77 */
/* DB - manages db operations */
/* fn: batch */

// required modules
var sqlite3 = require('sqlite3');
var _ = require('lodash');


// define
module.exports = function(z) {
	var o = new sqlite3.Database('data/data.db');

	// batch execute
	// fn = (errs, res)
	o.batch = function(cmd, req, fn) {
		var stmt = db.prepare(cmd);
		db.serialize(function() {
			for(var i=0, errs=[], res=[]; i<req.length; i++)
				stmt.all(z.krename({}, req[i], '$%i'), function(err, rows) {
					if(err) errs[i] = err;
					if(rows) z.apush(res, rows);
				});
			db.run('PRAGMA no_op', function() {
				if(fn) fn(errs, res);
			});
		});
	};

	// ready
	console.log('db> ready!');
	return o;
};
