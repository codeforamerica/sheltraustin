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
	    "medical service": df + "mh.png", 
	    "mental health service": df + "ms.png", 
	    "private": df + "private.gif", 
	    "shelter": df + "shelter.png",
	    "food": df + "food.png", 
	    "substance abuse aid": df + "saa.jpg"}

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
    var name = endData.title;
    var services = [['food', endData.food],
		    ['medical facility', endData.med_facility],
		    ['medical service', endData.med_service],
		    ['mental health service', endData.mental_health], 
		    ['private', endData.private ], 
		    ['shelter', endData.shelter ], 
		    ['substance abuse aid', endData.subst_abuse_service]
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
	  var name = endData.title; 
	  var services = [["Food", endData.food],
          ["Medical Facility", endData.med_facility],
          ["Medical Service", endData.med_service],
          ["Mental Health Service", endData.mental_health], 
          ["Private", endData.private ], 
          ["Shelter", endData.shelter ], 
          ["Substance Abuse Aid", endData.subst_abuse_service]
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


      var myHtml =  '<b>Place</b>: '+name+' <br/>' + 
                    '<b>Address</b>: '+ address +' <br/>' + 
                    '<b>Services</b>: '+str +   '<br/>' + 
                    '<b>Enter your contact information to get directions:</b><br/>' +
                    '<b>Phone</b>:  <input type=\"text\" id=\"phone-bar\" name=\"phone\" placeholder=\"Phone Number...\" style=\"width:100px\"/><br/>' + 
                    '<b>E-mail</b>: <input type=\"text\" id=\"email-bar\" name=\"email\" placeholder=\"E-mail address...\" style=\"width:100px\"/><br/>' + 
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


  
