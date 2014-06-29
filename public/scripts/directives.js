'use strict';

angular.module('genesisApp')
.directive('myFocus', ['$timeout', '$parse', function($timeout, $parse){
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.myFocus);
      scope.$watch(model, function (newVal, oldVal) {
        if (newVal === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
}])
.directive('myModal', [function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div class="my-overlay">' +
              '  <div class="my-overlay-body" ng-transclude></div>' +
              '</div>',
    link: function (scope, element, attrs) {
      // myModalOpenStyle: bottom-up or right-left
      element.addClass(attrs.myModalOpenStyle);
      scope.$watch(attrs.myModalOpen, function (value) {
        if (value) {
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });
    }
  };
}])
.directive('myMap', ['$window', function ($window) {
  var google = $window.google;
  var mapStyles = [
    {
      "featureType": "poi",
      "stylers": [
        { "visibility": "off" }
      ]
    }
  ];
  return {
    restrict: 'E',
    scope: {
      center: '=',
      zoom: '=',
      options: '=',
      centerPin: '='
    },
    controller: ['$scope', function ($scope) {

      var map = null;
      this.markers = [];
      this.infoWindow =null;

      function addCenterPin() {
        var centerPin = angular.element('<div class="centerMarker"></div>');
        centerPin.css({
          "position":"absolute",
          "background": "url(http://maps.gstatic.com/mapfiles/markers2/" + 
            "marker.png) no-repeat",
          "top": "50%",
          "left": "50%",
          "z-index": "100000",
          "margin-left": "-10px",
          "margin-top": "-34px",
          "height": "34px",
          "width": "20px"
        });
        centerPin.appendTo(map.getDiv());
      }

      this.init = function (scope, element, attrs) {
        // container element for the map
        var el = $window.document.createElement("div");
        el.style.width = "100%";
        el.style.height = "100%";
        element.prepend(el);

        var mapOptions = {
          streetViewControl: false,
          styles: mapStyles,
          center: scope.center,
          zoom: scope.zoom,
        };
        mapOptions = angular.extend(mapOptions, scope.options);
        map = new google.maps.Map(el, mapOptions);
        if (scope.centerPin) {
          addCenterPin();
        }

        google.maps.event.addListener(map, 'center_changed', function() {
          var center = map.getCenter();
          scope.$apply(function () {
            scope.center.lat = center.lat();
            scope.center.lng = center.lng();
          });
        });
      };
      this.addMarker = function (marker) {
        marker.setMap(map);
      };
      this.initMarkers = function () {
        var markers = this.markers;
        for (var i = 0; i < markers.length; i++) {
          this.addMarker(markers[i]);
        }
        // remove refrences to markers after init
        this.markers.length = 0;
      };
      this.registerListeners = function () {

        // close infoWindow on click on the map
        if (this.infoWindow) {
          var infoWindow = this.infoWindow;
          google.maps.event.addListener(map, 'click', function () {
            infoWindow.close();
          });
        }
      };
      this.getMap = function () {
        return map;
      };
    }],
    // it gets excuted before child's link functions
    link: function (scope, element, attrs, ctrl) {
      ctrl.init(scope, element, attrs);
      ctrl.initMarkers();
      ctrl.registerListeners();
    }
  };
}])
.directive('myMapMarker', ['$window', function ($window) {
  var google = $window.google;
  return {
    require: '^myMap',
    restrict: 'E',
    scope: {
      coords: '=',
      options: '=',
      infoWindow: '=',
      infoWindowOpen: '&',
      infoWindowData: '='
    },
    link: function (scope, element, attrs, myMapCtrl) {
      /**
       * Note: this linking function gets called prior to the parent's 
       * linking function.
       */
      var markerOptions = {
        position: scope.coords
        // title: 'Marker Tooltip'
      };
       
      markerOptions = angular.extend(markerOptions, scope.options);

      var marker = new google.maps.Marker(markerOptions);

      if (scope.infoWindow) {
        // Add a click event listener to the marker to open info Window
        google.maps.event.addListener(marker, 'click', function () {
          scope.infoWindowOpen({
            marker: marker,
            infoWindowData: scope.infoWindowData
          });
        });
      }

      // ngRepeat happens after my-map directive's linking function
      if (attrs.ngRepeat) {
        myMapCtrl.addMarker(marker);

      // handle creating marker when map initialization happens on the parent
      } else {
        myMapCtrl.markers.push(marker); 
      }

      // clean up marker when this element is destroyed
      element.on('$destroy', function () {
        marker.setMap(null);
        marker = null;
      });
    }
  };
}])
.directive('myMapInfoWindow', ['$window', '$compile', function ($window, $compile) {
  var google = $window.google; 
  return {
    require: '^myMap',
    restrict: 'E',
    link: function (scope, element, attrs, myMapCtrl) {



      // compile inner html of this elements to angular elements
      var el = angular.element('<div></div>').prepend(element.html());
      var compiled = $compile(el)(scope);

      // Create a google map InfoWindow object

      // var infoWindow = new google.maps.InfoWindow({
      //   maxWidth: 100,
      //   content: compiled[0]
      // });

      // use coustom InfoBox from library instead of default InfoWindow
      var infoBoxOptions = {
        content: compiled[0],
        closeBoxURL: ""
      };     
      var infoWindow = new $window.InfoBox(infoBoxOptions);
      myMapCtrl.infoWindow = infoWindow;

      // Add infoWindowData obj and showInfoWindow func to parent scope
      scope.infoWindowData = {};
      scope.showInfoWindow = function (marker, infoWindowData) {
        var map = myMapCtrl.getMap();
        if (!map) {
          return;
        }
        scope.$apply(function () {
          scope.infoWindowData = infoWindowData;
        });
        infoWindow.open(map, marker);
      };
    }
  };
}])

/**
 * NOTE: Make sure parent div contating this directive doesn't
 * have -webkit-overflow-scrolling: touch css property.
 * Usage: <my-address-input address="model.address" reset="model.reset">
 *        </my-address-input>
 * where model is an object in which address object is contained
 * model.reset should be either true or false and clears up and reset the data 
 * when set to true
 */
.directive('myAddressInput', ['$window', '$parse', function ($window, $parse) {
  // google map geocoder object
  var google = $window.google;
  var geocoder = new google.maps.Geocoder();

  var directiveDefinitionObject = {
    restrict: 'E',
    scope: {
      address: '=',
      reset: '='
    },
    templateUrl: '/views/partials/myAddressInput.html',
    controller: ['$scope', function ($scope) {
      $scope.modal = {
        open: false,
        pages: ['address', 'map'],
        currentPage: 'address',
        loadingMap: false
      };
      $scope.openInputModal = function () {
        $scope.modal.open = true;
      };
      $scope.cancelInputModal = function () {
        $scope.modal.open = false;
        // clean up the input fields
        if (!$scope.addressFormData) {
          $scope.addressFormTmpData.address = '';
          $scope.addressFormTmpData.city = '';
          $scope.addressFormTmpData.province = '';
          $scope.addressFormTmpData.country = 'Canada';
          $scope.addressFormTmpData.loc = null;
        } else {
          // reset tmp data with form data
          angular.extend($scope.addressFormTmpData, $scope.addressFormData);
        }
      };
      $scope.goTo = function  (page) {
        var index = $scope.modal.pages.indexOf(page);
        $scope.modal.currentPage = $scope.modal.pages[index];

        if (page === 'map') {
          $scope.modal.loadingMap = true;
          // get geolocation information based on the address 
          var address = $scope.addressFormTmpData.address + ' ' +
                        $scope.addressFormTmpData.city + ' ' +
                        $scope.addressFormTmpData.province + ' ' +
                        $scope.addressFormTmpData.country;
          geocoder.geocode({'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              $scope.addressFormTmpData.loc = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              };
            } else {
              // fail to get geolocation data with given address.map
              // set map center with country only
              var loc = {
                'Canada': {lat: 43.653226, lng: -79.38318429999998}, //Toronto
                'United States': {lat: 40.7127837, lng: -74.00594130000002} //New York
              };
              $scope.addressFormTmpData.loc = loc[$scope.addressFormTmpData.country];
            }
            $scope.modal.loadingMap = false;
            $scope.$apply();
          });
        }

      };
      $scope.finishInputModal = function () {
        // copy properties from addressFormTmpData to addressFormData
        $scope.addressFormData = {};
        angular.extend($scope.addressFormData, $scope.addressFormTmpData);
        $scope.address = $scope.addressFormData;
        $scope.modal.open = false;
        $scope.goTo('address');
      };
      this.init = function (scope) {
        scope.addressFormData = null;
        scope.addressFormTmpData = {
          address: '',
          city: '',
          province: '',
          country: 'Canada', // default
          loc: null
        };
        scope.address = scope.addressFormData;
        scope.reset = false;
      };
    }],
    link: function (scope, element, attrs, ctrl) {
      ctrl.init(scope);
      scope.$watch('reset', function (val) {
        if (val === true) {
          ctrl.init(scope);
        }
      });
    }
  };
  return directiveDefinitionObject;
}]);