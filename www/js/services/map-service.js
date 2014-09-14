app.factory("MapService", ["$firebase","$rootScope", function($firebase,$rootScope) {


    var latitude = 0;
    var longitude = 0;

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
            zoom: 17
        };
        var onSuccess = function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            map.center = {
                latitude: latitude,
                longitude: longitude
            };
        }
        function onError(error) {
            console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
        }
        navigator.geolocation.watchPosition(onSuccess, onError, {timeout:10000});
        return map;
    }


    function getCurrentPosition() {
        return new google.maps.LatLng(latitude, longitude);
    }

    function getDepartNorthPosition() {
        return new google.maps.LatLng(latitude+0.003, longitude);
    }

    return{
        init : init,
        getCurrentPosition : getCurrentPosition,
        getDepartNorthPosition: getDepartNorthPosition
    };
}]);