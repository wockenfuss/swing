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

		$('.locationButton').on('click', myApp.setUserLocation);
		$( document ).tooltip();
		$("div[id^='flash']").fadeOut(3000);
	}

	$.extend(myApp, {

		categories: ["grocery", "housing", "utilities", "transportation", "health", "misc"],

		setUserLocation: function(e) {
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
				myApp.alertDisplay("Please enter a city");
			}
		},
		setLocation: function(e) {
			code = (e.keyCode ? e.keyCode : e.which);
			if (code === 13) {
				myApp.parseLocation(e.target);
			}
		},

		parseLocation: function(input) {
			var target = input.id;
			// var cityName = $(input).val();
			var params = { city: $(input).val()};
			$.ajax({
				url: '/',
				type: 'get',
				dataType: 'json',
				data: params,
				success: function(result) {
					if (!!result.location) {
						myApp.user = result.user;
						myApp[target] = myApp.locationFactory(result);
						myApp.updateMap(target);//result, objectId);
						myApp.updateSalary();
						myApp.updateText(target);//result, objectId);
					} else {
						$(input).val('');
						myApp.alertDisplay('City not found.');
					}
				}
			});
		},

		locationFactory: function(result) {
			var name = result.location.city,
					indices = result.cost_index,
					map = myApp.staticMapAddress(result);
			updateName = function(newName) {
				this.name = newName;
			};
			updateIndices = function(newIndices) {
				this.indices = myApp.newIndices;
			};
			return {
				name: name,
				indices: indices,
				map: map,
				updateName: myApp.updateName,
				updateIndices: myApp.updateIndices
			};
		}
	});

}(window.myApp = window.myApp || {}, jQuery));

//.extend, .proxy jquery


