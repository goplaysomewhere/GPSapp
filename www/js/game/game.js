app.controller("gameCtrl", ["$scope", "$rootScope", "$interval", "simpleLogin", "Profile","Engine", "MapsRequest", "MapService" ,
  function($scope, $rootScope, $interval, simpleLogin, Profile,Engine, MapsRequest, MapService) {
  $scope.auth = simpleLogin;



  $scope.map = MapService.init();
  $scope.gameStart = false;
  $scope.steps = null;
  $scope.tourettes = [];

  $rootScope.$on('updateStep',function(){
    $scope.$apply(function(){
      $scope.steps = Math.round(MapService.getSteps());
    });
  });

  $scope.createMyBase = function() {
      var coordinates = MapService.getCurrentPosition();
      $scope.base = coordinates;
      var northCoordinates = MapService.getDepartNorthPosition();
      var eastCoordinates = MapService.getDepartEastPosition();
      var southCoordinates = MapService.getDepartSouthPosition();

      MapsRequest.callDirections(northCoordinates, coordinates, $scope.callBackDirection);
      MapsRequest.callDirections(eastCoordinates, coordinates, $scope.callBackDirection);
      MapsRequest.callDirections(southCoordinates, coordinates, $scope.callBackDirection);


      $rootScope.$emit('requestNewMarker', {
          id : "base"+(new Date().getTime()), 
          index:0, 
          coord : {
            latitude : coordinates.k, 
            longitude : coordinates.B
          }, 
          type: "base", 
          percent :100
        });
      $rootScope.$emit('requestNewMarker', {
          id : "baseEnemie"+(new Date().getTime()), 
          index:0, 
          coord : {
            latitude : northCoordinates.k, 
            longitude : northCoordinates.B
          }, 
          type: "baseEnemie", 
          percent :100
        });$rootScope.$emit('requestNewMarker', {
          id : "baseEnemie"+(new Date().getTime()), 
          index:0, 
          coord : {
            latitude : eastCoordinates.k, 
            longitude : eastCoordinates.B
          }, 
          type: "baseEnemie", 
          percent :100
        });$rootScope.$emit('requestNewMarker', {
          id : "baseEnemie"+(new Date().getTime()), 
          index:0, 
          coord : {
            latitude : southCoordinates.k, 
            longitude : southCoordinates.B
          }, 
          type: "baseEnemie", 
          percent :100
        });
  };

  $scope.poseTourette = function(){
    var position = MapService.getCurrentPosition();
    var option ={
      level :1
    };

    Engine.addTourette(position, option);
  }

  $scope.attaque = function(){
    Engine.startAttact();
  }

  $scope.callBackDirection = function(polylines, coords){
    $scope.$apply(function(){
      
      $scope.map.polylines.push(polylines);
      Engine.setCoords(coords);      
      
    });
  }

  $scope.demarrerJeux = function(){
    $scope.gameStart = true;
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
