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
    
    if (!$scope.inputRepeatBool) $scope.inputRepeat = "";
    
    // wrapper 
    var newEventParams = {
      name: $scope.inputName,
      desc: $scope.inputDesc,
      place: $scope.inputPlace,
      time: $scope.inputTime,
      repeat: $scope.inputRepeat,
      sports: $scope.inputSports,
      types: $scope.inputTypes
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
  
  // update list from frontend
  $scope.publicUpdateLists = function (inputParams) {
    $scope.isCollapsed = true;
    updateLists(inputParams);
  };
  
  // open collapsed
  $scope.openCollapsed = function (select) {
    $scope.isCollapsed = false;
    updateLists();
  };

  // select dropdown for Sports
  $scope.selectDropdownSports = function (select) {
    $scope.inputSports  = select;
  };
  
  // select dropdown for Types
  $scope.selectDropdownTypes = function (select) {
    $scope.inputTypes  = select;
  };

  // update list when updated
  function updateLists(inputParams) {
    
    // call all the event in return with eventGroup (array of events)
    EventsFromService.list(
      { config : { params: inputParams } }, // options
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
  
  };
  
  // update list when updated
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

        if (diffTime <= 0) $scope.onGoingGroup[key] = value;
        else if (diffTime > 0 && diffTime <= 1440) $scope.todayGroup[key] = value;
        else if (diffTime > 1440) $scope.normalGroup[key] = value;
        
       });
  };
  
  // initializing with data load when page start
  function init() {
    
    // default input values
    $scope.inputName = "";
    $scope.inputDesc = "";
    $scope.inputPlace = "";
    $scope.inputTime = new Date(); 
    $scope.inputRepeatBool = false;
    $scope.inputRepeat = "daily";
    $scope.inputSports = "General";
    $scope.inputTypes = "Casual";
    
    // hide it when start with page
    $scope.isCollapsed = true;

    // param for listing
    var tempInputParams = { 
      limit: 5,
    }; 
    
    // update list
    updateLists(tempInputParams);
    
  }
  
}]);

