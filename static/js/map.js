  var map;

  function initialize() {
  	var myOptions = {
  		zoom: 12,
  		center: new google.maps.LatLng(30.278637, -97.743988),
  		mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'road',
          stylers: [
            { saturation: 10},
            {hue: "#00f"}
            ]
        }
      ]
  	};

    map = new google.maps.Map(document.getElementById('map'), myOptions);



    /* addListener() method takes object, event, function to call when event occurs */
    google.maps.event.addListener(map, 'click', function(event) {
      //placeMarker(event.latLng);
    });
  }

  function placeMarkers(data) {

    console.log(data);
    console.log(data[0]);
    myAddress = data[0]['address'];
    myLat = data[0]['latitude'];
    myLong = data[0]['longitude'];

    var homeMarker = new google.maps.Marker({
        icon: 'http://goo.gl/TQpwU',
        map: map,
        position: new google.maps.LatLng(myLat, myLong)
    });

    homeMarker.setAnimation(google.maps.Animation.BOUNCE)

    var index;
    for (index=0; index < data.length; index++) {
        displayAddress = data[index]['address'];
        displayLat = data[index]['latitude'];
        displayLong = data[index]['longitude'];


        var marker = new google.maps.Marker({
          icon: 'http://goo.gl/TQpwU',
          map: map,
          position: new google.maps.LatLng(displayLat, displayLong)          
        });

        marker.setAnimation(google.maps.Animation.BOUNCE);
    }

  }

  /**
  function placeMarker(location) {
   var marker = new google.maps.Marker({
    icon: "http://goo.gl/TQpwU", 
    map: map, 
    position: location
    });
   marker.setAnimation(google.maps.Animation.BOUNCE);
  };
  */
  