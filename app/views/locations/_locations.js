(function(myApp, $, undefined){

	$(document).ready(function() {
		bind();
		myApp.parseLocation($('input[name="origin"]')[0]);
	});

	function bind() {
		$('input[name="origin"], input[name="destination"]').on({
			'keypress': function(e) {
				code = (e.keyCode ? e.keyCode : e.which);
				if (code === 13) {
					// console.log(this);
					myApp.parseLocation(this);
				}
			}
		});

		$('#currentSalary').slider({
			orientation: "horizontal",
			range: "min",
			max: 100,
			slide: myApp.updateSalary
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
				myApp.alertDisplay("Please enter a city");
			}
		});

		$( document ).tooltip();
		$("div[id^='flash']").fadeOut(3000);
		
	}

	$.extend(myApp, {

		parseLocation: function(input) {
			var objectId = '#' + input.id + '-map';
			var cityName = $(input).val();
			var params = { city: cityName };
			$.ajax({
				url: '/',
				type: 'get',
				dataType: 'json',
				data: params,
				success: function(result) {
					if (!!result.location) {
						myApp.location = myApp.locationFactory(result);
						myApp.updateMap(result, objectId);
						myApp.updateSalary();
						myApp.updateText(result, objectId);
					} else {
						var selector = '#' + objectId.slice(1,-4);
						$(selector).val('');
						myApp.alertDisplay('City not found.');
					}
			// this.origin = this.locationFactory(cityName);
			// console.log(origin);
				}
			});
		},

		locationFactory: function(result) {
			
			var name = result.location.city,
					indices = result.cost_index,
					map = myApp.locationUrl(result);
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
		},

		newLocation: function(cityName, objectId) {
			var params = { city: cityName };
			$.ajax({
				url: '/',
				type: 'get',
				dataType: 'json',
				data: params,
				success: function(result) {
					if (!!result.location) {
						$(objectId).data(result.cost_index);
						myApp.updateMap(result, objectId);
						myApp.updateSalary();
						myApp.updateText(result, objectId);
					} else {
						var name = '#' + objectId.slice(1,-4);
						$(name).val('');
						myApp.alertDisplay('City not found.');
					}
				}
			});
		}



	});


// $.extend(myApp, app);

console.log(myApp);

// $.extend(myApp, {
// 	blab: "blab"
// });

}(window.myApp = window.myApp || {}, jQuery));



	//define origin location

	//create location object. instantiate origin location, then destination location.





	
// });//document loaded
	
//.extend, .proxy jquery


