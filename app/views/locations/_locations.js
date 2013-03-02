$(function() {
	parseLocation($('input[name="origin"]')[0]);

	$( document ).tooltip();

	$('input[name="origin"], input[name="destination"]').on({
		'keypress': function(e) {
			code = (e.keyCode ? e.keyCode : e.which);
				if (code === 13) {
				parseLocation(this);
			}
		}
	});

  $('#currentSalary').slider({
    orientation: "horizontal",
    range: "min",
    max: 100,
    slide: updateSalary
  });

	$('.locationButton').on('click', function(e) {
		city = $('#destination').val();
		if (city !== "") {
			var params = { location: city };
			$.ajax({
				url: '/users/update',
				type: 'put',
				dataType: 'script',
				data: params
			});
		} else {
			alertDisplay("Please enter a city");
		}
	});
});
	
