(function(myApp, $, undefined){

	$(document).ready(function() {
		bind();
		myApp.parseLocation($('input[name="origin"]')[0]);
	});

	function bind() {
		$('input[name="origin"], input[name="destination"]').on({
			'keypress': myApp.setLocation
		});

		$('#currentSalary').slider({
			orientation: "horizontal",
			range: "min",
			max: 100,
			slide: myApp.updateSalary
		});

		$('.locationButton').on('click', myApp.saveUserLocation);
		$( document ).tooltip();
		$("div[id^='flash']").fadeOut(3000);
	}

}(window.myApp = window.myApp || {}, jQuery));

//.extend, .proxy 


