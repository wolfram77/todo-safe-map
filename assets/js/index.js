/* @wolfram77 */
/* INDEX - main js file */

// initialize
var app = angular.module('app', []);


// on ready
$(document).ready(function() {
	$('[data-tooltip]').tooltip({'delay': 50});
	$('select').material_select();
});


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
