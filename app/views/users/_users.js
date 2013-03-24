(function(myApp, $, undefined){
	$(document).ready(function() {
		// bind();
		myApp.homeLocation($('.user-container p span'));
	});

	// function bind() {
	// 		$('input[name="user[location]"]').on({
	// 		'keypress': function(e) {
	// 			console.log(e.keyCode);
	// 			myApp.setLocation(e);
	// 		}

	// 		//myApp.setLocation
	// 	});
	// }

	$.extend(myApp, {
		homeLocation: function(input) {
			var objectId = 'user-background';
			var params = { city: input.textContent };
			$.ajax({
				url: '/',
				type: 'get',
				dataType: 'json',
				data: params,
				success: function(result) {
					myApp.origin = myApp.locationFactory(result);
					myApp.locationMap();
				}
			});
		},
		locationMap: function() {
			$('#user-background-map').css('background-image', myApp.origin.map)
							.css('background-position', 'center');
		}
	});

}(window.myApp = window.myApp || {}, jQuery));

