app.controller("gameCtrl", ["$scope", "$interval", "simpleLogin", "Profile","Engine", "MapsRequest", "MapService" ,
  function($scope, $interval, simpleLogin, Profile,Engine, MapsRequest, MapService) {
  $scope.auth = simpleLogin;



  $scope.map = MapService.init();



  $scope.coords = [];
  $scope.makersAttaquants=[];
  $scope.base = null;
  $scope.baseEnemies = [];
  $scope.polylines = [];


  $scope.createMyBase = function() {
      coordinates = MapService.getCurrentPosition();
      northCoordinates = MapService.getDepartNorthPosition();
      $scope.base = coordinates;
      MapsRequest.callDirections(coordinates, northCoordinates, $scope.callBackDirection);
  };

  $scope.callBackDirection = function(polylines, coords){
    $scope.$apply(function(){
      
      $scope.map.polylines = polylines;
      $scope.coords = coords;
      $scope.makersAttaquants = [coords[0]];

      
    });
  }


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
