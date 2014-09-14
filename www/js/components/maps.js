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
      coords: '=coords'
    },    
    link: function postLink($scope, iElement, iAttrs) { 

        var useGoogleMaps = false;//typeof google === 'object' && typeof google.maps === 'object';      
        //useGoogleMaps = false;
        var mapDivElt = iElement.find('div')[0];
        var markers = [];
        var polylinesMaps = [];
      
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
            polylinesMaps = [];
            for (var indexPolyline = 0 ; indexPolyline<newValue.length; indexPolyline++){
                var polyline = new google.maps.Polyline({
                  path: [],
                  strokeColor: '#FF0000',
                  strokeWeight: 3
                });
                var polylineDatas = newValue[indexPolyline];

                for (var i = 0; i < polylineDatas.length; i++){
                    polyline.getPath().push(polylineDatas[i]);
                }

                polyline.setMap(map);
                polylinesMaps.push(polyline);
            }


        },true);

        $rootScope.$on('setPolylineActiv', function(evt, index){            
            if (index < polylinesMaps.length){
                polylinesMaps[index].setOptions({strokeColor:'#00FF00'});
            }
        });
      

        $rootScope.$on('requestNewMarker', function(evt, objMarker){            
            markers[objMarker.id] = placeGoogleMapsMarker(parseFloat(objMarker.coord.latitude), parseFloat(objMarker.coord.longitude), objMarker.type);
            if (objMarker.type ===  'tourette'){
                var populationOptions = {
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                  map: map,
                  center: new google.maps.LatLng(parseFloat(objMarker.coord.latitude), parseFloat(objMarker.coord.longitude)),
                  radius: 50
                };
                // Add the circle for this city to the map.
                cityCircle = new google.maps.Circle(populationOptions);
            }
        });

        $rootScope.$on('moveMarker', function(evt, objMarker){            
            markers[objMarker.id].setPosition(new google.maps.LatLng(parseFloat(objMarker.coord.latitude), parseFloat(objMarker.coord.longitude)));
        });

         $rootScope.$on('removeMarker', function(evt, objMarker){             
            markers[objMarker.id].setMap(null);
            markers[objMarker.id] = null;
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

        /*function locateAddressGoogle(address){
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
        }*/

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

        function placeGoogleMapsMarker(lat, lng, type){
            var icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
            if (type === 'pingouin'){
                icon = "../img/ping-User.png";
            }else if (type === 'attaquant'){
                icon = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
            }else if (type === 'tourette'){
                icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
            }else if (type === 'base'){
                icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            }
            var marker = new google.maps.Marker({
                map : map,
                position : new google.maps.LatLng(lat,lng), 
                icon : icon
            });
            return marker;
        }

    }
  };
  return directiveDefinitionObject;
}]);

 