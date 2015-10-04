/* @wolfram77 */
/* INDEX - main js file */

// initialize
var app = angular.module('app', []);
var z = null, user = null, map = null;


// z module
var z = (function() {
	var o = {};

	// get input values
	o.ginpval = function(ids, fmt) {
		fmt = fmt || '%i';
		for(var i=0, vals={}; i<ids.length; i++)
			vals[ids[i]] = $(fmt.replace(/%i/g, ids[i])).val();
		return vals;
	};


	// set input values
	o.sinpval = function(vals, fmt) {
		fmt = fmt || '%i';
		for(var k in vals)
			$(fmt.replace(/%i/g, k)).val(vals[k]);
		return vals;
	};


	// gather objects of same kind into arrays
	o.gather = function(dst, src, ps) {
		if(src.length===0) return {};
		ps = ps? ps : _.keys(src[0]);
		_.forEach(ps, function(p) {
			o.apush(dst[p] = dst[p]||[], _.pluck(src, p));
		});
		return dst;
	};


	// scatter arrays into objects of same kind
	o.scatter = function(dst, src, ps) {
		ps = ps? ps : _.keys(src);
		if(ps.length===0) return [];
		for(var i=0,I=src[ps[0]].length; i<I; i++) {
			for(var p=0,P=ps.length,v={}; p<P; p++)
				v[ps[p]] = src[ps[p]][i];
			dst.push(v);
		}
		return dst;
	};


	// ready
	return o;
})();


// main controller
app.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	var o = $scope;
	o.events = [];
	o.user = {};
	o.a = false;

	// menu set
	o.mset = function(v)   {
		o.menu = v;
	};

	// menu is?
	o.mis = function(v) {
		return o.menu===v;
	};

	// menu class
	o.mcls = function(v) {
		return o.menu===v? 'active' : '';
	};

	// user signup
	o.usignup = function() {
		o.user = z.ginpval(['id', 'pass', 'name', 'age', 'type', 'sex', 'details'], '#su-%i');
		$.post('/i/user/signup', {'vals': o.user}, function(res) {
			if(res.status==='err') {
				Materialize.toast('sign up failed!', 3000, 'rounded');
				return;
			}
			Materialize.toast('sign up success!', 3000, 'rounded');
			$scope.$apply(function() {
				o.uidhash = CryptoJS.MD5(o.user.id).toString();
				$.cookie('id', o.user.id);
				o.a = true;
				o.menu = 0;
			});
		});
	};

	// user signin
	o.usignin = function() {
		o.user = z.ginpval(['id', 'pass'], '#si-%i');
		$.post('/i/user/get', {'flt': o.user}, function(res) {
			if(!res.res.id) {
				Materialize.toast('sign in failed!', 3000, 'rounded');
				return;
			}
			Materialize.toast('sign in success!', 3000, 'rounded');
			$scope.$apply(function() {
				o.user = z.scatter([], res.res)[0];
				o.uidhash = CryptoJS.MD5(o.user.id).toString();
				$.cookie('id', o.user.id);
				o.a = true;
				o.menu = 0;
			});
		});
	};

	// user signoff
	o.usignoff = function() {
		Materialize.toast('sign off success!', 3000, 'rounded');
		o.user = {};
		$.cookie('id', null);
		o.a = false;
		o.menu = 0;
	};

	o.uupdate0 = function() {
		z.sinpval(o.user, '#ud-%i');
		$('select').material_select();
	};

	// user update
	o.uupdate = function() {
		o.user = z.ginpval(['id', 'pass', 'name', 'age', 'type', 'sex', 'details'], '#ud-%i');
		$.post('/i/user/update', {'flt': {'id': o.user.id}, 'vals': o.user}, function(res) {
			if(res.status==='err') {
				Materialize.toast('update failed!', 3000, 'rounded');
				return;
			}
			Materialize.toast('update success!', 3000, 'rounded');
			$scope.$apply(function() {
				o.menu = 0;
			});
		});
	};

	// event create
	o.ecreate = function() {
		var ev = z.ginpval(['type', 'factor', 'details'], '#ev-%i');
		ev.id = _.now();
		map.loc(null, function(pos) {
			ev.x = pos.lng();
			ev.y = pos.lat();
			$.post('/i/event/create', {'vals': ev}, function(res) {
				if(res.status==='err') {
					Materialize.toast('event create failed!', 3000, 'rounded');
					return;
				}
				$.post('/i/event/groupadd', {'vals': {'event': ev.id, 'user': o.user.id, 'type': 'victim'}});
				Materialize.toast('event create success!', 3000, 'rounded');
				$scope.$apply(function() {
					o.menu = 0;
				});
			});
		});
	};

	// event get
	o.eget = function() {
		$.post('/i/event/groupget', {'flt': {'user': o.user.id}}, function(res) {
			if(!res.res.event) {
				$scope.$apply(function() {
					o.events = [];
				});
				return;
			}
			var evs = res.res.event;
			$.post('/i/event/get', {'flt': {'id': evs}}, function(res) {
				$scope.$apply(function() {
					o.events = z.scatter([], res.res);
				});
			});
		});
	};

	// event view
	o.eview = function(id) {
		$.post('/i/event/get', {'flt': {'id': id}}, function(res) {
			$scope.$apply(function() {
				o.event = z.scatter([], res.res);
			});
		});
		$.post('/i/event/groupget', {'flt': {'event': id}}, function(res) {
			$scope.$apply(function() {
				o.egroup = z.scatter([], res.res);
			});
		});
		$.post('/i/event/contribget', {'flt': {'event': id}}, function(res) {
			$scope.$apply(function() {
				o.econtrib = z.scatter([], res.res);
				z.sinpval({'user': o.user.id}, '#ec-%i');
			});
		});
		o.mset(6);
	};

	// event add group member
	o.egroupadd = function() {
		var eg = z.ginpval(['user', 'type', 'details'], '#eg-%i');
		eg.event = o.event[0].id;
		$.post('/i/event/groupadd', {'vals': eg}, function(res) {
			if(res.status==='err') Materialize.toast('add user failed!', 3000, 'rounded');
			else Materialize.toast('add user success!', 3000, 'rounded');
			o.eview(o.event[0].id);
		});
	};

	// event add contrib
	o.econtribadd = function() {
		var ec = z.ginpval(['user', 'type', 'details'], '#ec-%i');
		ec.event = o.event[0].id;
		$.post('/i/event/contribadd', {'vals': ec}, function(res) {
			if(res.status==='err') Materialize.toast('add contrib failed!', 3000, 'rounded');
			else Materialize.toast('add contrib success!', 3000, 'rounded');
			o.eview(o.event[0].id);
		});
	};
}]);


// map module
var Map = function(elem) {
	// create map
	var o = new google.maps.Map(document.getElementById(elem), {
		'center': new google.maps.LatLng(20, 6),
		'mapTypeId': google.maps.MapTypeId.HYBRID,
		'zoom': 3
	});
	// diamond marker
	var mdiamond = {
		path: 'M -5,0 0,-5 5,0 0,5 z',
		strokeColor: '#A00',
		fillColor: '#F00',
		fillOpacity: 0.5
	};
	// create pointer
	o.ptr = new google.maps.Marker({
		'position': o.getCenter(),
		'icon': mdiamond,
		'visible': false,
		'map': o
	});

	// get location
	o.loc = function(zoom, fn) {
		navigator.geolocation.getCurrentPosition(function(p) {
			pos = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
			o.ptr.setPosition(pos);
			o.ptr.setVisible(true);
			if(zoom!=null) {
				o.panTo(pos);
				if(zoom!=0) o.setZoom(zoom);
			}
			if(fn) fn(pos);
		}, function(err) {
			Materialize.toast('get location failed!', 3000, 'rounded');
			if(fn) fn(null);
		});
	};


	// ready!
	return o;
};


// set image sizes
var imgsize = function() {
	$('#user-logo').css('height', $('#user-logo').css('line-height'));
	$('header a.img').css('height', $('header a.img').css('line-height'));
};


// prepare
$(document).ready(function() {
	imgsize();
	$('[data-tooltip]').tooltip({'delay': 50});
	$('select').material_select();
	(map = Map('map')).loc(10);
	// var hash = CryptoJS.MD5("Message");
	req = {
		'id': {'>=': 0, '<': (new Date()).getTime()},
		'x': {'>=': -180.0, '<': 180.0},
		'y': {'>=': -90.0, '<': 90.0},
		'type': 'crime/muggle'
	};
	$.post('/event/get', req, function(res) {
		res = res.res;
		heatmapdata = [];
		for(var i=0; i<res.id.length; i++)
			heatmapdata[i] = {
				'location': new google.maps.LatLng(res.y[i], res.x[i]),
				'weight': 1.0
			};
			var heatmap = new google.maps.visualization.HeatmapLayer({
				'dissipating': false,
				'maxIntensity': 100,
				'data': heatmapdata
			});
			heatmap.setMap(map);
	});
});
