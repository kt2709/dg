angular.module('dgApp', ['ui.bootstrap','angular.filter']);

//angular.module('dgApp').config(['$qProvider', function ($qProvider) {
//    $qProvider.errorOnUnhandledRejections(false);
//}]);
angular.module('dgApp').controller('dgCtrl', function($scope, $http) {
	
	$scope.cities = ['Delhi','Mumbai','Kolkata','Chennai','Hyderabad','Bangalore', 'Pune'];

	$http.get('https://powerful-sands-79831.herokuapp.com/goldrates').then(function(goldrates) {
   		$scope.rates = goldrates;
	});

	$http.get('//ipinfo.io/json')
		.then(function(ipdata) {
			$scope.selected = ipdata.data.city;
	});

	$scope.fetchShops = function(city){
		$scope.selected = city;
		console.log('https://powerful-sands-79831.herokuapp.com/goldshops/'+$scope.selected);
		
		$http.get('https://powerful-sands-79831.herokuapp.com/goldshops/'+$scope.selected).then(function(goldshops) {
   			$scope.shops = goldshops;
		});
	}





	/*$http.get('https://powerful-sands-79831.herokuapp.com/goldshops/'+$scope.selected).then(function(d) {
   		console.log($scope.results);
	});*/
	

    /*Geolocation.getAddress().then(function(address){
    	$scope.selected = address.city;
    });*/

	

});
