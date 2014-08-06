/**
 * LoginController
 */
'use strict';

angular.module('genesisApp')
.controller('LoginController', 
  ['$scope', '$state', '$window', 'facebook',
function ($scope, $state, $window, facebook) {
  $scope.authFb = function () {
    var redirectUri = $window.location.origin + '/facebooklogin';
    var permissionUrl = 'https://www.facebook.com/dialog/oauth';
    permissionUrl += '?client_id=' + facebook.getAppId() +
                  '&redirect_uri=' + redirectUri;
    $window.location = permissionUrl;
  };
}]);