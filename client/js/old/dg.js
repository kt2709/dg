angular.module('dgApp', ['ui.bootstrap','angular.filter','smart-table']);

angular.module('dgApp').controller('dgCtrl', ['$scope','$filter','$http', function(scope, filter, http) {
	scope.cities = ['Delhi','Mumbai','Kolkata','Chennai','Hyderabad','Bangalore', 'Pune'];
	
	http.get('https://powerful-sands-79831.herokuapp.com/goldrates/').then(function(goldrates) {
   				scope.goldratesIndianCities = goldrates.data;
	});

	

	http.get('//ip-api.com/json')
		.then(function(ipdata) {
			scope.selectedIndianCity = ipdata.data.city;
			if(scope.selectedIndianCity){
				http.get('//powerful-sands-79831.herokuapp.com/goldrates/'+scope.selectedIndianCity).then(function(goldrates) {
	   				scope.goldRatesByIndianCity = goldrates.data;
				});
			}	
	});

	scope.fetchData = function(city){
		scope.selectedIndianCity = city;		
		http.get('https://powerful-sands-79831.herokuapp.com/goldshops/'+scope.selectedIndianCity).then(function(goldshops) {
   			scope.goldShopsByIndianCity = goldshops.data;
		});
		http.get('https://powerful-sands-79831.herokuapp.com/goldrates/'+scope.selectedIndianCity).then(function(goldrates) {
   			scope.goldRatesByIndianCity = goldrates.data;
		});
	}

	scope.ratesByPage=5;
	scope.shopsByPage=3;
}]);
