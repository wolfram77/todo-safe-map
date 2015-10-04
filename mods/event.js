/* @wolfram77 */
/* EVENT - manages event information */
/* db: _id, t, x, y, type, factor, details */
/* fn:  */

// required modules
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


// define
module.exports = function(z, db, user) {
	var o = new EventEmitter();

	// get
	o.get = function(req, fn) {
		db.select('event', req, function(errs, rows) {
			if(fn) fn({'status': 'ok', 'res': z.gather({}, rows[0])});
		});
	};

	// create
	o.create = function(key, req, fn) {
		user.id(key, function(id) {
			if(id===null) {
				if(fn) fn({'status': 'err'});
				return;
			}
			req.id = _.now();
			db.insert('event', req, function(errs, rows) {
				if(errs[0]) {
					if(fn) fn({'status': 'err'});
					return;
				}
				if(fn) fn({'status': 'ok', 'res': req});
			});
		});
	};

	o.groupadd = function(req) {

	};


	// prepare
	db.create('event', ['id INTEGER %p', 'x %R', 'y %R', 'type %T', 'factor %r', 'details %t']);
	db.create('event_group', ['event %I', 'user %I', 'type %T', 'details %t']);
	db.create('event_contrib', ['event %I', 'user %I', 'type %T', 'details %t']);

	// ready
	console.log('event> ready!');
	return o;
};
