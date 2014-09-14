app.factory('Stats', function(){
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
      return;
    },
	changeBank: function(change) {
      bank += change;
      return bank;
    },
    changeScore: function(change) {
      score += change;
      return change;
    },
  }

});