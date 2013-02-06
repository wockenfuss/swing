$(function() {
	parseLocation($('input[name="origin"]')[0]);
	// newLocation($('input[name="origin"]');

	$( document ).tooltip();

	$('input[name="origin"]').on({
		// 'blur': function(e) {
		//	newLocation(this);
		// },
		'keypress': function(e) {
			code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) {
				parseLocation(this);
				// newLocation(this);
			}
		}
	});

	$('input[name="destination"]').on({
		'keypress': function(e) {
			code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13) {
				parseLocation(this);
				// newLocation(this);
			}
		}
		// 'blur': function(e) {
		//	animateMaps();
		//	newLocation(this);
		// }
  });

  $('#currentSalary').slider({
    orientation: "horizontal",
    range: "min",
    max: 100,
    // value: 50,
    slide: updateSalary,
    // change: updateSalary
  });
	$( "#currentSalary" ).slider( "value", 0 );

	$('.locationButton').on('click', function(e) {
		city = $(this).next().val();
		if (city !== "") {
			var params = { location: city };
			$.ajax({
				url: '/users/update',
				type: 'put',
				dataType: 'json',
				data: params,
				success: function(result) {
					console.log("success");
				}
			});
		} else {
			$(this).next().val("Please enter a city");
		}
	});

});
	
