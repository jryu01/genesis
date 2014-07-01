/**
 * HomeController
 */
'use strict';

angular.module('genesisApp')
.controller('HomeController', ['$scope', '$state', 'Auth', 'socket', 'sportsList',
function ($scope, $state, Auth, socket, sportsList) {
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
    $scope.postFormData.text = "";
  };
  $scope.submitPostForm = function () {
    var isReady = !!$scope.postFormData.text && !!$scope.postFormData.selected;
    if(isReady) {
      // broadcasting for child controller to be notified
      $scope.$broadcast('submit post');
    }
  };
  function selectSportForForm(item) {
    if (!item) {
      $scope.postFormData.selected = $scope.sports[0];
      $scope.eventFormData.inputSports = $scope.sports[0];
    }
    for (var i = 0; i < $scope.sports.length; i++) {
      if ($scope.sports[i].name === item) {
        $scope.postFormData.selected = $scope.sports[i];
        $scope.eventFormData.inputSports = $scope.sports[i];
      }
    }
  }
  
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
    $scope.validDateMarker = false;
    $scope.validDateMarker2 = false;
    
    // process time
    var tempinputHour24 = 0;
    if ($scope.eventFormData.tempinputAMPM == "PM") tempinputHour24 = $scope.eventFormData.tempinputHour + 12;
    else tempinputHour24 = $scope.eventFormData.tempinputHour;
    
    $scope.eventFormData.Completedate = new Date($scope.eventFormData.tempinputYear, $scope.eventFormData.tempinputMonth, $scope.eventFormData.tempinputDay, tempinputHour24, $scope.eventFormData.tempinputMinute, 0, 0);
    
    var todayDate = new Date();
    if ($scope.eventFormData.Completedate < todayDate) // see if it is later than now
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
      items: [""].concat(sportsList), // ["", "General", "Basketball", ...]
      selected: ""
    };
    $scope.sports = sportsList.map(function (sport) {
      return { name: sport };
    });
    $scope.postFormData = {
      selected: null,
      text: ""
    };
    
    ////////
    // EVENT INIT //
    ////////
    
    // GET UTC Time
    var todayDate = new Date(); 
    
    var aheadDate = new Date(todayDate.getTime() + (30 * 60 * 1000));
    
    var time12format = 1;
    var time5format = 0;
    var tempAMPM = "AM";
    
    if (aheadDate.getHours() > 12) 
    {
      time12format = aheadDate.getHours() - 12;
      tempAMPM = "PM";
    }
    else
    {
      time12format = aheadDate.getHours();
      tempAMPM = "AM";
    }
    
    var tempMod = aheadDate.getMinutes() / 5;
    tempMod = Math.floor(tempMod);
    if (tempMod > 11) tempMod = 11;
    time5format = 5 * tempMod;
    
    // get abbr for timezone
    var str = aheadDate.toString();
    var s = str.split("(");
    var abbr = "";
    if (s.length === 2) abbr = s[1].replace(")", "");
    
    $scope.eventFormData = {
      ready: true,
      // things to pass to eventOrganizer.js
      inputName: "",
      inputDesc: "",
      inputPlace: "",
      Completedate: new Date().getTime(),
      inputRepeat: "once",
      inputSports: null,
      inputTypes: "Casual",
      // temp time
      tempinputMonth: todayDate.getMonth(),
      tempinputDay: todayDate.getDate(),
      tempinputYear: todayDate.getFullYear(),
      tempinputHour: time12format,
      tempinputMinute: time5format,
      tempinputAMPM: tempAMPM,
      tempinputTimezone: abbr,
    };
    
  }

}]);
