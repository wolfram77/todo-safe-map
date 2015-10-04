/* @wolfram77 */
/* USER - manages user information */
/* db: id, pass, type, score, name, age, sex, phone, details */

// required modules
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


// define
module.exports = function(z, db) {
	var o = new EventEmitter();

	// add
	o.add = function(req, fn) {
		if(_.isArray(req.id)) req = z.scatter([], req);
		db.insert('user', req, fn);
	};

	// logoff
	o.logoff = function(req) {
		if(req.id) db.run('DELECT ');
	};

	// login
	o.login = function(req) {
		db.get('SELECT ip,pass FROM user WHERE ');
	};


	// prepare
	db.create('user', ['id TEXT %p', 'pass %T', 'type %T', 'score %i', 'name %T', 'age %I', 'sex %T', 'phone %t', 'details %t']);
	db.create('user_login', ['id INTEGER %p', 'user %T']);


	// ready
	console.log('user> ready!');
	return o;
};
