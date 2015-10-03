/* @wolfram77 */
/* USER - manages user information */
/* db: id, pass, type, score, name, age, sex, phone, details */

// required modules
var EventEmitter = require('events').EventEmitter;


// define
module.exports = function(z, db) {
	var o = new EventEmitter();


	// prepare
	db.run(z.mreplace('CREATE TABLE IF NOT EXISTS user(id %t, pass %t, type %t, score %iz, name %t, age %i, sex %t, phone %tz, details %tz', {
		'%t': 'AS TEXT NOT NULL',
		'%tz': 'AS TEXT DEFAULT \'\'',
		
	}));

	// ready
	console.log('user> ready!');
	return o;
};
