app.factory("Profile", ["$firebase", function($firebase) {
  return function(username) {
    // create a reference to the user's profile
    var ref = new Firebase("https://goplaysomewhere.firebaseio.com/profiles/").child(username);
    // return it as a synchronized object
    return $firebase(ref).$asObject();
  }
}]);