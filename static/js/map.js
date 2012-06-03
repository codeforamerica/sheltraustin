  var map;
  var markersArray = [];
  var directionsDisplay;
  var directionsService;

  var startData;
  var endData = {};
  var lastInfoWindow = null;
   var directionResults = null;

var df = '../static/img/'; 
var DICT = {"medical facility": df + "mf.jpg", 
	    "medical service": df + "ms.png", 
	    "mental health service": df + "mh.png", 
	    "private": df + "private.gif", 
	    "shelter": df + "shelter.png",
	    "food": df + "food.png", 
	    "substance abuse aid": df + "saa.gif"}

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
      
      path = 'http://goo.gl/TQpwU'; 

      //'../static/img/food.png'

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
              icon: findIcon(data[index]),
              map: map,
              position: pos        
          });
          markersArray.push(marker);
          google.maps.event.addListener(marker, 'click', findMarkerRoute(data[0], data[index], marker));
	  
      }

  }

function findIcon(endData){
    var address = endData.address; 
    var name = endData.name; 
    var properties = endData.properties; 
    var services = [["food", properties.food],
		    ["medical facility", properties.med_facility],
		    ["medical service", properties.med_service],
		    ["mental health service", properties.mental_health], 
		    ["private", properties.private ], 
		    ["shelter", properties.shelter ], 
		    ["substance abuse aid", properties.subst_abuse_service]
		   ]; 
    var str = ''; var dict; var i;   
    
    for (i = 0; i < services.length; i++){
        dict = services[i];
        
        if (dict.length === 2 &&  dict[1] === 'Y'){
            str = str + dict[0] + ', ';
	    var icon = DICT[dict[0]];
	    return icon; 
        }	      
    }
    return null; 
}

function findMarkerRoute(startData, endData, marker) {
    
    var returnValue = function() {
	
	if (lastInfoWindow) lastInfoWindow.close();
	
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
	
	directionResults = null;
	directionsService.route(request, function(result, status) {
            directionResults = result;
	      
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(result);
              }
	  });

	  var address = endData.address; 
	  var name = endData.name; 
	  var properties = endData.properties; 
	  var services = [["food", properties.food],
          ["medical facility", properties.med_facility],
          ["medical service", properties.med_service],
          ["mental health service", properties.mental_health], 
          ["private", properties.private ], 
          ["shelter", properties.shelter ], 
          ["substance abuse aid", properties.subst_abuse_service]
       ]; 
        var str = ''; var dict; var i;   
	  
          for (i = 0; i < services.length; i++){
              dict = services[i];
              
              if (dict.length === 2 &&  dict[1] === 'Y'){
                  str = str + dict[0] + ', ';
	      }	      
          }

        if (str === ''){
            str = 'Not yet Available'; 
        } else {
            str = str.substring(0,str.length-2);
        }


      var myHtml =  'Place: '+name+' <br/>' + 
                    'Address: '+ address +' <br/>' + 
                    'Services: '+str +   '<br/>' + 
                    'Phone:  <input type=\"text\" id=\"phone-bar\" name=\"phone\" placeholder=\"phone number...\" style=\"width:100px\"/><br/>' + 
                    'e-mail: <input type=\"text\" id=\"email-bar\" name=\"email\" placeholder=\"e-mail address...\" style=\"width:100px\"/><br/>' + 
                    '<button type=\"button\" onclick=\"sendPersonalInfo()\">Send</button>';
      var infowindow = new google.maps.InfoWindow({content: myHtml});
      infowindow.open(map,marker)
      lastInfoWindow = infowindow;


    };

      map.setZoom(14);
      map.setCenter(marker.getPosition()); 

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


  