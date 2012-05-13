var AirLine = (function() {
	function AirLine(mapElement, canvasElement) {
		this.map = new google.maps.Map(mapElement, {
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		this.canvas = canvasElement;
		this.context = canvasElement.getContext('2d');
		this.animation = new Animation(canvasElement);
	}

	AirLine.prototype.fly = function(startCityName, endCityName, image) {
		var startLocation, endLocation, leftLocation, rightLocation, bound, geocoder = new google.maps.Geocoder(),
			position = new PositionReference(this.canvas.offsetWidth, this.canvas.offsetHeight),
			animation = this.animation,
			map = this.map;
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
						var startPosition = position.getPosition(neLocation, swLocation, startLocation);
						var endPosition = position.getPosition(neLocation, swLocation, endLocation);

						animation.action(startPosition, endPosition, image);
					} else {
						console.log("Geocode was not successful for the following reason: " + status);
					}
				});
			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});
	};
	return AirLine;
})();
