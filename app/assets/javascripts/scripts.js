$(function() {
	newLocation($('input[name="origin"]')[0]);
	$( document ).tooltip();

	$('input[name="origin"]').on({
		// 'blur': function(e) {
		//	newLocation(this);
		// },
		'keypress': function(e) {
			code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) {
				newLocation(this);
			}
		}
	});

	$('input[name="destination"]').on({
		'keypress': function(e) {
			code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13) {
				// animateMaps();
				newLocation(this);
			}
		}
		// 'blur': function(e) {
		//	animateMaps();
		//	newLocation(this);
		// }
  });

  $('#arrowButton').on('click', function(e) {
		newLocation($('input[name="origin"]')[0]);
		newLocation($('input[name="destination"]')[0]);
		// setTimeout(animateMaps, 750);
  });


  $('#currentSalary').slider({
    orientation: "horizontal",
    range: "min",
    max: 100,
    value: 100,
    slide: updateSalary,
    change: updateSalary
  });
	$( "#currentSalary" ).slider( "value", 0 );



});
	
Number.prototype.formatMoney = function(c, d, t){
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };	

var updateSalary = function() {
	var scalar = $( "#currentSalary" ).slider( "value" );
	var salary = scalar * 2500;
	$('#salaryDisplay').text(salary.formatMoney(0, '.', ','));
	var destSalary = ($('#destination-map').data().index === 0.0) ? "N/A" : relativeSalary(salary);
	$('#compSalaryDisplay').text(destSalary);
};
	
var relativeSalary = function(salary) {
	return (salary * salaryRatio()).formatMoney(0, '.', ',');
};

var salaryRatio = function() {
	var origin = $('#origin-map').data().index;
	var destination = $('#destination-map').data().index;
	return destination / origin;
};

var locationUrl = function(data) {
	return 'url(http://maps.googleapis.com/maps/api/staticmap?center=' + 
				data.location.latitude + ',' + data.location.longitude + 
				'&zoom=10&size=1200x1200&scale=2&format=jpg&maptype=satellite&sensor=false&key=' +	
				data.key + ')';
};

var newLocation = function(input) {
	var objectId = '#' + input.id + '-map';
	var cityName = $(input).val();
	params = { city: cityName };
	$.ajax({
		url: '/',
		type: 'get',
		dataType: 'json',
		data: params,
		success: function(result) {
			if (!!result.location) {
				$(objectId).data( {index: result.cost_index.composite} );
				updateText(result, objectId);
				updateMap(result, objectId);
				updateSalary();	
			} else {
				$(input).val('City not found');			
			}
		}
	});
};

var updateText = function(result, objectId) {
	var name = '#' + objectId.slice(1,-4);
	$(name).val(result.location.city);
	var indices = result.cost_index;
	var cost = (indices.composite === 0.0) ? "N/A" : indices.composite;
	$(objectId + ' .costIndex').text("Cost of living index: " + cost);
	$(objectId + ' .secondaryIndices').empty().append('<p>Grocery: ' + indices.grocery + '</p>' +
								'<p>Housing: ' + indices.housing + '</p>' +
								'<p>Utilities: ' + indices.utilities + '</p>' + 
								'<p>Transportation: ' + indices.transportation + '</p>' + 
								'<p>Health Care: ' + indices.health + '</p>' + 
								'<p>Miscellaneous: ' + indices.misc + '</p>');
};

var updateMap = function(result, objectId) {
	$(objectId).css('background-image', locationUrl(result));
	$(objectId).css('background-position', 'center');
};


