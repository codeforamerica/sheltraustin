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
      placeMarker(event.latLng);
    });
  }

  function placeMarker(location) {
   var marker = new google.maps.Marker({
    icon: "http://goo.gl/TQpwU", 
    map: map, 
    position: location
    });
   marker.setAnimation(google.maps.Animation.BOUNCE);
  };
  