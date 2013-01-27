$(document).ready(function() {
	$.ajax({
		url: '/', 
		type: 'get',
		dataType: 'json',
		success: function(data) {
			$('#container').css('background-image', 'url(' + locationUrl(data.key) + ')');
			$('#container').css('background-position', 'center');
		}
	});
});
	
var locationUrl = function(key) {
	return "http://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=11&size=1600x1200&scale=2&maptype=satellite&sensor=false&key=" + key;
};

