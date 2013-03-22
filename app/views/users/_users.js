(function(myApp, $, undefined){
	console.log(myApp);
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
					myApp.updateMap(objectId);
				}
			});
		}
	});
	


	

}(window.myApp = window.myApp || {}, jQuery));

