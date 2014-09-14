app.factory("Engine", ["$firebase","$rootScope", function($firebase,$rootScope) {

	var attaquants = [];
	var coords = null;
	var lock = false;

 	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	function setCoords(coordsModel){
		coords = coordsModel;
	}

	function startAttact(){
		throwAttact(10);
		processMove();
	}

	function throwAttact(nbAttaques){
		console.log('attack ! '+nbAttaques);
		if (lock){
			setTimeout(function() {
				throwAttact(nbAttaques);
			}, 10);
		}else{
			lock = true;
			if (nbAttaques > 0){
				var attaquant = {id : new Date().getTime(), index:0, coord : coords[0]};
				attaquants.push(attaquant);
				$rootScope.$emit('requestNewMarker', attaquant);
				setTimeout(function() {
			 		throwAttact(nbAttaques-1);		 	
			 	}, 2000);	
			}
			lock = false;
		}
	}

	function processMove(){
		if (lock){
			setTimeout(processMove, 10);
		}else{
			lock = true;
			var pop = false;
			for(var i = 0; i<attaquants.length; i ++){
				var attaquant = attaquants[i];
				attaquant.index+=1;
				if (attaquant.index < coords.length){
					attaquant.coord = coords[attaquant.index];
					$rootScope.$emit('moveMarker', attaquant);
				}else{
					pop = true;
				}
			}
			
			if (pop){
				attaquants.shift();
			}
			if (attaquants.length>0){
				setTimeout(processMove, 50);
			}
			lock = false;
		}
	}


	
	return{
		startAttact : startAttact,
		setCoords : setCoords
	};
}]);