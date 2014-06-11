/**
 * EventOrganizerController
 */

 'use strict';

var ONE_UNIT = 1000 * 60;

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
        $scope.eventsBox.isThereMoreData = false;
        $scope.eventsBox.isInitialLoading = false;
        
        $scope.$parent.eventFormData.inputName = "";
        $scope.$parent.eventFormData.inputDesc = "";
        $scope.$parent.eventFormData.inputPlace = "";
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
    // loading begins...
    $scope.eventsBox.isThereMoreData = true;
    $scope.eventsBox.isInitialLoading = true;
    $scope.eventsBox.loading = true;
    $scope.eventGroup = null;
    
    var item = $scope.$parent.filter.selected;
    
    var filterInput = { 
      sports: item,
    }; 
    
    updateLists(filterInput);
    
  });

  // update list when updated
  function updateLists(inputParams) {
    
    $scope.eventsBox.isLoading = true;
    $scope.eventsBox.isThereMoreData = true;
    
    // call all the event in return with eventGroup (array of events)
    EventsFromService.list(
      {
        config : {
          params: inputParams 
        } 
      }, // options
      // Success
      function (data, status, headers, config) {
        if (data.length === 0) {
          $scope.eventsBox.isThereMoreData = false;
        }
        $scope.eventsBox.isLoading = false;
        if ($scope.eventGroup) $scope.eventGroup = $scope.eventGroup.concat(data);
        else  $scope.eventGroup = data;
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
      $scope.casualGroup = {};
      $scope.tournamentGroup = {};
    
      angular.forEach($scope.eventGroup, function(value, key){
        if (value.eventType == "Tournament") $scope.tournamentGroup[key] = value;
        else $scope.casualGroup[key] = value;
      });
  };
  
  // load more events
  $scope.loadMoreEvents = function () {
    $scope.eventsBox.loading = true;
    
    var params = {
      limits: 10,
    };
    if(!$scope.eventGroup) {
      return;
    }
    if($scope.eventGroup.length > 0) {
      params.dateBefore = $scope.eventGroup[$scope.eventGroup.length -1].schedule.appDateTime;
    } 
    if ($scope.$parent.filter.selected) {
      params.sports = $scope.$parent.filter.selected;
    } 
    
    // update posts........
    updateLists(params);
    
  };
  
  // initializing with data load when page start
  function init() {
    
    // not loaded yet;
    $scope.eventsBox = {
      isInitialLoading: true,
      isLoading: true,
      isThereMoreData: true
    };
    
    $scope.eventGroup = null;
    
    var params = {
      limits: 10,
    };
  
    // update list
    updateLists(params);
    
  }
  
}]);

