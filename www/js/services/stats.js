app.factory('Stats', ['$rootScope', function($rootScope){
	var bank = 100;
	var score = 0;

	return {
    getBank: function() {
      return bank;
    },
    getScore: function() {
      return score;
    },
	setBank: function(newBank) {
      bank = newBank;
      return;
    },
    setScore: function(newScore) {
      score = newScore;
      $rootScope.$emit('changeScore', score);
      return;
    },
  changeBank: function(change) {
      bank += change;
      return bank;
    },
    changeScore: function(change) {
      score += change;
      $rootScope.$emit('changeScore', score);
      return change;
    },
  }

}]);