angular.module('genesisApp')
.controller('PlaceController',
  ['$scope', '$stateParams', 'Places', 'geolocation', '$window', 'googleMapApiKey',
function ($scope, $stateParams, Places, geolocation,$window, googleMapApiKey) {
  init();
  $scope.addComment = function (placeId) {
    var $scope = this;
    if (!$scope.commentText) {
      return;
    }
    Places.addComment(placeId, { text: $scope.commentText})
      .success(function (data, status, headers, config) {
        $scope.placeBox.place.comments.push(data);
        $scope.commentText = "";

        if(!$scope.placeBox.place.numComments) {
          $scope.placeBox.place.numComments = 1;
        } else {
          $scope.placeBox.place.numComments += 1;
        }
      });
  };
  function init() {
    $scope.placeBox = {
      place: null,
      loading: false,
      currentUserLocation: geolocation.getLatestCurrentLocation() ||
              geolocation.getDefaultLocation()
    };
    $scope.map = {
      center: null,
      zoom: 15,
      staticUrl: "", 
      isDataReady: false
    };
    if (!$scope.previousState) {
      $scope.previousState = 'app.user.nearby.list';
    }

    // Fetch data from server
    $scope.placeBox.loading = true;
    Places.get($stateParams.id)
      .success(function (data, status, headers, config) {
        data.coords = {lat: data.loc[0], lng: data.loc[1]};
        $scope.placeBox.place = data;
        $scope.placeBox.loading = false;
        
        $scope.map.center = data.coords;
        $scope.map.staticUrl = 
            'http://maps.googleapis.com/maps/api/staticmap?' + 
            'center=' + data.coords.lat + ',' + data.coords.lng + '&' + 
            'zoom=15&' + 
            'size=' + $window.innerWidth + 'x200&maptype=roadmap&' + 
            'markers=color:red%7Clabel:P%7C' + data.coords.lat + ',' + 
            data.coords.lng + '&key=' + googleMapApiKey;
        console.log($scope.map.staticUrl);
        $scope.map.isDataReady = true;
      });
  }
}]);