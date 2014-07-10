/**
 * EventOrganizerController
 */

 'use strict';

var ONE_UNIT = 1000 * 60;

 angular.module('genesisApp')
.controller('EventOrganizerController', ['$scope', '$location', '$state', 'EventsFromService',
function ($scope, $location, $state, EventsFromService) {
  
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
      sports: $scope.$parent.eventFormData.inputSports.name,
      types: $scope.$parent.eventFormData.inputTypes
    };
    
    // call create from service
    EventsFromService.create(
      // options
      {data: newEventParams},
      // success
      function (data, status, headers, config) {
        $scope.eventsBox.isThereMoreData = false;
        
        $scope.$parent.eventFormData.inputName = "";
        $scope.$parent.eventFormData.inputDesc = "";
        $scope.$parent.eventFormData.inputPlace = "";
        $scope.$parent.eventFormData.inputRepeat = "once";
        $scope.$parent.eventFormData.inputSports = null;
        $scope.$parent.eventFormData.inputTypes = "Casual";
        // TODO : add based on datetime
        //$scope.eventGroup.unshift(data);
        //updateGroups();
        $location.path('/event/' + data.id);
      },
      // Failure
      function (data, status, headers, config) {

      });
  });
  
  // select on filter
  $scope.$on('select filter', function (e) {
    $scope.eventGroup = null;
    updateGroups();
    
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
          $scope.eventsBox.isLoading = false;
          return;
        }
        $scope.eventsBox.isLoading = false;
        
        if ($scope.eventGroup) $scope.eventGroup = $scope.eventGroup.concat(data);
        else  $scope.eventGroup = data;
        updateGroups();
        return;
      },
      // Failure
      function (data, status, headers, config) {
        // TODO: handle this situation
      }
    );
  
  }
  
  // update list when updated
  function updateGroups() {
    $scope.casualGroup = [];
    $scope.tournamentGroup = [];
    
    angular.forEach($scope.eventGroup, function(value, index){
      if (value.eventType == "Tournament") {
        $scope.tournamentGroup.push(value);
      } else {
        $scope.casualGroup.push(value);
      }
    });
  }
  
  // load more events
  $scope.loadMoreEvents = function () {
    $scope.eventsBox.isLoading = true;
    
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

