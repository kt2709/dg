// http://microblog.anthonyestebe.com/2013-12-03/geolocalisation-and-address-completion-with-angular-and-google-map-api/
angular
  .module('GeolocationService', [])
  .service("Geolocation", ['$q', '$window', function($q, $window) {

      this.getLocation = function() {
        var deferred;
        deferred = $q.defer();

        if ($window.navigator && $window.navigator.geolocation) {
          $window.navigator.geolocation.getCurrentPosition(function(position) {
            return deferred.resolve(position.coords);
          }, function(error) {
            return deferred.reject("Unable to get your location");
          });
        } else {
          deferred.reject("Your browser cannot access to your position");
        }

        return deferred.promise;
      };


      this.getAddress = function() {
        var deferred,
          _this = this;
        this.geocoder || (this.geocoder = new google.maps.Geocoder());
        deferred = $q.defer();
        this.getLocation().then(function(coords) {
          var latlng;
          latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
          return _this.geocoder.geocode({
            latLng: latlng
          }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              return deferred.resolve(_this.extractAddress(results));
            } else {
              return deferred.reject("cannot geocode status: " + status);
            }
          }, function() {
            return deferred.reject("cannot geocode");
          });
        });
        return deferred.promise;
      };

      this.extractAddress = function(addresses) {
        var address, component, result, _i, _j, _len, _len1, _ref;
        result = {};
        for (_i = 0, _len = addresses.length; _i < _len; _i++) {
          address = addresses[_i];
          result.fullAddress || (result.fullAddress = address.formatted_address);
          result.coord || (result.coord = [address.geometry.location.ob, address.geometry.location.pb]);
          _ref = address.address_components;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            component = _ref[_j];
            if (component.types[0] === "route") {
              result.street || (result.street = component.long_name);
            }
            if (component.types[0] === "locality") {
              result.city || (result.city = component.long_name);
            }
            if (component.types[0] === "postal_code") {
              result.zip || (result.zip = component.long_name);
            }
            if (component.types[0] === "country") {
              result.country || (result.country = component.long_name);
            }
          }
        }
        return result;
      };

      return this;
    }
  ]);

/*
geolocation.getAddress().then(function(address) {
  $scope.model.address = address;
}, function(error) { console.log(error)});
*/