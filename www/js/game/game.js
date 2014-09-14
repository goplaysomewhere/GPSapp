app.controller("gameCtrl", ["$scope", "$interval", "simpleLogin", "Profile","Engine", "MapsRequest" ,
  function($scope, $interval, simpleLogin, Profile,Engine, MapsRequest) {
  $scope.auth = simpleLogin;

  $scope.map = {
      center: {
          latitude: 47.212210, 
          longitude: -1.551944
      },
      zoom: 17, 
      polylines : []
  };

  $scope.base = null;
  $scope.baseEnemies = [];
  $scope.polylines = [];
  $scope.marker = {
    id:0,
    coords:{
      latitude: 47.212210, 
      longitude: -1.551944
    }
  };

  setTimeout(function() {
    $scope.$apply(function(){
      $scope.base = {latitude: 47.212210, 
          longitude: -1.551944};
    });
  }, 1000);

  $scope.callBackDirection = function(polylines, coords){
    $scope.$apply(function(){
      
      $scope.map.polylines = polylines;
      $scope.coords = coords;

      Engine.setCoords(coords);
      Engine.startAttact($scope.coords);
        
      /*var coords = MapsRequest.getCoords();
      var index = 0;

      var intervalCancel = $interval(function(){
        if (index >= coords.length){
          $interval.cancel(intervalCancel);
        }else{
          $scope.marker.coords = coords[index];
        }
        index++;
      },100);*/
      
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
