var app = angular.module('dgApp',['ui.bootstrap','angular.filter','smart-table']);

app.controller('dgCtrl', ['$scope','$filter','$http', 'dgAppService', function(scope, filter, http, dg) {
	scope.cities = ['Delhi','Mumbai','Kolkata','Chennai','Hyderabad','Bangalore', 'Pune'];
	scope.ratesByPage=5;
	scope.shopsByPage=3;

	scope.fetchData = function(city){
		scope.selectedIndianCity = city;	

		dg.getDataforSelectedCity(scope.selectedIndianCity).then(function(response){
   				scope.goldRatesByIndianCity = response['goldRatesByIndianCity'].data;
   				scope.goldShopsByIndianCity = response['goldShopsByIndianCity'].data;
   		});	
	}

	dg.getData().then(function(response) {
   		scope.goldratesIndianCities = response['allGoldRates'].data;
   		scope.selectedIndianCity = response['cityInfo'].data.city;
   		console.log(scope.selectedIndianCity);
   		if(scope.selectedIndianCity){
   			dg.getDataforSelectedCity(scope.selectedIndianCity).then(function(response){
   				scope.goldRatesByIndianCity = response['goldRatesByIndianCity'].data;
   				scope.goldShopsByIndianCity = response['goldShopsByIndianCity'].data;
   			});
   		}
	});
	/*dg.getData().then(function(goldrates) {
   		scope.goldratesIndianCities = goldrates;
   		console.log(goldrates);
	});


	dg.getCity().then(function(city) {
		scope.selectedIndianCity = city;
		console.log(city);
	});
	
	dg.getCity().then(function(city) {
		scope.selectedIndianCity = city;
		if(city){
			dg.getGoldRatesforSelectedCity(city).then(function(goldRatesByIndianCity) {
				scope.goldRatesByIndianCity = goldRatesByIndianCity;
				console.log(goldRatesByIndianCity);
			});
		}
	});

	scope.fetchData = function(city){
		scope.selectedIndianCity = city;	

		dg.getGoldShopsforSelectedCity(city).then(function(goldShopsByIndianCity) {
				scope.goldShopsByIndianCity = goldShopsByIndianCity;
		});


		dg.getGoldRatesforSelectedCity(city).then(function(goldRatesByIndianCity) {
				scope.goldRatesByIndianCity = goldRatesByIndianCity;
		});
		
	}

	scope.ratesByPage=5;
	scope.shopsByPage=3;*/
}]);



app.factory("dgAppService", ['$http','$q', function (http, q) {
   
 	return{
 		
 		getData: function(){
 			var deferred = q.defer();
 			var allGoldRates = http.get('https://powerful-sands-79831.herokuapp.com/goldrates/');
    		var cityInfo = http.get('//ip-api.com/json');

	        q.all([allGoldRates, cityInfo]).then( function(data) {
	            deferred.resolve({
	                allGoldRates: data[0],
	                cityInfo: data[1]
	            });
	        });

	        return deferred.promise;
 		},


 		getDataforSelectedCity:function(city){
 			var deferred = q.defer();
 			var goldRatesByIndianCity = http.get('//powerful-sands-79831.herokuapp.com/goldrates/'+city);
 			var goldShopsByIndianCity = http.get('//powerful-sands-79831.herokuapp.com/goldshops/'+city);

	        q.all([goldRatesByIndianCity, goldShopsByIndianCity]).then(function(data) {
	            deferred.resolve({
	                goldRatesByIndianCity: data[0],
	                goldShopsByIndianCity: data[1]
	            })
	        });

	        return deferred.promise;
 		}
 	}  
}]);