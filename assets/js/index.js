/* @wolfram77 */
/* INDEX - main js file */

// initialize
var app = angular.module('app', []);
var map = null;


// value controller
app.controller('valCtrl', ['$scope', '$http', function($scope, $http) {
  var o = $scope;

  // set
  o.set = function(v)   {
    o.value = v;
  };

  // get value
  o.get = function() {
    return o.value;
  };

  // is?
  o.is = function(v) {
    return o.value === v;
  };

  // load
  o.load = function(req, gap) {
    if(gap) setInterval(function() { o.load(req); }, gap);
    $http.post(o.url, req).success(function(res) {
      o.set(res);
    });
  };

  // save
  o.save = function(gap) {
    if(gap) setInterval(o.save, gap);
    $http.post(o.url, o.get());
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
      Materialize.toast('Failed to get location!', 3000, 'rounded');
      if(fn) fn(null);
    });
  };


  // ready!
  return o;
};


// prepare
$(document).ready(function() {
  $('[data-tooltip]').tooltip({'delay': 50});
  $('select').material_select();
  (map = Map('map')).loc(10);
});
