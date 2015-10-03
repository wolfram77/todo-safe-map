/* @wolfram77 */
/* ZED - general purpose module */
/* fn: */

// required modules
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


// define
module.exports = function() {
	var o = new EventEmitter();

	// arrange objects of same kind into arrays
	o.arrange = function(dst, src, ps) {
		ps = ps? ps : _.keys(src[0]);
    _.forEach(ps, function(p) {
      o.push(dst[p] = dst[p]||[], _.pluck(src, p));
    });
    return dst;
	};

	// scatter arrays into objects of same kind
	o.scatter = function(dst, src, ps) {
		ps = ps? ps : _.keys(src);
		for(var i=0; i<src.length; i++) {
			var obj = {};
			for(var p=0; p<ps.length; p++)
				obj[ps[p]] = src[ps[p]][i];
			dst.push(obj);
		}
		return dst;
	};

	// ready
	console.log('zed> ready!');
	return o;
};
