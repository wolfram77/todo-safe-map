/* @wolfram77 */
/* USER - manages user information */
/* db: id, pass, type, score, name, age, sex, phone, details */

// required modules
var EventEmitter = require('events').EventEmitter;


// define
module.exports = function(db) {
	var o = new EventEmitter();

	// add (multiple)
	// req = [{id, pass, ...}]
	o.add = function(req) {
		db.batch();
	};

	// ready
	console.log('user> ready!');
	return o;
};
