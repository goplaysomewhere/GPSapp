app.factory("simpleLogin", ["$firebaseSimpleLogin", function($firebaseSimpleLogin) {
  var ref = new Firebase("https://goplaysomewhere.firebaseio.com/");
  return $firebaseSimpleLogin(ref);
}]);

