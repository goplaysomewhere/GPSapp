// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','firebase','google-maps'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.factory("simpleLogin", ["$firebaseSimpleLogin", function($firebaseSimpleLogin) {
  var ref = new Firebase("https://goplaysomewhere.firebaseio.com/");
  return $firebaseSimpleLogin(ref);
}]);

app.factory("Profile", ["$firebase", function($firebase) {
  return function(username) {
    // create a reference to the user's profile
    var ref = new Firebase("https://goplaysomewhere.firebaseio.com/profiles/").child(username);
    // return it as a synchronized object
    return $firebase(ref).$asObject();
  }
}]);
app.controller("mainCtrl", ["$scope", "simpleLogin", "Profile", function($scope, simpleLogin, Profile) {
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
