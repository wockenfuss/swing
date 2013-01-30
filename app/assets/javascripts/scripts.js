$(document).ready(function() {
	newLocation($('input[name="origin"]')[0]);

	$('input[name="origin"]').on({
		// 'blur': function(e) {
		// 	newLocation(this);
		// },
		'keypress': function(e) {
	    code= (e.keyCode ? e.keyCode : e.which);
	    if (code == 13) {
	    	newLocation(this);
	   	}
	  }
	});

	$('input[name="destination"]').on({
		'keypress': function(e) {
    	code = (e.keyCode ? e.keyCode : e.which);
    	if (code == 13) {
    		animateMaps();
    		newLocation(this);
    	}
  	}
  	// 'blur': function(e) {
  	// 	animateMaps();
  	// 	newLocation(this);
  	// }
  });

  $('#locationButton').on('click', function(e) {
  	newLocation($('input[name="origin"]')[0]);
  	newLocation($('input[name="destination"]')[0]);
  	setTimeout(animateMaps, 750);
  });
});
	
// var initialLocation = function() {
	
// 	$.ajax({
// 		url: '/', 
// 		type: 'get',
// 		dataType: 'json',
// 		success: function(result) {
// 			updateMap(result);
// 		}
// 	});

// }
	
var locationUrl = function(data) {
	return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' + 
				data.latitude + ',' + data.longitude + 
				'&zoom=10&size=1200x1200&scale=2&format=jpg&maptype=satellite&sensor=false&key=' +	
				data.key + ')'
};

var newLocation = function(input) {
	var objectId = '#' + input.id + '-map';
	var cityName = $(input).val();
	console.log(objectId);
	params = { city: cityName }
	$.ajax({
		url: '/',
		type: 'get',
		dataType: 'json',
		data: params,
		success: function(result) {
			updateMap(result, objectId);
		}
	});
};

var updateMap = function(result, objectId) {
	c = result.location;
	var data = result.location
	$(objectId).css('background-image', locationUrl(data));
	$(objectId).css('background-position', 'center');
};

var animateMaps = function() {
	$('#origin-map').animate({
    width: '400px',
  }, 1000, function() {
    // Animation complete.
  });
  $('#destination-map').css('display', 'inline-block');
  $('#destination-map').animate({
    width: '400px',
  }, 1000, function() {
    // Animation complete.
  });
};

