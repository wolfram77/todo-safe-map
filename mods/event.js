/* @wolfram77 */
/* EVENT - manages event information */
/* db: _id, t, x, y, type, factor, details */

// required modules
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


// define
module.exports = function() {
	var o = new EventEmitter();

	
	// remove
	o.remove = function(req) {
		if(req.id) 
	};


	// prepare
	db.run('CREATE TABLE IF NOT EXISTS event(t INTEGER, x REAL, y REAL, type TEXT, factor REAL, details TEXT)');

	// ready
	console.log('event> ready!');
	return o;
};
