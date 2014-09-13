app.factory("Engine", ["$firebase","$rootScope", function($firebase,$rootScope) {

	var directionsService = new google.maps.DirectionsService();

	var request = {
      origin:'impass juton, nantes',
      destination:'chu nantes',
      travelMode: google.maps.TravelMode.DRIVING
	  };
	 


 	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/

	function callDirections(callBack){
		 directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	    	console.info(response);
	    	callBack(response);


	      //directionsDisplay.setDirections(response);

	      


	    }
	  });
	}

	function calculateConflicts(){
		return null;
	}

	
	return{
		callDirections : callDirections,
		//Apis
		calculateConflicts : calculateConflicts
	};
}]);