/**
 * HomeController
 */
'use strict';

angular.module('genesisApp')
.controller('HomeController', ['$scope', '$state', 'Auth', 'socket',
function ($scope, $state, Auth, socket) {
  init();

  /*
  * Filter related functions
  */
  $scope.selectFilter = function (item) {
    $scope.filter.selected = item;
    $scope.$broadcast('select filter');
  };
  $scope.shiftFilter = function (flag) {
    var filters = $scope.filter.items;
    var index = filters.indexOf($scope.filter.selected);
    if (flag === 'next') {
      index = (index === filters.length - 1) ? 0 : index + 1;
    } else if (flag === 'prev') {
      index = (index === 0) ? filters.length - 1 : index - 1;
    }
    $scope.selectFilter(filters[index]);
  };

  // Post
  $scope.openPostForm = function () {
    $scope.data.postFormOpened = true;
    selectSportForForm($scope.filter.selected);
  };
  $scope.cancelPostForm = function () {
    $scope.data.postFormOpened = false;
    // clear postFormData
    $scope.postFormData.selected = null;
    $scope.postFormData.text = null;
  };
  $scope.submitPostForm = function () {
    var isReady = !!$scope.postFormData.text && !!$scope.postFormData.selected;
    if(isReady) {
      // broadcasting for child controller to be notified
      $scope.$broadcast('submit post');
    }
  };
  function selectSportForForm(item) {
    if (item === null) {
      $scope.postFormData.selected = $scope.sports[0];
      $scope.eventFormData.inputSports = $scope.sports[0];
    }
    for (var i = 0; i < $scope.sports.length; i++) {
      if ($scope.sports[i].name === item) {
        $scope.postFormData.selected = $scope.sports[i];
        $scope.eventFormData.inputSports = $scope.sports[i];
      }
    }
  };
  
  // Event
  $scope.openEventForm = function () {
    $scope.data.eventFormOpened = true;
    selectSportForForm($scope.filter.selected);
  };
  $scope.cancelEventForm = function () {
    $scope.data.eventFormOpened = false;
    // clear eventFormData
  };
  $scope.submitEventForm = function () {
    
    var isReadyEvent = true;
    
    // process time
    var tempinputHour24 = 0;
    if ($scope.eventFormData.tempinputAMPM == "PM") tempinputHour24 = $scope.eventFormData.tempinputHour + 12;
    else tempinputHour24 = $scope.eventFormData.tempinputHour;
    $scope.eventFormData.Completedate = new Date($scope.eventFormData.tempinputYear, $scope.eventFormData.tempinputMonth, $scope.eventFormData.tempinputDay + 1, tempinputHour24, $scope.eventFormData.tempinputMinute, 0, 0);
   
    // validation
    var todayDate = new Date();
    if ($scope.eventFormData.Completedate < todayDate)
    {
      $scope.validDateMarker = true;
      isReadyEvent = false;
      return;
    }
    
    //
    $scope.validDateMarker = false;
    if(isReadyEvent) {
      // broadcasting for child controller to be notified
      $scope.$broadcast('submit event');
      $scope.data.eventFormOpened = false;
    }
    
  };
  
  //////////////// Initialization ///////////////////
  function init() {
    $scope.data = {
      titles: ['Home', 'Event'],
      slideIndex: 0,
      postFormOpened: false,
      eventFormOpened: false
    };
    
    ////////
    // post INIT //
    ////////
    // made of user's favorite sports
    $scope.filter = {
      items: [null, 'General', 'Basketball', 'Badminton'],
      selected: null
    };
    $scope.sports = [
      {name: 'General', value: 'General'},
      {name: 'Basketball', value: 'Basketball'},
      {name: 'Badminton', value: 'Badminton'}
    ];
    $scope.postFormData = {
      selected: null,
      text: null
    };
    
    $scope.$watch('postFormData.selected', function (newVal, oldVal) {
      $scope.postFormData.ready = !!$scope.postFormData.text && 
                                  !!$scope.postFormData.selected;
    });
    $scope.$watch('postFormData.text', function (newVal, oldVal) {
      $scope.postFormData.ready = !!$scope.postFormData.text && 
                                  !!$scope.postFormData.selected;
    });
    
    ////////
    // EVENT INIT //
    ////////
    
    var todayDate = new Date();
    var time12format = "1";
    var time5format = "0";
    var tempAMPM = "AM";
    if (todayDate.getHours() > 12) 
    {
      time12format = todayDate.getHours() - 12;
      tempAMPM = "PM";
    }
    var tempMod = todayDate.getMinutes() / 5;
    tempMod = Math.ceil(tempMod);
    if (tempMod > 11) tempMod = 11;
    time5format = 5 * tempMod;
    
    // get abbr for timezone
    var str = todayDate.toString();
    var s = str.split("(");
    if (s.length == 2) var abbr = s[1].replace(")", "");
    
    $scope.eventFormData = {
      selected: null,
      ready: true,
      // things to pass to eventOrganizer.js
      inputName: "",
      inputDesc: "",
      inputPlace: "",
      Completedate: new Date(),
      inputRepeat: "once",
      inputSports: "General",
      inputTypes: "Casual",
      // temp time
      tempinputMonth: todayDate.getMonth(),
      tempinputDay: todayDate.getDay(),
      tempinputYear: todayDate.getFullYear(),
      tempinputHour: time12format,
      tempinputMinute: time5format,
      tempinputAMPM: tempAMPM,
      tempinputTimezone: abbr,
    };
  }

}]);
