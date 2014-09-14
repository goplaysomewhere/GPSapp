components.directive('map', ['$rootScope', '$timeout','$location'
  ,function ($rootScope,$timeout,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/map.html',
    replace: true,
    restrict: 'EA',
    //scope:false,
    scope: {        
      zoom: '=zoom',
      center: '=center',
      polylines: '=polylines',
      attaquants: '=attaquants',
      coords: '=coords',
      base: '=base',
      basesEnemies: '=basesEnemies'
    },    
    link: function postLink($scope, iElement, iAttrs) { 

        var useGoogleMaps = false;//typeof google === 'object' && typeof google.maps === 'object';      
        //useGoogleMaps = false;
        var mapDivElt = iElement.find('div')[0];
        var markers = [];
      
        var map = null;        
        var geocoder = null;

        initGoogleMap();
        

        function clearMarkers(){
            for (var i=0;i < markers.length; i++){
                var marker = markers[i];
                marker.setMap(null);
            }
            markers = [];
        }

        $scope.$watch('polylines', function (newValue) {
            if (map == null || !newValue){
                return;
            }
            var polyline = new google.maps.Polyline({
              path: [],
              strokeColor: '#FF0000',
              strokeWeight: 3
            });
            console.log(newValue);
            for (var i = 0; i < newValue.length; i++){
                polyline.getPath().push(newValue[i]);
            }

            polyline.setMap(map);

            //map.setZoom(parseInt(newValue));
        });

        $scope.$watch('base', function (newValue) {
            if (map == null || !newValue){
                return;
            }
            //clearMarkers();
            placeGoogleMapsMarker(parseFloat(newValue.latitude), parseFloat(newValue.longitude));                           
            
        });

        $scope.$watch('basesEnemies', function (newValue) {
            if (map == null || !newValue){
                return;
            }
            for (var i =0; i < newValue.length; i++){      
                placeGoogleMapsMarker(parseFloat(newValue[i].latitude), parseFloat(newValue[i].longitude));               
            }
            
        });

        $scope.$watch('attaquants', function (newValue) {
            if (map == null || !newValue){
                return;
            }
            clearMarkers();
            var markerToAnimate = null;
            for (var i =0; i < newValue.length; i++){      
                markerToAnimate = placeGoogleMapsMarker(parseFloat(newValue[i].latitude), parseFloat(newValue[i].longitude));               
            }

            if (newValue.length > 0){
                var index = 0;

                var intervalCancel = window.setInterval(function(){
                    if (index >= $scope.coords.length){
                      window.clearInterval(interval);
                    }else{
                      markerToAnimate.position = new google.maps.LatLng(
                        parseFloat($scope.coords[index].latitude),
                        parseFloat($scope.coords[index].longitude));
                    }
                    index++;
                },100);
            }
        });

        $scope.$watch('zoom', function (newValue) {
            if (map == null){
                return;
            }
            map.setZoom(parseInt(newValue));
        });

        $scope.$watch('center', function (newValue) {
            if (map == null){
                return;
            }
            map.setCenter(new google.maps.LatLng(
                parseFloat(newValue.latitude),
                parseFloat(newValue.longitude))
            );

        }, true);

        /*
        * Google Maps ! 
        */

        function locateAddressGoogle(address){
            geocoder.geocode({
                address : model.getRequest().cityName
            }, function(results, status){
                if (status === google.maps.GeocoderStatus.OK){
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(11);
                    var marker = new google.maps.Marker({
                        map : map,
                        position : results[0].geometry.location
                    });
                    markers.push(marker);
                }else{
                    console.log('Geocoder ko : '+status);        
                }
            });
        }

        function initGoogleMap(){

           var mapOptions = {
                center: new google.maps.LatLng($scope.center.latitude, $scope.center.longitude),
                zoom: $scope.zoom,
                mapTypeControl : false,
                panControl : false,
                streetViewControl : false,
                scaleControl : false,
                zoomControlOptions : { position : google.maps.ControlPosition.LEFT_BOTTOM},
                overviewMapControl : false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            geocoder = new google.maps.Geocoder();
            map = new google.maps.Map(mapDivElt, mapOptions);            
            console.log("mapInit");
          
        }

        function placeGoogleMapsMarker(lat, lng){
            var marker = new google.maps.Marker({
                map : map,
                position : new google.maps.LatLng(lat,lng)/*, 
                icon : '../assets/images/marker_theater_red_black.png'*/
            });
            markers.push(marker);
            return marker;
        }

    }
  };
  return directiveDefinitionObject;
}]);

 