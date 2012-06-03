$(document).ready(function() { 

	$("#accordion").accordion();

	$('#searchBTN').click( function() {
		$.ajax({
			url: '/search',
			dataType: 'json',
			type: "GET",
			data: json(),
			success: function(data) {
				console.log(data);
				listDisplay(data);
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
					console.log(content);
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
		"transportation" : $('input[name=trans]:checked').val()
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
	var selectbox = $('#accordion').html('');
	var content = "";
	
    content += "<h3><a href=\"#\">First header</a></h3>";
    content += "<div>First content</div>";
    content += "<h3><a href=\"#\">Second header</a></h3>";
    content += "<div>Second content</div>";

	selectbox.append(content);
}



function replaceAddress(address) {
	var $ab = $('#addressbar');
	$ab.attr('value', address);
}

