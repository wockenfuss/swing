$(function() {
	homeLocation($('.user-container p span'));

});

var homeLocation = function(input) {
	var objectId = '#user-background';
	var params = { city: input.textContent };
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