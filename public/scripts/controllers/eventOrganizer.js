/**
 * EventOrganizerController
 */

 'use strict';

var ONE_UNIT = 1000 * 60

 angular.module('genesisApp')
.controller('EventOrganizerController', ['$scope', '$state', 'EventsFromService',
function ($scope, $state, EventsFromService) {

  // call initialization
  init();

  // default open function of calender
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
  
  // Submit new Event form from public
  $scope.submitEventFromPublic = function () {
    
    // somehow: it is empty string
    if (!$scope.inputName || !$scope.inputSports || !$scope.inputDesc || !$scope.inputPlace || !$scope.inputTime) {
      return;
    }
    
    // wrapper 
    var newEventParams = {
      name: $scope.inputName,
      desc: $scope.inputDesc,
      place: $scope.inputPlace,
      time: $scope.inputTime,
      repeat: $scope.inputRepeat,
      sports: $scope.inputSports
    };
    
    // call create from service
    EventsFromService.create(
      // options
      {data: newEventParams},
      // success
      function (data, status, headers, config) {
        $scope.inputName = null;
        // TODO : add based on datetime
        $scope.eventGroup.unshift(data);
        updateGroups();
      },
      // Failure
      function (data, status, headers, config) {

      });
  };
  
    function updateGroups() {
      
        $scope.todayDate = new Date();
        
        $scope.onGoingGroup = {};
        $scope.todayGroup = {};
        $scope.normalGroup = {};
        
        angular.forEach($scope.eventGroup, function(value, key){
          
          var d = new Date(value.schedule.appDateTime);
          var diffTime = d.getTime() - $scope.todayDate.getTime();
          var diffTime = Math.round(diffTime/ONE_UNIT); // difference in minutes
          
          // iff negative more than 60 minutes, ongoing
          // iff possitve, but within 60 x 24 today group
          // if else, normal group
          
          if (diffTime > -60 && diffTime <= 0) $scope.onGoingGroup[key] = value;
          else if (diffTime > 0 && diffTime <= 1440) $scope.todayGroup[key] = value;
          else if (diffTime > 1440) $scope.normalGroup[key] = value;

         });
  }
  
  // initializing with data load when page start
  function init() {
    
    // default input values
    $scope.inputName = "";
    $scope.inputDesc = "";
    $scope.inputPlace = "";
    $scope.inputTime = new Date(); 
    $scope.inputRepeat = "onetime";
    $scope.inputSprots = "";
    
    // time picker
    $scope.ismeridian = true;
    $scope.hstep = 1;
    $scope.mstep = 1;
    
    // hide it when start with page
    $scope.isCollapsed = true;
    
    // Get events from server
    $scope.loading = true;
    $scope.wow = "";
    // call all the event in return with eventGroup (array of events)
    EventsFromService.list(
      { }, // options
      // Success
      function (data, status, headers, config) {
        $scope.loading = false;
        $scope.eventGroup = data;
        updateGroups();
      },
      // Failure
      function (data, status, headers, config) {
        // TODO: handle this situation
      }
    );
  }
  
}]);

