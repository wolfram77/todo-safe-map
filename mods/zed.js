/* @wolfram77 */
/* ZED - general purpose module */
/* fn: apush, arrange, scatter */

// required modules
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


// define
module.exports = function() {
	var o = new EventEmitter();

	// push items from source array
	o.apush = function(dst, src) {
		Array.prototype.push.apply(dst, src);
		return dst;
	};

	// formatted join
	o.fjoin = function(src, fmt, sep) {
		console.log(fmt);
		for(var i=0,I=src.length,dst=''; i<I; i++)
			dst += fmt.replace(/%i/g, src[i]) + (i===I-1? '' : sep||',');
		return dst;
	};

	// multiple replace
	o.mreplace = function(src, map) {
		var re = new RegExp(_.keys(map).join("|"), "g");
		return src.replace(re, function(m) { return map[m]; });
	};

	// rename keys of object
	o.krename = function(dst, src, fmt) {
		if(typeof fmt === 'string') for(var k in src)
			dst[fmt.replace(/%i/g, k)] = src[k];
		else for(var k in src)
			dst[fmt[k]] = src[k];
		return dst;
	};

	// get keys in gathered/scattered data
	o.gskeys = function(src) {
		return _.isArray(src)? _.keys(src[0]) : _.keys(src);
	};

	// get length in gathered/scattered data
	o.gslen = function(src) {
		return _.isArray(src)? src.length : src[_.keys(src)[0]].length;
	};

	// gather objects of same kind into arrays
	o.gather = function(dst, src, ps) {
		ps = ps? ps : _.keys(src[0]);
		_.forEach(ps, function(p) {
			o.apush(dst[p] = dst[p]||[], _.pluck(src, p));
		});
		return dst;
	};

	// scatter arrays into objects of same kind
	o.scatter = function(dst, src, ps) {
		ps = ps? ps : _.keys(src);
		for(var i=0,I=src[ps[0]].length; i<I; i++) {
			for(var p=0,P=ps.length,v={}; p<P; p++)
				v[ps[p]] = src[ps[p]][i];
			dst.push(v);
		}
		return dst;
	};

	// ready
	console.log('zed> ready!');
	return o;
};
