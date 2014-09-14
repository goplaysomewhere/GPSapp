components.directive('map', ['$rootScope', '$timeout','$location','Engine'
  ,function ($rootScope,$timeout,$location,Engine) {
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
        var circles = [];
      
        var map = null;        
        var geocoder = null;

        initGoogleMap();
        

        function clearMap(){
            console.log('Clear Map ');
            for (var i=0;i < markers.length; i++){
                var marker = markers[i];
                if(marker){
                    try{
                        marker.setMap(null);
                    }catch(e){
                        console.log(e);
                    }
                }
            }
            markers = [];

            for (var i=0;i < polylinesMaps.length; i++){
                var polyline = polylinesMaps[i];
                if(polyline){
                    try{
                        polyline.setMap(null);
                    }catch(e){
                        console.log(e);
                    }
                }
            }
            polylinesMaps = [];


            for (var i=0;i < circles.length; i++){
                var circle = circles[i];
                if(circle){
                    try{
                        circle.setMap(null);
                    }catch(e){
                        console.log(e);
                    }
                }
            }
            circles = [];
        }

        $scope.$watch('polylines', function (newValue) {
            if (map == null || !newValue){
                return;
            }
            polylinesMaps = [];
            for (var indexPolyline = 0 ; indexPolyline<newValue.length; indexPolyline++){
                var polyline = new google.maps.Polyline({
                  path: [],
                  strokeColor: '#C0C0C0',
                  strokeOpacity: 0.8,
                  strokeWeight: 4
                });
                var polylineDatas = newValue[indexPolyline];

                for (var i = 0; i < polylineDatas.length; i++){
                    polyline.getPath().push(polylineDatas[i]);
                }

                polyline.setMap(map);
                polylinesMaps.push(polyline);
            }
            Engine.checkStateRoutes();


        },true);

        $rootScope.$on('clearMap', clearMap);


        $rootScope.$on('setPolylineActiv', function(evt, index){            
            try{                
                if (index < polylinesMaps.length){
                    polylinesMaps[index].setOptions({strokeColor:'#0C090A',strokeOpacity: 0.7});
                }
            }catch(e){}
        });
      

        $rootScope.$on('requestNewMarker', function(evt, objMarker){            
            markers[objMarker.id] = placeGoogleMapsMarker(parseFloat(objMarker.coord.latitude), parseFloat(objMarker.coord.longitude), objMarker.type);
            if (objMarker.type ===  'tourette'){
                var populationOptions = {
                  strokeColor: '#469fcb',
                  strokeOpacity: 0,
                  strokeWeight: 2,
                  fillColor: '#469fcb',
                  fillOpacity: 0.35,
                  map: map,
                  center: new google.maps.LatLng(parseFloat(objMarker.coord.latitude), parseFloat(objMarker.coord.longitude)),
                  radius: 50
                };
                // Add the circle for this city to the map.
                circles.push(new google.maps.Circle(populationOptions));
            }
        });

        $rootScope.$on('moveMarker', function(evt, objMarker){        
            try{
                markers[objMarker.id].setPosition(new google.maps.LatLng(parseFloat(objMarker.coord.latitude), parseFloat(objMarker.coord.longitude)));
            }catch(e){} 
        });

         $rootScope.$on('removeMarker', function(evt, objMarker){  
             try{
                markers[objMarker.id].setMap(null);
                markers[objMarker.id] = null;
             }catch(e){}
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
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles:[{"elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#f5f5f2"},{"visibility":"on"}]},{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#ffffff"},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"visibility":"simplified"},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"color":"#ffffff"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","stylers":[{"color":"#ffffff"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#71c8d4"}]},{"featureType":"landscape","stylers":[{"color":"#e5e8e7"}]},{"featureType":"poi.park","stylers":[{"color":"#8ba129"}]},{"featureType":"road","stylers":[{"color":"#ffffff"}]},{"featureType":"poi.sports_complex","elementType":"geometry","stylers":[{"color":"#c7c7c7"},{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#a0d3d3"}]},{"featureType":"poi.park","stylers":[{"color":"#91b65d"}]},{"featureType":"poi.park","stylers":[{"gamma":1.51}]},{"featureType":"road.local","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","stylers":[{"visibility":"simplified"}]},{"featureType":"road"},{"featureType":"road"},{},{"featureType":"road.highway"}]
                };

            geocoder = new google.maps.Geocoder();
            map = new google.maps.Map(mapDivElt, mapOptions);            
            console.log("mapInit");
          
        }

        function placeGoogleMapsMarker(lat, lng, type){
            var icon = "img/clown-Home.png";
            if (type === 'pingouin'){
                icon = "img/ping-User.png";
            }else if (type === 'attaquant'){
                icon = "img/clown-Enemy.png";
            }else if (type === 'tourette'){
                icon = "img/ping-Tour01.png";
            }else if (type === 'base'){
                icon = "img/ping-Home.png";
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

 