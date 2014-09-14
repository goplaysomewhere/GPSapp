app.factory("Engine", ["$firebase","$rootScope", "Stats", function($firebase,$rootScope, Stats) {

	var attaquants = [];
	var tourettes = [];
	var coords = [];
	var lock = false;
	var totalLife = 100;
	var speedAttaque = 50;
	var level = 1;
	var NB_ATTAQUANTS = 10;
	var TIME_ATTAQUE = 1000;

 	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	function reset(){
		coords = [];
		totalLife = 100;
		NB_ATTAQUANTS = 10;
		TIME_ATTAQUE = 1000;
		speedAttaque = 50;
		level = 1;
	}

	function setCoords(coordsModel){
		coords.push(coordsModel);
		checkStateRoutes();
	}

	function startAttact(){
		checkStateRoutes();
		throwAttact(NB_ATTAQUANTS);
		processMove();
		NB_ATTAQUANTS++;
		level++;
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
				var pathIndex = Math.floor(Math.random() * getNbPath());
				var attaquant = {id : new Date().getTime(), index:0, pathIndex : pathIndex, coord : coords[pathIndex][0], type: "attaquant", percent :getPercentAttaquant(), startPercent: getPercentAttaquant()};
				attaquants.push(attaquant);
				$rootScope.$emit('requestNewMarker', attaquant);
				setTimeout(function() {
			 		throwAttact(nbAttaques-1);		 	
			 	}, TIME_ATTAQUE);	
			}
			lock = false;
		}
	}

	function checkStateRoutes(){
		if(level <5){
			$rootScope.$emit('setPolylineActiv',0);
		}else if(level <8){
			$rootScope.$emit('setPolylineActiv',0);
			$rootScope.$emit('setPolylineActiv',1);
			}else{
			$rootScope.$emit('setPolylineActiv',0);
			$rootScope.$emit('setPolylineActiv',1);
			$rootScope.$emit('setPolylineActiv',2);
		}
	}

	function getLevel(){
		return level;
	}

	function getNbPath(){
		if(level <5){
			return 1;
		}else if(level <8){
			return 2;
		}else{
			return 3;
		}
	}

	function getPercentAttaquant(){
		if (level ==1){
			return 100;
		}else if (level ==2){
			return 150;
		}else if (level ==3){
			return 200;
		}else if (level ==4){
			return 300;
		}else if (level ==5){
			return 400;
		}else if (level ==6){
			return 600;
		}else if (level ==7){
			return 800;
		}else if (level ==8){
			return 1000;
		}else if (level ==9){
			return 1500;
		}
	}

	function getAttaqueLevel(attaquant){
		// TODO
		return 5;
	}

	function processMove(){
		if (lock){
			setTimeout(processMove, 10);
		}else{
			lock = true;
			var indexsToRemove = [];
			for(var i = 0; i<attaquants.length; i ++){
				var attaquant = attaquants[i];
				attaquant.index+=1;
				var coordsPath = coords[attaquant.pathIndex];
				if (attaquant.index < coordsPath.length){
					attaquant.coord = coordsPath[attaquant.index];
					$rootScope.$emit('moveMarker', attaquant);
					var destroy = calculateConflicts(attaquant);
					if (destroy){
						indexsToRemove.push(i);
					}
				}else{					
					indexsToRemove.push(i);
					totalLife -= getAttaqueLevel(attaquant);
				}
			}
			
			if (indexsToRemove.length > 0){
				for (var index =0; index < indexsToRemove.length; index++){
					try{
						var attaquant = attaquants.splice(indexsToRemove[index],1)[0];
						Stats.changeScore(attaquant.startPercent);
						Stats.changeBank(attaquant.startPercent/100);
						$rootScope.$emit('removeMarker', attaquant);
					}catch(e){
						console.error(e);
					}
				}
			}
			if (attaquants.length>0){
				setTimeout(processMove, speedAttaque);
			}
			lock = false;
		}
	}

	function calculateConflicts(attaquant){
		var destroy = false;
		for (var indexTourette = 0 ; indexTourette < tourettes.length; indexTourette++){
			var tourette = tourettes[indexTourette];
			var posAttaquant = new google.maps.LatLng(attaquant.coord.latitude, attaquant.coord.longitude);
	        var posTourette = new google.maps.LatLng(tourette.coord.latitude,tourette.coord.longitude);
	        var dist = google.maps.geometry.spherical.computeDistanceBetween(posAttaquant, posTourette);
	        if (dist<10){
	        	attaquant.percent-=30;
	        }else if (dist > 10 && dist < 50){
				attaquant.percent-=10;
	        }
		}
		destroy = attaquant.percent <=0;
		return destroy;
	}

	function addTourette(position, options){
		var tourette = {id : new Date().getTime(), coord : {latitude : position.lat(), longitude : position.lng()}, type: "tourette", percent : 100};
		tourettes.push(tourette);
		$rootScope.$emit('requestNewMarker', tourette);	
	}



	
	return{
		reset : reset,
		startAttact : startAttact,
		setCoords : setCoords,
		addTourette : addTourette,
		getLevel : getLevel,
		checkStateRoutes : checkStateRoutes

	};
}]);