// $(document).ready(function () {
//   $("div[id^='flash']").fadeOut(3000);
// });

(function(myApp, $, undefined){
	Number.prototype.formatMoney = function(c, d, t){
		var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	   return '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};

	myApp.alertDisplay = function(message) {
		$('#alerts').html("").append('<p>' + message + '</p>').fadeIn('slow', function() {
		$(this).fadeOut(2000);
		});
	};

	myApp.updateSalary = function() {
		var scalar = $( "#currentSalary" ).slider( "value" );
		var salary = scalar * 2500;
		var destSalary = '$0';
		$('#salaryDisplay').text(salary.formatMoney(0, '.', ','));
		if ( myApp.destination) {
			destSalary = (myApp.destination.indices.composite === 0.0) ? "N/A" : myApp.relativeSalary(salary);
		}
		$('#compSalaryDisplay').text(destSalary);
	};
		
	myApp.relativeSalary = function(salary) {
		return (salary * myApp.salaryRatio()).formatMoney(0, '.', ',');
	};

	myApp.salaryRatio = function() {
		var origin = myApp.origin.indices.composite;
		var destination = myApp.destination.indices.composite;
		return destination / origin;
	};

	myApp.updateText = function(target, objectId) {
		var name = '#' + target;
		$(name).val(myApp[target].name);//set text field value to city and state
		
		var indices = myApp[target].indices;
		var cost = (indices.composite === 0.0) ? "N/A" : indices.composite;

		//load user's salary setting and the slider position unless it's already displayed
		if ($('#salaryDisplay').text() === "$0" && myApp.user.salary ) {
			$('#salaryDisplay').text(myApp.user.salary.formatMoney(0, '.', ','));
			$('#currentSalary').slider("value", (myApp.user.salary / 2500 ));
		}

		//display composite cost of living index
		$(name + '-map' + ' .costIndex').text("Cost of living index: " + cost);

		//display secondary indices if they exist
		// var categories = ["grocery", "housing", "utilities", "transportation", "health", "misc"];
		if ( cost !== "N/A") {
			if (target === "origin") {
				myApp.originSecondaries();
			} else {
				myApp.destinationSecondaries();
			}
		} else {
			$('#' + target + '-map .secondaryIndices').empty().append('');
		}
	};

	myApp.destinationSecondaries = function() {
		// $('#origin-map' + ' .secondaryIndices').empty();
		var indicesHTML = myApp.buildIndicesHTML();
		$('#destination-map' + ' .secondaryIndices').empty().append(indicesHTML);
	};

	myApp.buildIndicesHTML = function() {
		var HTML = '';
		if ( myApp.destination.indices.composite !== 0 ) {
			var categories = myApp.categories;
			if ( myApp.user.email !== "none" ) {			//if there's a logged in user
				HTML = "<p>Estimated monthly expenses:</p>";
			}
			for (var i = 0, length = categories.length; i < length; i++ ) {
				HTML += myApp.destString(categories[i]);
			}
		}
		return HTML;
	};

	myApp.capitalize = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	myApp.destString = function(property, result) {
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
	};

	myApp.originSecondaries = function() {
		var originHTML = myApp.buildOriginHTML();
		$('#origin-map' + ' .secondaryIndices').empty().append(originHTML);
	};

	myApp.buildOriginHTML = function() {
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
	};

	myApp.updateMap = function(target) {
		$('#' + target + '-map').css('background-image', myApp[target].map)
						.css('background-position', 'center');
	};

	myApp.staticMapAddress = function(data) {
		return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' +
					data.location.latitude + ',' + data.location.longitude +
					'&zoom=10&size=1200x1200&scale=2&format=jpg&maptype=satellite&sensor=false&key=' +
					data.key + ')';
	};

}(window.myApp = window.myApp || {}, jQuery));

