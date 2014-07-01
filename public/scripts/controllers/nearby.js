/**
 * NearbyController
 */
'use strict';

angular.module('genesisApp')
.controller('NearbyController', ['$scope', '$state', '$window', 'socket', 'sportsList', 'Places', 'geolocation',
function ($scope, $state, $window, socket, sportsList, Places, geolocation) {

  init();
  $scope.redoSearch = function () {
    var query = {
      center: [$scope.map.center.lat, $scope.map.center.lng],
      radius: 0.1
    };
    fetchPlaceMarkers(query, function (err, markers) {
      $scope.map.markers = markers;
    });
  };
  $scope.submitPlaceForm = function () {
    // push sports to the array
    var sports = [];
    for ( var i = 1; i < 3; i++) {
      if ($scope.placeFormData['sport' + i]) {
        if (!sports) {
        } 
        sports.push($scope.placeFormData['sport' + i]);
      }
    }
    var placeData = {
      name: $scope.placeFormData.name,
      address: {
        street: $scope.placeFormData.address.address,
        city: $scope.placeFormData.address.city,
        province: $scope.placeFormData.address.province,
        country: $scope.placeFormData.address.country,
      },
      loc: [
        $scope.placeFormData.address.loc.lat, 
        $scope.placeFormData.address.loc.lng
      ],
      description: $scope.placeFormData.description,
      phone: $scope.placeFormData.phone,
      type: $scope.placeFormData.type,
      sports: sports,
      openHour: null
    };

    socket.emit('creatNewPlace', placeData ,function (err, data) {
      if (err) {
        return console.log(err);
      }
      $scope.cancelPlaceFormModal();        
    });
  };
  $scope.openPlaceFormModal = function () {
    $scope.placeFormModal.open = true;
  };
  $scope.cancelPlaceFormModal = function () {
    // clear the form and close the modal
    $scope.placeformData = {};
    for (var key in $scope.placeFormData) {
      delete $scope.placeFormData[key];
    }
    $scope.placeFormModal.resetAddress = true;
    $scope.placeFormModal.open = false;
  };

  function init() {
    $scope.sports = sportsList;
    $scope.map = {
      center: geolocation.getLatestCurrentLocation() ||
              geolocation.getDefaultLocation(),
      zoom: 12,
      centerPin: false,
      options: {},
      markers: [],
      currentLocation: geolocation.getLatestCurrentLocation() ||
              geolocation.getDefaultLocation(),
    };
    // set center asynchronously with current location
    geolocation.getCurrentLocation().then(function (location) {
      $scope.map.center = angular.copy(location); 
      $scope.map.currentLocation = angular.copy(location); 
    });

    $scope.placeFormModal = {
      open: false,
      resetAddress: false // reset address picker when set to true
    };
    $scope.placeFormData = {};

    fetchPlaceMarkers({
      center: [$scope.map.center.lat, $scope.map.center.lng], 
      radius: 0.1
    }, function (err, markers) {
      $scope.map.markers = markers;
    });

  }
  function fetchPlaceMarkers (query, callback) {
    var markers = [];
    // Fetch places from server
    Places.list(query)
      .success(function (data, status, headers, config) {
        // create a marker for each place and push it to the map.markers 
        data.forEach(function (place, index, array) {
          var marker = {};
          marker.data = place;
          if (place.loc) {
            marker.coords = {
              lat: place.loc[0],
              lng: place.loc[1]
            };
          }
          markers.push(marker);
          if (index === (array.length-1)) {
            callback(null, markers);
          }
        });
      });
  }
}]);