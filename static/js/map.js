  var map;
  var markersArray = [];
  var directionsDisplay;
  var directionsService;

  var startData;
  var endData = {};
  var lastInfoWindow = null;

  function initialize() {
  	var myOptions = {
  		zoom: 12,
  		center: new google.maps.LatLng(30.278637, -97.743988),
  		mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'road',
          stylers: [
            { saturation: 10}
            ]
        }
      ]
  	};
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), myOptions);
    directionsDisplay.setMap(map);
  }

  function placeMarkers(data) {
    myAddress = data[0]['address'];
    myLat = data[0]['latitude'];
    myLong = data[0]['longitude'];

    path = '../static/img/food.png'

    var homeMarker = new google.maps.Marker({
        icon: path,
        map: map,
        position: new google.maps.LatLng(myLat, myLong)
    });
    markersArray.push(homeMarker);

    var myHtml = "<div> main: "+ myAddress + "</div>";
    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(homeMarker, 'click', function() {
        if (infowindow) infowindow.close();
        infowindow = new google.maps.InfoWindow({content: myHtml});
        infowindow.open(map,homeMarker);
    });

    var index;
    for (index=1; index < data.length; index++) {

        displayAddress = data[index]['address'];
        displayLat = data[index]['latitude'];
        displayLong = data[index]['longitude'];

        var pos = new google.maps.LatLng(displayLat, displayLong)
        var marker = new google.maps.Marker({
          icon: 'http://goo.gl/TQpwU',
          map: map,
          position: pos        
        });
        markersArray.push(marker);
        google.maps.event.addListener(marker, 'click', findMarkerRoute(data[0], data[index], marker));

    }

  }


  function findMarkerRoute(startData, endData, marker) {

    var returnValue = function() {

      if (lastInfoWindow) lastInfoWindow.close();

      var myHtml = 'Phone:  <input type=\"text\" id=\"phone-bar\" name=\"phone\" placeholder=\"phone number...\" style=\"width:100px\"/><br/>' + 
                    'e-mail: <input type=\"text\" id=\"email-bar\" name=\"email\" placeholder=\"e-mail address...\" style=\"width:100px\"/><br/>' + 
                    '<button type=\"button\" onclick=\"sendPersonalInfo()\">Send</button>';
      var infowindow = new google.maps.InfoWindow({content: myHtml});
      infowindow.open(map,marker)
      lastInfoWindow = infowindow;


      var travelMode = google.maps.TravelMode.DRIVING;
      var transportation = endData['transportation'];

      if ( transportation === 'walk') {
          travelMode = google.maps.TravelMode.WALKING;
      } else if (transportation === 'bus') {

      }

      var request = {
        origin: new google.maps.LatLng(startData['latitude'], startData['longitude']),
        destination: new google.maps.LatLng(endData['latitude'], endData['longitude']),
        travelMode: travelMode
      };

      directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(result);
          }
      })

    };

    return returnValue;
  }


  function deleteOverlays() { 
    startData = null;
    endData = {};

    if(markersArray) {
        for(i in markersArray) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
  }

  function placeMarker(location, str) {
    var path = '../static/img/shelter.png'; 
    
    var marker = new google.maps.Marker({
    icon: path, 
    map: map, 
    position: location
    });
   
    var show = 'First name: <input type="text" name="fname" /> Last name: <input type="text" name="lname" />'
    
    var infowindow = new google.maps.InfoWindow({content: show}); 
    
    google.maps.event.addListener(marker, "click", function(){
    infowindow.open(map, marker); 
    });
    
       marker.setAnimation(null);
  }

  