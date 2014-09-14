app.factory("MapService", ["$firebase","$rootScope", function($firebase,$rootScope) {


    var latitude = 0;
    var longitude = 0;
    var steps = 0;
    var pingouinMarker = null;
    var lastPos;
    function construct(latitude, longitude) {
        latitude = 48.212210;
        longitude = -1.551944;
    }

    function init(){
        construct();
        var map = {
            center: {
                latitude: latitude,
                longitude: longitude
            },
            zoom: 17, 
            polylines : []
            };
        var onSuccess = function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            map.center = {
                latitude: latitude,
                longitude: longitude
            };
            if (lastPos){
                steps += getDistance(lastPos,position)*(1.31233595801 / 2);
            }
            if (!pingouinMarker){
                pingouinMarker = {id : "pingouin"+new Date().getTime(), index:0, coord : {latitude : latitude, longitude : longitude}, type: "pingouin"};
                $rootScope.$emit('requestNewMarker', pingouinMarker);
            }else{
                pingouinMarker.coord = {latitude : latitude, longitude : longitude};
                $rootScope.$emit('moveMarker', pingouinMarker);

            }
            lastPos = position;
            if (steps){
                $rootScope.$emit('updateStep');
            }
            console.log(steps);

        }
        function onError(error) {
            console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
        }
        navigator.geolocation.watchPosition(onSuccess, onError, {timeout:1000, enableHighAccuracy:true});
        return map;
    }


    function getCurrentPosition() {
        return new google.maps.LatLng(latitude, longitude);
    }

    function getDepartNorthPosition() {
        return new google.maps.LatLng(latitude+0.004, longitude);
    }

    function getDepartEastPosition() {
        return new google.maps.LatLng(latitude  , longitude+0.005);
    }

    function getDepartSouthPosition() {
        return new google.maps.LatLng(latitude-0.004, longitude);
    }
    function rad(x) {
      return x * Math.PI / 180;
    };

    function getDistance(p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(p2.coords.latitude - p1.coords.latitude);
      var dLong = rad(p2.coords.longitude - p1.coords.longitude);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.coords.latitude)) * Math.cos(rad(p2.coords.latitude)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    };

    function getSteps(){
        return steps;
    }

    return{
        init : init,
        getCurrentPosition : getCurrentPosition,
        getDepartNorthPosition: getDepartNorthPosition,
        getDepartEastPosition : getDepartEastPosition,
        getDepartSouthPosition : getDepartSouthPosition,
        getSteps: getSteps
    };
}]);