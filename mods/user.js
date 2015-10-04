/* @wolfram77 */
/* USER - manages user information */
/* db: id, pass, type, score, name, age, sex, phone, details */
/* fn: signup, signoff, signin, id, update */

// required modules
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


// define
module.exports = function(z, db) {
	var o = new EventEmitter();

	// sign up
	o.signup = function(req, fn) {
		db.insert('user', req, function(errs, rows) {
			if(fn) fn({'status': (errs[0]? 'err': 'ok'), 'res': req});
		});
	};

	// sign off
	o.signoff = function(key, fn) {
		if(typeof id === 'string') db.delete('user_signin', {'user': key});
		else db.delete('user_signin', {'id': key});
		if(fn) fn({'status': 'ok'});
	};

	// sign in
	o.signin = function(req, fn) {
		o.signoff(req.id);
		db.select('user', {'id': req.id, 'pass': req.pass}, function(errs, rows) {
			if(rows[0].length!==1) {
				if(fn) fn({'status': 'err'});
				return;
			}
			var res = {'id': _.now(), 'user': req.id};
			db.insert('user_signin', res);
			if(fn) fn({'status': 'ok', 'res': res});
		});
	};

	// get id from key
	o.id = function(key, fn) {
		db.select('user_signin', {'id': key}, function(err, rows) {
			if(rows[0].length!==1) { if(fn) fn(null); }
			else if(fn) fn(rows[0].user);
		});
	};

	// update
	o.update = function(key, req, fn) {
		o.id(key, function(id) {
			if(id===null) { if(fn) fn({'status': 'err'}); }
			else db.update('user', {'where': {'id': id}, 'set': req}, function(errs, rows) {
				if(fn) fn({'status': (errs[0]? 'err': 'ok')});
			});
		});
	};

	
	// prepare
	db.create('user', ['id TEXT %p', 'pass %T', 'type %T', 'score %i', 'name %T', 'age %I', 'sex %T', 'phone %t', 'details %t']);
	db.create('user_login', ['id INTEGER %p', 'user %T']);

	// ready
	console.log('user> ready!');
	return o;
};
