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
	var expand = function(cmd) {
		return z.mreplace(cmd, {
			'%I': 'INTEGER NOT NULL',
			'%i': 'INTEGER DEFAULT 0',
			'%R': 'REAL NOT NULL',
			'%r': 'REAL DEFAULT 0',
			'%T': 'TEXT NOT NULL',
			'%t': 'TEXT DEFAULT \'\'',
			'%B': 'BLOB NOT NULL',
			'%b': 'BLOB',
			'%p': 'PRIMARY KEY'
		});
	};

	// create filter (where part)
	var filter = function(req) {
		var cmd = '', p = [];
		for(var k in req) {
			var v = req[k], tv = typeof v, f = k;
			if(tv==='number' || tv==='string') {
				f = k+(k.search(/[><=:%#]/g)==-1? ' =' : '');
				f = z.mreplace(f, {':': ' NOT', '%': ' LIKE', '#': ' REGEXP'});
				cmd += ' AND '+f+' ?';
				p.push(v);
				continue;
			}
			if(_.isArray(v)) {
				cmd += ' AND '+f+' IN ('+z.array([], v.length, '?').join()+')';
				z.apush(p, v);
			}
			else for(var ck in v) {
				cmd += ' AND '+f+ck+'?';
				p.push(v[ck]);
			}
		}
		cmd = cmd.length==0? cmd : ' WHERE'+cmd.substring(4);
		return {'cmd': cmd, 'params': p};
	};

	// batch execute
	// fn = (errs, res)
	o.batch = function(cmd, req, fn) {
		var stmt = o.prepare(cmd);
		o.serialize(function() {
			for(var i=0, errs=[], res=[]; i<req.length; i++)
				stmt.all(z.krename({}, req[i], '$%i'), function(err, rows) {
					if(err) errs[i] = err;
					if(rows) res[i] = rows;
				});
			o.run('PRAGMA no_op', function() {
				if(fn) fn(errs, res);
			});
		});
	};

	// create
	o.create = function(tab, req, end) {
		end = end || '';
		var f = [];
		for(var i=0; i<req.length; i++)
			f.push(expand(req[i]));
		o.run('CREATE TABLE IF NOT EXISTS '+tab+'('+f.join()+')'+end);
	};

	// insert
	o.insert = function(tab, req, fn) {
		req = _.isArray(req)? req : [req];
		var keys = _.keys(req);
		o.batch('INSERT INTO '+tab+'('+keys.join()+') VALUES ('+z.array([], keys.length, '?').join()+')', req, fn);
	};


	// ready
	console.log('db> ready!');
	return o;
};
