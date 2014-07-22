'use strict';
angular.module('genesisApp')
.controller('EventController', ['$scope', '$state','Places', 'EventsFromService', 'geolocation', '$window',
function ($scope, $state, Places, EventsFromService, geolocation, $window) {
  init();  
  
  
  function init() {  
    
    // prep variables
    $scope.event = {};
    $scope.loading = true;
    
    $scope.map = {
      center: null,
      zoom: 15,
      isDataReady: false
    };

    // get data with this event id
    EventsFromService.get({ eventId: $state.params.id })
      .success(function (data, status, headers, config) {
        $scope.event = data;
        $scope.loading = false;
        
        Places.get($scope.event.place.placeId)
          .success(function (data2, status, headers, config) {

            $scope.mapData = data2;
            
            var coords = {lat: data2.loc[0], lng: data2.loc[1]};

            $scope.map.center = coords;
            $scope.map.staticUrl = 
                'http://maps.googleapis.com/maps/api/staticmap?' + 
                'center=' + coords.lat + ',' + coords.lng + '&' + 
                'zoom=15&' + 
                'size=' + $window.innerWidth + 'x200&maptype=roadmap&' + 
                'markers=color:red%7Clabel:P%7C' + coords.lat + ',' + 
                coords.lng;
            $scope.map.isDataReady = true;

          });
      });
  }
  
  $scope.addComment = function (eventId) {
     
    var newEventParams = {
      id: eventId,
      text : $scope.commentText
    };
    
    // call create from service
    EventsFromService.addEventComment({data: newEventParams})
    .success(function (data, status, headers, config) {
        $scope.event.comments = data;
      });
  };
    
}]);
    /**
    
    // POST
    $scope.postsBox = {
      isInitialLoading: true,
      isLoading: true,
      isThereMoreData: true
    };

    var params = { 
      limit: 10,
      commentsLimit: 0,
      profileType: Event
    }; 
    Posts.list({ config: { params: params }})
      .success(function (data, status, headers, config) {
        $scope.postsBox.isInitialLoading = false;
        $scope.postsBox.isLoading = false;
        $scope.posts = data;
      });
  }
  
  $scope.$on('socket newPost', function (e, data) {
    var isViewing = ($scope.$parent.filter.selected === "") ||
                    $scope.$parent.filter.selected === data.sport;
    if (isViewing) {
      $scope.posts.unshift(data);
    }
  });

  $scope.$on('socket updateScore', function (e, data) {
    // update score if user have the corressponding post in their view
    for (var i = 0; i < $scope.posts.length; i++) {
      if ($scope.posts[i].id === data.postId) {
        // add score and scorer field if not already exists
        if (!$scope.posts[i].score) {
          $scope.posts[i].score = 0;
          $scope.posts[i].scorers = [];
        }
        if (data.score === 1) {
          $scope.posts[i].score +=1;
          $scope.posts[i].scorers.push(data.scorerId);
        } else if (data.score === -1) {
          var index = $scope.posts[i].scorers.indexOf(data.scorerId);
          if (index !== -1) {
            $scope.posts[i].scorers.splice(index,1);
            $scope.posts[i].score -= 1;
          }
        }
        break;
      }
    }
  });

  $scope.$on('socket newComment', function (e, data) {
    //add comment if user have the coreesponding post in their view
    for (var i = 0; i < $scope.posts.length; i++) {
      if ($scope.posts[i].id === data.postId) {

        // $scope.posts[i].comments.push(data.comment);

        // increment number of comments
        if(!$scope.posts[i].numComments) {
          console.log($scope.posts[i]);
          $scope.posts[i].numComments = 1;
        } else {
          $scope.posts[i].numComments += 1;
        } 

        break;
      }
    }
  });


  $scope.$on('submit post', function (e) {
    var newPost = {
      sport: $scope.$parent.postFormData.selected.name,
      loc: [43.6525,-79.3816667], //TODO: get location 
      contents: $scope.$parent.postFormData.text
    };
    console.log(newPost);
    socket.emit('createNewPost', newPost, function (err, data) {
      if (err) {
        // handle error   
        return console.log(err);
      }
      $scope.$parent.postFormData.selected = null;
      $scope.$parent.postFormData.text = "";
      $scope.$parent.data.postFormOpened = false;

      $scope.posts.unshift(data);
    });

  });

  $scope.addScore = function (postId, $event) {
    // prevent propagating click event to parent div
    $event.stopPropagation();
    var $scope = this;
    var data = {
      postId: postId
    };
    socket.emit('addScore', data, function (err, data) {
      if (err) {
        return console.log(err);
      }
      if (!$scope.post.score) {
        $scope.post.score = 0;
        $scope.post.scorers = [];
      }
      // update score and socrers array of the post
      $scope.post.score +=1;
      $scope.post.scorers.push($scope.currentUser.id);
    });

  };
  $scope.removeScore = function (postId, $event) {
    // prevent propagating click event to parent div
    $event.stopPropagation();
    var $scope = this;
    var data = {
      postId: postId
    };
    socket.emit('removeScore', data, function (err, data) {
      if (err) {
        return console.log(err);
      }
      // update score and scorers array of the post
      $scope.post.score -= 1;
      var index = $scope.post.scorers.indexOf($scope.currentUser.id);
      $scope.post.scorers.splice(index,1);
    });

  };

  $scope.loadMorePosts = function () {
    $scope.postsBox.loading = true;
    if(!$scope.posts) {
      return;
    }
    var params = { 
      limit: 10,
      commentsLimit: 0,
      profileType: Event
    }; 
    if($scope.posts.length > 0) {
      params.dateBefore = $scope.posts[$scope.posts.length -1].createdAt;
    }
    if ($scope.$parent.filter.selected) {
      params.sport = $scope.$parent.filter.selected;
    }  
    Posts.list({ config: { params: params }})
      .success(function (data, status, headers, config) {
        if (data.length === 0) {
          $scope.postsBox.isThereMoreData = false;
        }
        $scope.postsBox.loading = false;
        $scope.posts = $scope.posts.concat(data);
      });
  };
    */