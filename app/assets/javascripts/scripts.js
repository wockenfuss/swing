$(document).ready(function() {
	$.ajax({
		url: '/', 
		type: 'get',
		dataType: 'json',
		success: function(result) {
			var data = result.location.data
			$('#map').css('background-image', locationUrl(data));
			$('#map').css('background-position', 'center');
		}
	});
});
	
var locationUrl = function(data) {
	return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' + 
				data.latitude + ',' + data.longitude + 
				'&zoom=10&size=1600x1200&scale=2&maptype=satellite&sensor=false&key=' +	
				data.key + ')'
};

