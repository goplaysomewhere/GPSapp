// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('gps', ['ionic','firebase','google-maps', 'ngRoute','gps.components']);

app.run(function($ionicPlatform) {
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
});


app.config(function($routeProvider, $locationProvider) {
  // Set up the initial routes that our app will respond to.
  // These are then tied up to our nav router which animates and
  // updates a navigation bar
  $routeProvider.when('/', {
    templateUrl: 'partials/game/game.html',
    controller: 'gameCtrl'
  });

  $routeProvider.when('/dash', {
    templateUrl: 'partials/dashboard/dashboard.html',
    controller: 'dashCtrl'
  });

  // if none of the above routes are met, use this fallback
  // which executes the 'IntroCtrl' controller (controllers.js)
  $routeProvider.otherwise({
    redirectTo: '/'
  });
});

