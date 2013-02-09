$(function() {
	parseLocation($('input[name="origin"]')[0]);

	$( document ).tooltip();

	$('input[name="origin"]').on({
		// 'blur': function(e) {
		//	parseLocation(this);
		// },
		'keypress': function(e) {
			code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) {
				parseLocation(this);
			}
		}
	});

	// $('input[name="destination"], input[name="origin"]').on('focus', function() {
	// 	$(this).val('');
	// });

	$('input[name="destination"]').on({
		'keypress': function(e) {
			code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13) {
				parseLocation(this);
			}
		}
		// 'blur': function(e) {
		//	parseLocation(this);
		// }
  });

  $('#currentSalary').slider({
    orientation: "horizontal",
    range: "min",
    max: 100,
    slide: updateSalary
  });

	$('.locationButton').on('click', function(e) {
		city = $(this).next().val();
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
	
