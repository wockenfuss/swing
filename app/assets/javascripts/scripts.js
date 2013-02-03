$(function() {
	newLocation($('input[name="origin"]')[0]);

	$('input[name="origin"]').on({
		// 'blur': function(e) {
		// 	newLocation(this);
		// },
		'keypress': function(e) {
	    code= (e.keyCode ? e.keyCode : e.which);
	    if (code == 13) {
	    	newLocation(this);
	   	}
	  }
	});

	$('input[name="destination"]').on({
		'keypress': function(e) {
    	code = (e.keyCode ? e.keyCode : e.which);
    	if (code == 13) {
    		animateMaps();
    		newLocation(this);
    	}
  	}
  	// 'blur': function(e) {
  	// 	animateMaps();
  	// 	newLocation(this);
  	// }
  });

  $('#arrowButton').on('click', function(e) {
  	newLocation($('input[name="origin"]')[0]);
  	newLocation($('input[name="destination"]')[0]);
  	setTimeout(animateMaps, 750);
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
	// console.log(salary);
	$('#salaryDisplay').text(salary.formatMoney(0, '.', ','));
	$('#compSalaryDisplay').text(relativeSalary(salary));
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
				data.latitude + ',' + data.longitude + 
				'&zoom=10&size=1200x1200&scale=2&format=jpg&maptype=satellite&sensor=false&key=' +	
				data.key + ')'
};

var newLocation = function(input) {
	var objectId = '#' + input.id + '-map';
	var cityName = $(input).val();
	params = { city: cityName }
	$.ajax({
		url: '/',
		type: 'get',
		dataType: 'json',
		data: params,
		success: function(result) {
			$(objectId).data( {index: result.location.cost_index.composite} );
			// $.data(objectId, "costIndex", result.location.cost_index.composite )
			updateText(result, objectId);
			// $('#origin-index').text(result.location.cost_index.composite)
			updateMap(result, objectId);
		}
	});
};

var updateText = function(result, objectId) {
	var name = '#' + objectId.slice(1,-4);
	$(name).val(result.location.city);
	$(objectId + ' .costIndex').text("Cost of living index: " + result.location.cost_index.composite);
};

var updateMap = function(result, objectId) {
	var data = result.location
	$(objectId).css('background-image', locationUrl(data));
	$(objectId).css('background-position', 'center');
};

var animateMaps = function() {
	$('#origin-map').animate({
    width: '400px',
  }, 1000, function() {
    // Animation complete.
  });
  $('#destination-map').css('display', 'inline-block');
  $('#destination-map').animate({
    width: '400px',
  }, 1000, function() {
    $('#compSalary').fadeIn('slow');
  });
};

