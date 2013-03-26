(function(myApp, $, undefined){
	Number.prototype.formatMoney = function(){
		i = parseInt(this.toFixed(0), 0) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
		return '$' + (j ? i.substr(0, j) + "," : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",");
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

		updateSalaries: function() {
			var scalar = $( "#currentSalary" ).slider( "value" ),
					salary = scalar * 2500,
					destSalary = '$0';
			$('#salaryDisplay').text(salary.formatMoney());
			if ( myApp.destination ) {
				destSalary = myApp.missingIndices() ? 'N/A' : myApp.comparableSalary(salary);
			}
			$('#compSalaryDisplay').text(destSalary);
		},

		missingIndices: function() {
			return myApp.destination.indices.composite === 0.0 || myApp.origin.indices.composite === 0.0;
		},

		comparableSalary: function(salary) {
			return (salary * myApp.salaryRatio()).formatMoney();
		},

		salaryRatio: function() {
			var origin = myApp.origin.indices.composite;
			var destination = myApp.destination.indices.composite;
			return destination / origin;
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
		},

		updateUserSalary: function() {
			if ($('#salaryDisplay').text() === "$0" ) {
				$('#salaryDisplay').text(myApp.userSalary.formatMoney());
				$('#currentSalary').slider("value", (myApp.userSalary / 2500 ));
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
			(function init() {
				$('#' + locationTarget).val(name);//set text field value to city and state
				$('#' + locationTarget + '-map').css('background-image', map)
							.css('background-position', 'center');
			})();

			return {
				name: name,
				indices: indices
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
						myApp.loggedInUser = (result.user.email === "none" ) ? false : true;
						myApp.userSalary = result.user.salary;
						myApp.user = result.user;
						myApp[target] = myApp.locationFactory(result, target);
						myApp.updateSalaries();
						myApp.updateUserSalary();
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
				if ( myApp.loggedInUser ) {			//if there's a logged in user
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
			if ( myApp.loggedInUser ) {							//if there's a logged in user
				HTML = '<p>Current monthly expenses: </p>';
				for ( var j = 0; j < categories.length; j++ ) {
					var index = myApp.user[categories[j]] || 'Not set (' + cost_indices[categories[j]] + ' index)';
					HTML += '<p>' + myApp.capitalize(categories[j]) + ': ' + index + '</p>';
				}
			} else {						//if there's no logged in user
				for ( var i = 0; i < categories.length; i++ ) {
					HTML += '<p>' + myApp.capitalize(categories[i]) + ': ' + cost_indices[categories[i]] + '</p>';
				}
			}
			return HTML;
		}
	});


}(window.myApp = window.myApp || {}, jQuery));

