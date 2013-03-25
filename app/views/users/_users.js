(function(myApp, $, undefined){
	$(document).ready(function() {
		myApp.homeLocation($('.user-container p span'));
	});

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
					console.log(result);
					myApp.origin = myApp.locationFactory(result, objectId);
				}
			});
		}
	});

}(window.myApp = window.myApp || {}, jQuery));

