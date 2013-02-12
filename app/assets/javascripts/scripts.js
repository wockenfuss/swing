$(document).ready(function () {
  $("div[id^='flash']").fadeOut(3000);
});

Number.prototype.formatMoney = function(c, d, t){
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

var updateSalary = function() {
	var scalar = $( "#currentSalary" ).slider( "value" );
	var salary = scalar * 2500;
	$('#salaryDisplay').text(salary.formatMoney(0, '.', ','));
	var destSalary = ($('#destination-map').data().composite === 0.0) ? "N/A" : relativeSalary(salary);
	$('#compSalaryDisplay').text(destSalary);
};
	
var relativeSalary = function(salary) {
	return (salary * salaryRatio()).formatMoney(0, '.', ',');
};

var salaryRatio = function() {
	var origin = $('#origin-map').data().composite;
	var destination = $('#destination-map').data().composite;
	return destination / origin;
};

var locationUrl = function(data) {
	return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' +
				data.location.latitude + ',' + data.location.longitude +
				'&zoom=10&size=1200x1200&scale=2&format=jpg&maptype=satellite&sensor=false&key=' +
				data.key + ')';
};

var newLocation = function(cityName, objectId) {
	var params = { city: cityName };
	$.ajax({
		url: '/',
		type: 'get',
		dataType: 'json',
		data: params,
		success: function(result) {
			if (!!result.location) {
				$(objectId).data(result.cost_index);
				updateMap(result, objectId);
				updateSalary();
				updateText(result, objectId);
			} else {
				var name = '#' + objectId.slice(1,-4);
				$(name).val('');
				alertDisplay('City not found.');
			}
		}
	});
};

var alertDisplay = function(message) {
	$('#alerts').html("").append('<p>' + message + '</p>').fadeIn('slow', function() {
	$(this).fadeOut(2000);
	});
};

var parseLocation = function(input) {
	var objectId = '#' + input.id + '-map';
	var cityName = $(input).val();
	newLocation(cityName, objectId);
};

var updateText = function(result, objectId) {
	var name = '#' + objectId.slice(1,-4);
	$(name).val(result.location.city);
	var indices = result.cost_index;
	var cost = (indices.composite === 0.0) ? "N/A" : indices.composite;
	if ($('#salaryDisplay').text() === "$0" && result.user.salary ) {
		$('#salaryDisplay').text(result.user.salary.formatMoney(0, '.', ','));
		$('#currentSalary').slider("value", (result.user.salary / 2500 ));
	}
	$(objectId + ' .costIndex').text("Cost of living index: " + cost);
	var categories = ["grocery", "housing", "utilities", "transportation", "health", "misc"];

	if ( cost !== "N/A") {
		if (objectId === "#origin-map") {
			originSecondaries(result, categories);
		} else {
			destinationSecondaries(result, categories);
		}
	}
};

var destinationSecondaries = function(result, categories) {
	// $('#origin-map' + ' .secondaryIndices').empty();
	var indicesHTML = buildIndicesHTML(result, categories);
	$('#destination-map' + ' .secondaryIndices').empty().append(indicesHTML);
};

var buildIndicesHTML = function(result, categories) {
	var HTML = '';
	if ( result.user.email !== "none" ) {
		HTML = "<p>Estimated monthly expenses:</p>";
	}
	for (var i = 0, length = categories.length; i < length; i++ ) {
		HTML += destString(categories[i], result);
	}
	return HTML;
};

var capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

var destString = function(property, result) {
	var originIndex = $('#origin-map').data()[property];
	var index = result.cost_index[property];
	var percentage = index / originIndex;
	var userValue = result.user[property];
	if ( result.user[property]) {
		return '<p>' + capitalize(property) + ': $' + Math.round(percentage * userValue) + '</p>';
	} else {
		return '<p>' + capitalize(property) + ': ' + Math.round(percentage * 100) + '%</p>';
	}
};

var originSecondaries = function(result, categories) {
	var originHTML = buildOriginHTML(result, categories);
	$('#origin-map' + ' .secondaryIndices').empty().append(originHTML);
};

var buildOriginHTML = function(result, categories) {
	var HTML = '';
	if ( result.user.email === "none" ) {
		for ( var i = 0; i < categories.length; i++ ) {
			HTML += '<p>' + capitalize(categories[i]) + ': ' + result.cost_index[categories[i]] + '</p>';
		}
	} else {
		HTML = '<p>Current monthly expenses: </p>';
		for ( var j = 0; j < categories.length; j++ ) {
			var index = result.user[categories[j]] || 'Not set (' + result.cost_index[categories[j]] + ' index)';
			HTML += '<p>' + capitalize(categories[j]) + ': ' + index + '</p>';
		}
	}
	return HTML;
};

var updateMap = function(result, objectId) {
	$(objectId).css('background-image', locationUrl(result));
	$(objectId).css('background-position', 'center');
};