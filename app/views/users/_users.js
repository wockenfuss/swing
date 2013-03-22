(function(myApp, $, undefined){
	console.log(myApp);

	// myApp.home = {
	// 	city: "Detroit"
	// };

	// console.log(myApp);

	myApp.homeLocation = function(input) {
		var objectId = '#user-background';
		var params = { city: input.textContent };
		$.ajax({
			url: '/',
			type: 'get',
			dataType: 'json',
			data: params,
			success: function(result) {
				myApp.updateMap(result, objectId);
			}
		});
	};

	myApp.homeLocation($('.user-container p span'));

}(window.myApp = window.myApp || {}, jQuery));

