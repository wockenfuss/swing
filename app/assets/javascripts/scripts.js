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
		$('#salaryDisplay').text(salary.formatMoney(0, '.', ','));
		var destSalary = ($('#destination-map').data().composite === 0.0) ? "N/A" : myApp.relativeSalary(salary);
		$('#compSalaryDisplay').text(destSalary);
	};
		
	myApp.relativeSalary = function(salary) {
		return (salary * myApp.salaryRatio()).formatMoney(0, '.', ',');
	};

	myApp.salaryRatio = function() {
		var origin = $('#origin-map').data().composite;
		var destination = $('#destination-map').data().composite;
		console.log(origin);
		console.log(destination);
		return destination / origin;
	};

	myApp.updateText = function(result, objectId) {
		var name = '#' + objectId.slice(1,-4);
		$(name).val(result.location.city);//set text field value to city and state
		var indices = result.cost_index;
		var cost = (indices.composite === 0.0) ? "N/A" : indices.composite;

		//load user's salary setting and the slider position unless it's already displayed
		if ($('#salaryDisplay').text() === "$0" && result.user.salary ) {
			$('#salaryDisplay').text(result.user.salary.formatMoney(0, '.', ','));
			$('#currentSalary').slider("value", (result.user.salary / 2500 ));
		}

		//display composite cost of living index
		$(objectId + ' .costIndex').text("Cost of living index: " + cost);

		//display secondary indices if they exist
		var categories = ["grocery", "housing", "utilities", "transportation", "health", "misc"];
		if ( cost !== "N/A") {
			if (objectId === "#origin-map") {
				myApp.originSecondaries(result, categories);
			} else {
				myApp.destinationSecondaries(result, categories);
			}
		}
	};

	myApp.destinationSecondaries = function(result, categories) {
		// $('#origin-map' + ' .secondaryIndices').empty();
		var indicesHTML = myApp.buildIndicesHTML(result, categories);
		$('#destination-map' + ' .secondaryIndices').empty().append(indicesHTML);
	};

	myApp.buildIndicesHTML = function(result, categories) {
		var HTML = '';
		if ( result.user.email !== "none" ) {			//if there's a logged in user
			HTML = "<p>Estimated monthly expenses:</p>";
		}
		for (var i = 0, length = categories.length; i < length; i++ ) {
			HTML += myApp.destString(categories[i], result);
		}
		return HTML;
	};

	myApp.capitalize = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	myApp.destString = function(property, result) {
		var originIndex = $('#origin-map').data()[property];
		var index = result.cost_index[property];
		var percentage = index / originIndex;
		var userValue = result.user[property];
		//if the user has set a value for category, display as dollar figure
		if ( userValue ) {
			return '<p>' + myApp.capitalize(property) + ': $' + Math.round(percentage * userValue) + '</p>';
		} else {			//otherwise display as a percentage
			return '<p>' + myApp.capitalize(property) + ': ' + Math.round(percentage * 100) + '%</p>';
		}
	};

	myApp.originSecondaries = function(result, categories) {
		var originHTML = myApp.buildOriginHTML(result, categories);
		$('#origin-map' + ' .secondaryIndices').empty().append(originHTML);
	};

	myApp.buildOriginHTML = function(result, categories) {
		var HTML = '';
		if ( result.user.email === "none" ) {				//if there's no logged in user
			for ( var i = 0; i < categories.length; i++ ) {
				HTML += '<p>' + myApp.capitalize(categories[i]) + ': ' + result.cost_index[categories[i]] + '</p>';
			}
		} else {																		//if there's a logged in user
			HTML = '<p>Current monthly expenses: </p>';
			for ( var j = 0; j < categories.length; j++ ) {
				var index = result.user[categories[j]] || 'Not set (' + result.cost_index[categories[j]] + ' index)';
				HTML += '<p>' + myApp.capitalize(categories[j]) + ': ' + index + '</p>';
			}
		}
		return HTML;
	};

	myApp.updateMap = function(result, objectId) {
		$(objectId).css('background-image', myApp.locationUrl(result));
		$(objectId).css('background-position', 'center');
	};

	myApp.locationUrl = function(data) {
		return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' +
					data.location.latitude + ',' + data.location.longitude +
					'&zoom=10&size=1200x1200&scale=2&format=jpg&maptype=satellite&sensor=false&key=' +
					data.key + ')';
	};

}(window.myApp = window.myApp || {}, jQuery));



// var parseLocation = function(input) {
// 	var objectId = '#' + input.id + '-map';
// 	var cityName = $(input).val();
// 	newLocation(cityName, objectId);
// };

// var newLocation = function(cityName, objectId) {
// 	var params = { city: cityName };
// 	$.ajax({
// 		url: '/',
// 		type: 'get',
// 		dataType: 'json',
// 		data: params,
// 		success: function(result) {
// 			if (!!result.location) {
// 				$(objectId).data(result.cost_index);
// 				updateMap(result, objectId);
// 				updateSalary();
// 				updateText(result, objectId);
// 			} else {
// 				var name = '#' + objectId.slice(1,-4);
// 				$(name).val('');
// 				alertDisplay('City not found.');
// 			}
// 		}
// 	});
// };

// var alertDisplay = function(message) {
// 	$('#alerts').html("").append('<p>' + message + '</p>').fadeIn('slow', function() {
// 	$(this).fadeOut(2000);
// 	});
// };


// var updateSalary = function() {
// 	var scalar = $( "#currentSalary" ).slider( "value" );
// 	var salary = scalar * 2500;
// 	$('#salaryDisplay').text(salary.formatMoney(0, '.', ','));
// 	var destSalary = ($('#destination-map').data().composite === 0.0) ? "N/A" : relativeSalary(salary);
// 	$('#compSalaryDisplay').text(destSalary);
// };
	
// var relativeSalary = function(salary) {
// 	return (salary * salaryRatio()).formatMoney(0, '.', ',');
// };

// var salaryRatio = function() {
// 	var origin = $('#origin-map').data().composite;
// 	var destination = $('#destination-map').data().composite;
// 	return destination / origin;
// };

// var updateText = function(result, objectId) {
// 	var name = '#' + objectId.slice(1,-4);
// 	$(name).val(result.location.city);//set text field value to city and state
// 	var indices = result.cost_index;
// 	var cost = (indices.composite === 0.0) ? "N/A" : indices.composite;

// 	//load user's salary setting and the slider position unless it's already displayed
// 	if ($('#salaryDisplay').text() === "$0" && result.user.salary ) {
// 		$('#salaryDisplay').text(result.user.salary.formatMoney(0, '.', ','));
// 		$('#currentSalary').slider("value", (result.user.salary / 2500 ));
// 	}

// 	//display composite cost of living index
// 	$(objectId + ' .costIndex').text("Cost of living index: " + cost);

// 	//display secondary indices if they exist
// 	var categories = ["grocery", "housing", "utilities", "transportation", "health", "misc"];
// 	if ( cost !== "N/A") {
// 		if (objectId === "#origin-map") {
// 			originSecondaries(result, categories);
// 		} else {
// 			destinationSecondaries(result, categories);
// 		}
// 	}
// };

// var destinationSecondaries = function(result, categories) {
// 	// $('#origin-map' + ' .secondaryIndices').empty();
// 	var indicesHTML = buildIndicesHTML(result, categories);
// 	$('#destination-map' + ' .secondaryIndices').empty().append(indicesHTML);
// };

// var buildIndicesHTML = function(result, categories) {
// 	var HTML = '';
// 	if ( result.user.email !== "none" ) {			//if there's a logged in user
// 		HTML = "<p>Estimated monthly expenses:</p>";
// 	}
// 	for (var i = 0, length = categories.length; i < length; i++ ) {
// 		HTML += destString(categories[i], result);
// 	}
// 	return HTML;
// };

// var capitalize = function(string) {
// 	return string.charAt(0).toUpperCase() + string.slice(1);
// };

// var destString = function(property, result) {
// 	var originIndex = $('#origin-map').data()[property];
// 	var index = result.cost_index[property];
// 	var percentage = index / originIndex;
// 	var userValue = result.user[property];
// 	//if the user has set a value for category, display as dollar figure
// 	if ( userValue ) {
// 		return '<p>' + capitalize(property) + ': $' + Math.round(percentage * userValue) + '</p>';
// 	} else {			//otherwise display as a percentage
// 		return '<p>' + capitalize(property) + ': ' + Math.round(percentage * 100) + '%</p>';
// 	}
// };

// var originSecondaries = function(result, categories) {
// 	var originHTML = buildOriginHTML(result, categories);
// 	$('#origin-map' + ' .secondaryIndices').empty().append(originHTML);
// };

// var buildOriginHTML = function(result, categories) {
// 	var HTML = '';
// 	if ( result.user.email === "none" ) {				//if there's no logged in user
// 		for ( var i = 0; i < categories.length; i++ ) {
// 			HTML += '<p>' + capitalize(categories[i]) + ': ' + result.cost_index[categories[i]] + '</p>';
// 		}
// 	} else {																		//if there's a logged in user
// 		HTML = '<p>Current monthly expenses: </p>';
// 		for ( var j = 0; j < categories.length; j++ ) {
// 			var index = result.user[categories[j]] || 'Not set (' + result.cost_index[categories[j]] + ' index)';
// 			HTML += '<p>' + capitalize(categories[j]) + ': ' + index + '</p>';
// 		}
// 	}
// 	return HTML;
// };

// var updateMap = function(result, objectId) {
// 	$(objectId).css('background-image', locationUrl(result));
// 	$(objectId).css('background-position', 'center');
// };

// var locationUrl = function(data) {
// 	return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' +
// 				data.location.latitude + ',' + data.location.longitude +
// 				'&zoom=10&size=1200x1200&scale=2&format=jpg&maptype=satellite&sensor=false&key=' +
// 				data.key + ')';
// };