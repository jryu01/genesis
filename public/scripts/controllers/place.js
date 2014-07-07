angular.module('genesisApp')
.controller('PlaceController',
  ['$scope', '$stateParams', 'Places', 'geolocation',
function ($scope, $stateParams, Places, geolocation) {
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
      });
  }
}]);