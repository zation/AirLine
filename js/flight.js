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
			y: (neLocation.lat() - location.lat()) * heightRadio
		};
	};

	return PositionReference;
})();
var draw_timer;

function draw_canvas(startPosition, endPosition) {
	var p0 = {
		x: startPosition.x,
		y: startPosition.y
	};
	var distance = Math.sqrt((startPosition.x - endPosition.x) * (startPosition.x - endPosition.x) + (startPosition.y - endPosition.y) * (startPosition.y - endPosition.y));
	var p1, p2;
	p1 = p2 = startPosition.x < endPosition.x ? {
		x: distance / 4 + startPosition.x,
		y: startPosition.y - distance / 2
	} : {
		x: distance / 4 + endPosition.x,
		y: endPosition.y - distance / 2
	};
	var p3 = {
		x: endPosition.x,
		y: endPosition.y
	};
	var traveller = {
		x: 0,
		y: 0,
		speed: 0.01,
		t: 0
	};
	var avatar = new Image();
	avatar.src = "image/mike.jpeg";

	var theCanvas = document.getElementById('draw_canvas');
	var context = theCanvas.getContext('2d');
	if (draw_timer) {
		clearInterval(draw_timer);
	}
	draw_timer = setInterval(draw, 33);

	function draw() {
		context.clearRect(0, 0, theCanvas.width, theCanvas.height);

		context.lineWidth = 3;
		context.strokeStyle = '#000';
		context.beginPath();
		context.moveTo(p0.x, p0.y);
		context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		context.stroke();

		var t = traveller.t;
		var cx = 3 * (p1.x - p0.x);
		var bx = 3 * (p2.x - p1.x) - cx;
		var ax = p3.x - p0.x - cx - bx;

		var cy = 3 * (p1.y - p0.y);
		var by = 3 * (p2.y - p1.y) - cy;
		var ay = p3.y - p0.y - cy - by;

		var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
		var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

		traveller.t += traveller.speed;

		if (traveller.t > 1) traveller.t = 1;

		context.drawImage(avatar, xt - avatar.width / 2, yt - avatar.height / 2);
	}
}

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
					var startPosition = position.getPosition(neLocation, swLocation, startLocation);
					var endPosition = position.getPosition(neLocation, swLocation, endLocation);

					draw_canvas(startPosition, endPosition);
				} else {
					console.log("Geocode was not successful for the following reason: " + status);
				}
			});
		} else {
			console.log("Geocode was not successful for the following reason: " + status);
		}
	});
}, false);
