
'use strict';

angular.module('genesisApp')
.filter('myDate', ['$filter', function ($filter) {
  return function (input) {
    
    var A_DAY = 1000*60*60*24;
    var AN_HOUR = 1000*60*60;
    var A_MINUTE = 1000*60;

    var date = new Date(input);
    var now = new Date();
    var diff  = (now - date); // difference in milliseconds

    if (diff < A_MINUTE) {
      var secondsAgo = Math.round(diff/(1000));
      return (secondsAgo > 0) ? secondsAgo + ' seconds ago': 'Just now'; 

    } else if (diff < AN_HOUR) {
      var minutesAgo = Math.round(diff/(1000*60));
      return minutesAgo + ' mins';

    } else if (diff < A_DAY) {
      var hoursAgo = Math.round(diff/(1000*60*60));
      return hoursAgo + ' hr';

    } else {
      return $filter('date')(input, 'MMM d');
    }
  };
}])
.filter('myDistance', ['$filter', function ($filter) {
  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  return function (inputLocation, location) {
    if (!inputLocation) {
      return null;
    }
    var distance =  getDistanceFromLatLonInKm(inputLocation.lat, 
                      inputLocation.lng, location.lat, location.lng);
    return Math.round(distance*10)/10;    
  };
}]);