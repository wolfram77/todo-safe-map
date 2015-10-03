/* @wolfram77 */
/* DB - manages db operations */
/* fn: expand, batch */

// required modules
var sqlite3 = require('sqlite3');
var _ = require('lodash');


// define
module.exports = function(z) {
	var o = new sqlite3.Database('data/data.db');

	// expand % abbreviations
	o.expand = function(cmd) {
		return z.mreplace(cmd, {
			'%i': 'INTEGER NOT NULL',
			'%iz': 'INTEGER DEFAULT 0',
			'%r': 'REAL NOT NULL',
			'%rz': 'REAL DEFAULT 0',
			'%t': 'TEXT NOT NULL',
			'%tz': 'TEXT DEFAULT \'\'',
			'%b': 'BLOB NOT NULL',
			'%bz': 'BLOB'
		});
	};

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
