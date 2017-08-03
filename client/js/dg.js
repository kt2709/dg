angular.module('dgApp', ['ui.bootstrap','angular.filter']);

//angular.module('dgApp').config(['$qProvider', function ($qProvider) {
//    $qProvider.errorOnUnhandledRejections(false);
//}]);
angular.module('dgApp').controller('dgCtrl', function($scope, $http) {
	
	$http.get('https://powerful-sands-79831.herokuapp.com/').then(function(d) {
   		$scope.results = d;
   		console.log($scope.results);
	});

	$http.get('//ipinfo.io/json')
		.then(function(ipdata) {
			$scope.selected = ipdata.data.city;
            console.log($scope.selected);
	});

    /*Geolocation.getAddress().then(function(address){
    	$scope.selected = address.city;
    });*/

});