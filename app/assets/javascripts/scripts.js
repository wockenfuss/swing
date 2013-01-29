$(document).ready(function() {
	$.ajax({
		url: '/', 
		type: 'get',
		dataType: 'json',
		success: function(result) {
			updateMap(result);
		}
	});
	// $('input[name="location"]').on('blur', function(e) {
	// 	newLocation(this);
	// });

	$('input[name="location"]').keypress(function(e)
    {
	    code= (e.keyCode ? e.keyCode : e.which);
	    if (code == 13) {
	    	newLocation(this);
	    }
    });

});
	
var locationUrl = function(data) {
	return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' + 
				data.latitude + ',' + data.longitude + 
				'&zoom=10&size=1600x1200&scale=2&maptype=satellite&sensor=false&key=' +	
				data.key + ')'
};

var newLocation = function(input) {
	var cityName = $(input).val();
	console.log(cityName);
	params = { city: cityName }
	$.ajax({
		url: '/',
		type: 'get',
		dataType: 'json',
		data: params,
		success: function(result) {
			updateMap(result);
		}
	});
};

var updateMap = function(result) {
	var data = result.location
	$('#map').css('background-image', locationUrl(data));
	$('#map').css('background-position', 'center');
};
