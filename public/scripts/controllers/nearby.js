/**
 * NearbyController
 */
'use strict';

angular.module('genesisApp')
.controller('NearbyController', ['$scope', '$state', '$window', 'socket',
function ($scope, $state, $window, socket) {
  $scope.test = function (name) {
    $window.alert("test hello " + name);
  };
  $scope.addMarkers = function () {
    $scope.markers = [
      {
        name: "first",
        coords: { lat: 43.654, lng: -79.381 }
      },
      {
        name: "second",
        coords: { lat: 43.655, lng: -79.382 }
      },
      {
        name: "third",
        coords: { lat: 43.656, lng: -79.384 }
      },
      {
        name: "fourth",
        coords: { lat: 43.658, lng: -79.386 }
      },
      {
        name: "sixth",
        coords: { lat: 43.653, lng: -79.381 }
      },
    ];
    $scope.map.markers = $scope.markers;
  };

  $scope.removeMarkers = function () {
    $scope.map.markers = [];
  };

  $scope.redoSearch = function () {
    $scope.map.markers = [];
    for (var i = 0; i < 20; i++) {
      var coords = {lat: 43.653 + Math.random()/100 , lng: -79.383 + Math.random()/100};
      $scope.map.markers.push({coords: coords, name: "test " + i});
    }
  };
  $scope.addPlace = function () {
    socket.emit('creatNewEvent', { name: "hello"} ,function (err, data) {
      if (err) {
        return console.log(err);
      }
      console.log("hello from server: " + data.name );
    });
  };
  $scope.openPlaceFormModal = function () {
    $scope.placeFormModal.open = true;
  };
  $scope.cancelPlaceFormModal = function () {
    $scope.placeFormModal.open = false;
  };
  init();
  function init() {
    $scope.map = {
      center: { lat: 43.653, lng: -79.383 },
      zoom: 15,
      centerPin: false,
      options: {},
      markers: []
    };
    $scope.addMarkers();
    $scope.placeFormModal = {
      open: false
    };
    $scope.placeFormData = {};
    $scope.placeFormData.address = null;
  }
}]);