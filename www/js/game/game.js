app.controller("gameCtrl", ["$scope", "simpleLogin", "Profile", 
  function($scope, simpleLogin, Profile) {
  $scope.auth = simpleLogin;

  $scope.map = {
      center: {
          latitude: 45,
          longitude: -73
      },
      zoom: 8
  };
  
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
