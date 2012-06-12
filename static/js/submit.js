$(document).ready(function() { 

	$("#accordion").accordion();

	$('#searchBTN').click( function() {
		$.ajax({
			url: '/search',
			dataType: 'json',
			type: "GET",
			data: json(),
			success: function(data) {
				deleteOverlays();
				placeMarkers(data['result']);
				listDisplay(data['result']);
			}
		});
		return false;
	});

	$('#addressbar').keyup( function(e) {
		if (e.currentTarget.value==='') {
			$('#autocomplete-results').html('');
		}

		window.setTimeout(function() {
			$.ajax({
				url: '/find',
				dataType: 'json',
				type: 'GET',
				data: {
					'address': e.currentTarget.value
				},
				success: function(data) {
					var autocomplete = $('#autocomplete-results').html('');
					var content = "<ol class=\"autocomplete\">";
					var index = 0;
					for (index=0; index < data['addresses'].length; index++) {
						content += "<li class=\"autocomplete\" onclick=\"replaceAddress(\'"+data['addresses'][index]+"\')\">"+data['addresses'][index]+"</li>";
					}
					content += "</ol>";
					autocomplete.append(content);
				}
			});
		}, 200);

	});

});

var JSONobj;

var json = function createJSON() {
	var a = $('#addressbar');
	if(!(a.val().length > 0)) {
		alert('Please enter your address.');
	}
	
	var bedVal = check("#checkbox-bed");
	var foodVal = check("#checkbox-food");
	var medVal = check("#checkbox-medical");
  var mentVal = check("#checkbox-mental");
  var subVal = check("#checkbox-substance");

	JSONobj = {
		"address" : a.val(),
		"bed" : bedVal,
		"food" : foodVal,
		"medical" : medVal,
		"mental-health" : mentVal,
		"substance-abuse" : subVal,
		"transportation" : $('input[name=trans]:checked').val(),
		"distance" : $('input[name=distance]:checked').val()
	};
	return JSONobj;
}

function check(id) {
	var isChecked = $(id).attr('checked') ? true : false;
	if (isChecked) { 
		return "true"; 
	}
	else {
		return "false"; 
	}
}

function listDisplay(searchResults) {
    var sb = $('#locations-list').html('');
	var content = "";
	
    content += "<h3>Results</h3>";
    content += "<ul>";
    for (var i = 0; i < searchResults.length; i++){
        content += "<li>" + searchResults[i]["title"] + " --- " + searchResults[i]["address"] + "</li>";
    }
    content += "</ul>";
	sb.append(content);
}

function replaceAddress(address) {
	var $ab = $('#addressbar');
	$ab.attr('value', address);
}

function sendPersonalInfo() {

	var directions = '';

	if (directionResults==null) {
		directions = 'Could not find the addresses';
	} else {
		for (index in directionResults['routes']) {
			route = directionResults['routes'][index];
			for (j in route['legs']) {
				leg = route['legs'][j];
				var start_address = leg['start_address'];
				var end_address = leg['end_address'];
				directions += 'FROM ' + start_address + ' TO ' + end_address + '\n';
			}
		}
	}


	var phonenum = $('#phone-bar').attr('value');
	var emailaddr = $('#email-bar').attr('value');



	$.ajax({
		url: '/info',
		dataType: 'json',
		type: 'GET',
		data : {
			'email': emailaddr,
			'phone': phonenum,
			'direction': directions
		},
		success: function(data) {
			var phoneError = data['phone'];
			var emailError = data['email'];

			if (phoneError['error'] != undefined) {
				alert('Could not send information to phone with error: ' + phoneError['error']);
			}
			else if (emailError['error'] != undefined) {
				alert('Could not send information to email with error: ' + emailError['error']);
			}
			else {
				lastInfoWindow.close();
			}
		}
	})
}

