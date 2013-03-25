// $(document).ready(function () {
//   $("div[id^='flash']").fadeOut(3000);
// });

(function(myApp, $, undefined){
	Number.prototype.formatMoney = function(c, d, t){
		var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	   return '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};

	$.extend(myApp, {
		categories: ["grocery",
									"housing",
									"utilities",
									"transportation",
									"health",
									"misc"],

		alertDisplay: function(message) {
			$('#alerts').html("").append('<p>' + message + '</p>').fadeIn('slow', function() {
				$(this).fadeOut(2000);
			});
		},

		updateSalary: function() {
			var scalar = $( "#currentSalary" ).slider( "value" );
			var salary = scalar * 2500;
			var destSalary = '$0';
			$('#salaryDisplay').text(salary.formatMoney(0, '.', ','));
			if ( myApp.destination) {
				destSalary = (myApp.destination.indices.composite === 0.0 || myApp.origin.indices.composite === 0.0) ? "N/A" : myApp.comparableSalary(salary);
			}
			$('#compSalaryDisplay').text(destSalary);
			myApp.updateUserSalary();
		},
			
		comparableSalary: function(salary) {
			return (salary * myApp.salaryRatio()).formatMoney(0, '.', ',');
		},

		salaryRatio: function() {
			var origin = myApp.origin.indices.composite;
			var destination = myApp.destination.indices.composite;
			return destination / origin;
		},

		updateCityName: function(target) {
			$('#' + target).val(myApp[target].name);//set text field value to city and state
		},

		updateCostOfLiving: function(target) {
			var indices = myApp[target].indices;
			var costOfLiving = (indices.composite === 0.0) ? "N/A" : indices.composite;
			$('#' + target + '-map' + ' .costIndex').text("Cost of living index: " + costOfLiving);
		},

		updateIndices: function() {
			if ( myApp.origin.indices.composite === 0.0 ) {
				$('#origin-map .secondaryIndices').empty().append('');
				$('#destination-map .secondaryIndices').empty().append('');
			} else {
				myApp.originIndices();
				myApp.destinationIndices();
			}
			
			//display secondary indices if they exist
			// if ( myApp[target].indices.composite !== 0.0 ) {
			// 	if (target === "origin") {
			// 		myApp.originIndices();
			// 	} else {
			// 		myApp.destinationIndices();
			// 	}
			// } else {
			// 	$('#' + target + '-map .secondaryIndices').empty().append('');
			// }
		},

		// updateMap: function(target) {
		// 	$('#' + target + '-map').css('background-image', myApp[target].map)
		// 					.css('background-position', 'center');
		// },

		updateUserSalary: function() {
			if ($('#salaryDisplay').text() === "$0" && myApp.user.salary ) {
				$('#salaryDisplay').text(myApp.user.salary.formatMoney(0, '.', ','));
				$('#currentSalary').slider("value", (myApp.user.salary / 2500 ));
			}
		},

		staticMapAddress: function(data) {
			return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' +
						data.location.latitude + ',' + data.location.longitude +
						'&zoom=10&size=1200x1200&scale=2&format=jpg&maptype=satellite&sensor=false&key=' +
						data.key + ')';
		},

		locationFactory: function(result, target) {
			var name = result.location.city,
					indices = result.cost_index,
					map = myApp.staticMapAddress(result),
					locationTarget = target;
			updateMap = function() {
				$('#' + locationTarget + '-map').css('background-image', map)
							.css('background-position', 'center');
			};
			// updateIndices = function(newIndices) {
			// 	this.indices = newIndices;
			// };
			return {
				name: name,
				indices: indices,
				// map: map,
				updateMap: updateMap
				// updateName: updateName,
				// updateIndices: updateIndices
			};
		},

		saveUserLocation: function(e) {
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
			var params = { city: $(input).val()};
			$.ajax({
				url: '/',
				type: 'get',
				dataType: 'json',
				data: params,
				success: function(result) {
					if (!!result.location) {
						myApp.user = result.user;
						//myApp.originSalary = myApp.salaryFactory(result);
						//myApp.comparableSalary = myApp.salaryFactory(result);
						//myApp.indices = myApp.indicesFactory(result);
						myApp[target] = myApp.locationFactory(result, target);
						myApp[target].updateMap();
						// myApp.updateMap(target);
						myApp.updateSalary();
						myApp.updateCityName(target);
						myApp.updateCostOfLiving(target);
						myApp.updateIndices(target);
					} else {
						$(input).val('');
						myApp.alertDisplay('City not found.');
					}
				}
			});
		},

		destinationIndices: function() {
			var indicesHTML = myApp.destinationIndicesToHTML();
			$('#destination-map' + ' .secondaryIndices').empty().append(indicesHTML);
		},

		destinationIndicesToHTML: function() {
			var HTML = '';
			if ( myApp.destination && myApp.destination.indices.composite !== 0 ) {
				var categories = myApp.categories;
				if ( myApp.user.email !== "none" ) {			//if there's a logged in user
					HTML = "<p>Estimated monthly expenses:</p>";
				}
				for (var i = 0, length = categories.length; i < length; i++ ) {
					HTML += myApp.destinationIndicesToString(categories[i]);
				}
			}
			return HTML;
		},

		capitalize: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},

		destinationIndicesToString: function(property) {
			var originIndex = myApp.origin.indices[property];
			var index = myApp.destination.indices[property];
			var percentage = index / originIndex;
			var userValue = myApp.user[property];
			//if the user has set a value for category, display as dollar figure
			if ( userValue ) {
				return '<p>' + myApp.capitalize(property) + ': $' + Math.round(percentage * userValue) + '</p>';
			} else {			//otherwise display as a percentage
				return '<p>' + myApp.capitalize(property) + ': ' + Math.round(percentage * 100) + '%</p>';
			}
		},

		originIndices: function() {
			var originHTML = myApp.originIndicesToHTML();
			$('#origin-map' + ' .secondaryIndices').empty().append(originHTML);
		},

		originIndicesToHTML: function() {
			var HTML = '';
			var cost_indices = myApp.origin.indices;
			var categories = myApp.categories;
			if ( myApp.user.email === "none" ) {				//if there's no logged in user
				for ( var i = 0; i < categories.length; i++ ) {
					HTML += '<p>' + myApp.capitalize(categories[i]) + ': ' + cost_indices[categories[i]] + '</p>';
				}
			} else {																		//if there's a logged in user
				HTML = '<p>Current monthly expenses: </p>';
				for ( var j = 0; j < categories.length; j++ ) {
					var index = myApp.user[categories[j]] || 'Not set (' + cost_indices[categories[j]] + ' index)';
					HTML += '<p>' + myApp.capitalize(categories[j]) + ': ' + index + '</p>';
				}
			}
			return HTML;
		}
	});
	

}(window.myApp = window.myApp || {}, jQuery));

