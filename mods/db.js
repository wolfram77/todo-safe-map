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
	o.filter = function(req) {
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
	o.batch = function(cmds, params, fn) {
		var errs = [], res = [];
		o.serialize(function() {
			for(var c=0; c<cmds.length; c++) {
				console.log(cmds[c]);
				console.log(params[c]);
				o.all(cmds[c], params[c], function(err, rows) {
					if(err) errs[c] = err;
					if(rows) res[c] = rows;
				});
			}
			o.run('PRAGMA no_op', function() {
				if(fn) fn(errs, res);
			});
		});
	};

	// create table
	o.create = function(tab, req, end) {
		var f = [], ke = end || '';
		for(var i=0; i<req.length; i++)
			f.push(o.expand(req[i]));
		o.run('CREATE TABLE IF NOT EXISTS '+tab+'('+f.join()+')'+ke);
	};

	// drop table
	o.drop = function(tab) {
		o.run('DROP TABLE IF EXISTS '+tab);
	};

	// insert rows
	o.insert = function(tab, req, fn) {
		var cmds = [], params = [];
		req = _.isArray(req)? req : [req];
		for(var r=0; r<req.length; r++) {
			var keys = _.keys(req[r]);
			cmds.push('INSERT INTO '+tab+'('+keys.join()+') VALUES ('+z.fjoin(keys, '$%i')+')');
			params.push(z.krename({}, req[r], '$%i'));
		}
		o.batch(cmds, params, fn);
	};

	// delete rows
	o.delete = function(tab, req, fn) {
		req = _.isArray(req)? req : [req];
		for(var r=0; r<req.length; r++) {
			var flt = filter(req[r]);
			cmds.push('DELETE FROM '+tab+flt.cmd);
			params.push(flt.params);
		}
		o.batch(cmds, params, fn);
	};

	// select rows
	o.select = function(tab, req, fn) {
		req = _.isArray(req)? req : [req];
		for(var r=0; r<req.length; r++) {
			var flt = filter(req[r]);
			cmds.push('SELECT * FROM '+tab+flt.cmd);
			params.push(flt.params);
		}
		o.batch(cmds, params, fn);
	};

	// update rows
	o.update = function(tab, req, fn) {
		req = _.isArray(req)? req : [req];
		for(var r=0; r<req.length; r++) {
			var cmd = '', param = [];
			for(var sk in req[r].set) {
				cmd += sk+'=?, ';
				param.push(req[r].set[sk]);
			}
			cmd = cmd.substring(0, cmd.length-2);
			var flt = filter(req[r].where);
			cmds.push('UPDATE '+tab+' SET '+cmd+flt.cmd);
			z.apush(param, flt.params);
			params.push(param);
		}
		o.batch(cmds, params, fn);
	};

	// ready
	console.log('db> ready!');
	return o;
};
