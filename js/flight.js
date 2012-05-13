var PositionReference = (function() {
	function PositionReference(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
	}

	PositionReference.prototype.getPosition = function(neLocation, swLocation, location) {
		var canvasHeight = this.canvasHeight;
		var canvasWidth = this.canvasWidth;
		var geoWidth = neLocation.lng() - swLocation.lng();
		var geoHeight = neLocation.lat() - swLocation.lat();
		var widthRadio = canvasWidth / geoWidth;
		var heightRadio = canvasHeight / geoHeight;
		return {
			x: (location.lng() - swLocation.lng()) * widthRadio,
			y: (location.lat() - swLocation.lat()) * heightRadio
		};
	};

	return PositionReference;
})();
var canvas = document.getElementById("map_canvas");
var myOptions = {
	center: new google.maps.LatLng(30.615829, 104.079065),
	zoom: 8,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(canvas, myOptions);

document.getElementById('find').addEventListener('click', function() {
	var startCityName = document.getElementById('start-city').value,
		endCityName = document.getElementById('end-city').value,
		startLocation, endLocation, leftLocation, rightLocation, bound, geocoder = new google.maps.Geocoder(),
		position = new PositionReference(canvas.offsetWidth, canvas.offsetHeight);
	geocoder.geocode({
		'address': startCityName
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			startLocation = results[0].geometry.location;

			geocoder.geocode({
				'address': endCityName
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					endLocation = results[0].geometry.location;
					if (startLocation.lng() > endLocation.lng()) {
						leftLocation = endLocation;
						rightLocation = startLocation;
					} else {
						leftLocation = startLocation;
						rightLocation = endLocation;
					}

					bound = new google.maps.LatLngBounds(leftLocation, rightLocation);

					map.fitBounds(bound);
					var neLocation = map.getBounds().getNorthEast();
					var swLocation = map.getBounds().getSouthWest();
					console.log(position.getPosition(neLocation, swLocation, startLocation));
					console.log(position.getPosition(neLocation, swLocation, endLocation));
				} else {
					console.log("Geocode was not successful for the following reason: " + status);
				}
			});
		} else {
			console.log("Geocode was not successful for the following reason: " + status);
		}
	});
}, false);
