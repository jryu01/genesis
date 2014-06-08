/**
 * EventOrganizerController
 */

 'use strict';

var ONE_UNIT = 1000 * 60;
var globalLimit = 5;

 angular.module('genesisApp')
.controller('EventOrganizerController', ['$scope', '$state', 'EventsFromService',
function ($scope, $state, EventsFromService) {
  
  // call initialization
  init();
  
  // post Event
  $scope.$on('submit event', function (e) {

    // wrapper 
    var newEventParams = {
      name: $scope.$parent.eventFormData.inputName,
      desc: $scope.$parent.eventFormData.inputDesc,
      place: $scope.$parent.eventFormData.inputPlace,
      time: $scope.$parent.eventFormData.Completedate,
      repeat: $scope.$parent.eventFormData.inputRepeat,
      sports: $scope.$parent.eventFormData.inputSports["value"],
      types: $scope.$parent.eventFormData.inputTypes
    };
    
    // call create from service
    EventsFromService.create(
      // options
      {data: newEventParams},
      // success
      function (data, status, headers, config) {
        $scope.$parent.eventFormData.inputName = "";
        $scope.$parent.eventFormData.inputDesc = "";
        $scope.$parent.eventFormData.inputPlace = "";
        $scope.$parent.eventFormData.inputTime = "";
        $scope.$parent.eventFormData.inputRepeat = "once";
        $scope.$parent.eventFormData.inputSports = "General";
        $scope.$parent.eventFormData.inputTypes = "Casual";
        // TODO : add based on datetime
        $scope.eventGroup.unshift(data);
        updateGroups();
      },
      // Failure
      function (data, status, headers, config) {

      });
  });
  
  // select on filter
  $scope.$on('select filter', function (e) {
    var item = $scope.$parent.filter.selected;
    
    var filterInput = { 
      limit: globalLimit,
      sports: item,
    }; 
    
    updateLists(filterInput);
    
  });

  // update list when updated
  function updateLists(inputParams) {
    
    $scope.loading = true;
    
    // call all the event in return with eventGroup (array of events)
    EventsFromService.list(
      {
        config : {
          params: inputParams 
        } 
      }, // options
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
  
  // update list when updated
  function updateGroups() {
    
      /*
      $scope.todayDate = new Date();

      $scope.onGoingGroup = {};
      $scope.todayGroup = {};
      $scope.normalGroup = {};
      */

      $scope.casualGroup = {};
      $scope.tournamentGroup = {};
    
      angular.forEach($scope.eventGroup, function(value, key){

        /*
        // by Time
        var d = new Date(value.schedule.appDateTime);
        var diffTime = d.getTime() - $scope.todayDate.getTime();
        var diffTime = Math.round(diffTime/ONE_UNIT); // difference in minutes

        if (diffTime <= 0) $scope.onGoingGroup[key] = value;
        else if (diffTime > 0 && diffTime <= 1440) $scope.todayGroup[key] = value;
        else if (diffTime > 1440) $scope.normalGroup[key] = value;
        */
        if (value.eventType == "Tournament") $scope.tournamentGroup[key] = value;
        else $scope.casualGroup[key] = value;
      });
  }
  
  // load more Events
  $scope.loadMoreEvents = function () {
    $scope.loading = true;
    globalLimit = globalLimit + 5;
    var filterInput = {
      limit: globalLimit,
    };
    
    updateLists(filterInput);
    
  };
  
  // initializing with data load when page start
  function init() {
    
    globalLimit = 5;
    
    // param for listing
    var tempInputParams = { 
      limit: globalLimit,
    }; 
    
    // update list
    updateLists(tempInputParams);
    
  }
  
}]);

