app.controller("gameCtrl", ["$scope", "simpleLogin", "Profile","Engine", "MapsRequest" ,
  function($scope, simpleLogin, Profile,Engine, MapsRequest) {
  $scope.auth = simpleLogin;

  $scope.map = {
      center: {
          latitude: 47.212210, 
          longitude: -1.551944
      },
      zoom: 17
  };

  $scope.polylines = [];

  $scope.callBackDirection = function(response){
    $scope.$apply(function(){

      var legs = response.routes[0].legs;
      var ids = 0;
      for (i=0;i<legs.length;i++) {
        var steps = legs[i].steps;
        for (j=0;j<steps.length;j++) {
          var nextSegment = steps[j].path;
          var polylineTmp =  {
            id : ids,
            path :  []
          };
          for (k=0;k<nextSegment.length;k++) {
            polylineTmp.path.push({
              latitude : nextSegment[k].k, 
              longitude : nextSegment[k].B
            });
          }
          $scope.polylines.push(polylineTmp);
          ids++;
        }
      }
      
    });
  }

  MapsRequest.callDirections("impasse Juton, nantes","CHU Nantes", $scope.callBackDirection);



  $scope.login = function(provider) {
     $scope.auth.$login(provider).then(function(user) {
      console.log("Logged in as: " + user.uid);
      $scope.prof = Profile(user.uid);
      $scope.prof.$bindTo($scope, "profile");
    }, function(error) {
      console.error("Login failed: " + error);
    });
  }
  $scope.logout = function(userID){   
    $scope.auth.$logout();
    console.log("Logged Out");
    $scope.prof.$destroy();
  }
}])
