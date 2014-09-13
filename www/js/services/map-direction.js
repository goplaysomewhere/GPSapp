app.factory("MapsRequest", ["$firebase", function($firebase) {

	var directionsService = new google.maps.DirectionsService();

	 


 	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	function callDirections(pointDepart, pointArrive, callBack){
		var request = {
	      origin:pointDepart,
	      destination:pointArrive,
	      travelMode: google.maps.TravelMode.DRIVING
		  };
		directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	    	callBack(response);
	    }
	  });
	}

	function calculateConflicts(){
		return null;
	}

	 
	return{
		callDirections : callDirections
	};
}]);