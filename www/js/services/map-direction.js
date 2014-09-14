app.factory("MapsRequest", ["$firebase", function($firebase) {

	var directionsService = new google.maps.DirectionsService();

	var responseDirection  = null;	 
	var distanceTot = 0;
	var coords = [];


 	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	function moveMarker(){
		var overviewPath = responseDirection.routes[0].overview_path;
		var speed = 1;
      	var indexLeg =0,
        indexStep = 0,
        indexDist = 0,
        dstToGo = -1;
 
	    var minDist = distanceTot;
	    for (var indexPath = 0; indexPath < overviewPath.length; indexPath++){
	        if (indexPath>0){
	          var path = overviewPath[indexPath];
	          var pathPrevious = overviewPath[indexPath-1];
	          var pos = new google.maps.LatLng(path.k, path.B);
	          var posPrevious = new google.maps.LatLng(pathPrevious.k, pathPrevious.B);
	          var dist = google.maps.geometry.spherical.computeDistanceBetween(pos, posPrevious);
	          minDist = Math.min(minDist, dist);
	        }
	    }



      	do{
      		if (indexLeg !=0){          

	            var distEachPath = minDist; //distanceTot / overviewPath.length;
	            var path = overviewPath[indexLeg];
	            var pathPrevious = overviewPath[indexLeg-1];
	            var pos = new google.maps.LatLng(path.k, path.B);
	            var posPrevious = new google.maps.LatLng(pathPrevious.k, pathPrevious.B);
	            var dist = google.maps.geometry.spherical.computeDistanceBetween(pos, posPrevious);

	            var dataBornee = dist > distEachPath;
	            var deltaLat = (posPrevious.lat() - pos.lat()) / dist;
	            var deltaLong = (posPrevious.lng() - pos.lng()) / dist;
	            if (dataBornee){
	              if (dstToGo == -1){
	              	indexDist = 0;
	                dstToGo = dist;
	              }
	              dstToGo -= distEachPath;
	              indexDist++;
	              dist = distEachPath;
	            }else{
	              indexDist = 1;
	              indexLeg++;
	            }

	            coords.push({
	                latitude : posPrevious.lat() - deltaLat * indexDist,
	                longitude : posPrevious.lng() - deltaLong * indexDist});

	            /*coords.push(new google.maps.LatLng(parseFloat(posPrevious.lat() - deltaLat * indexDist), 
	            	parseFloat(posPrevious.lng() - deltaLong * indexDist)));*/

	            if (dataBornee &&  dstToGo < 0){
	              dstToGo = -1;
	              indexDist = 0;
	              indexLeg++; 
	            }

          }else{
            indexLeg++;
            
          }
      	}while(indexLeg < overviewPath.length);
      	
      
	}

	function callDirections(pointDepart, pointArrive, callBack){
		var request = {
	      origin:pointDepart,
	      destination:pointArrive,
	      travelMode: google.maps.TravelMode.DRIVING
		  };
		directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
			responseDirection = response;			
	    	console.info(response);
	      	var legs = response.routes[0].legs;	      	
	      	
	      	var ids = 0;
			distanceTot = 0;
			var polylines = [];
			for (i=0;i<legs.length;i++) {
				distanceTot += legs[i].distance.value;
				var steps = legs[i].steps;
				for (j=0;j<steps.length;j++) {
			  		var nextSegment = steps[j].path;
			  		var polylineTmp =  {
			    		id : ids,
			    		path :  []
			  		};
			  		for (k=0;k<nextSegment.length;k++) {
			  			polylineTmp = nextSegment[k];
			    		/*polylineTmp.path.push({
			      			latitude : nextSegment[k].k, 
			      			longitude : nextSegment[k].B
			    		});*/
						polylines.push(polylineTmp);	
			  		}
			  	//polylines.push(polylineTmp);
			  	ids++;
				}
			}

			moveMarker(); 

	    	callBack(polylines, coords);
	    }
	  });
	}

	function calculateConflicts(){
		return null;
	}

	function getCoords(){
		return coords;
	}

	 
	return{
		callDirections : callDirections,
		getCoords : getCoords
	};
}]);