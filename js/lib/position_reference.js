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