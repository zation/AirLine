(function($) {
	function MyOverlay(map, avatarPath, pinPath) {
		this.avatarPath = avatarPath;
		this.pinPath = pinPath;
		this.map = map;
	}

	MyOverlay.prototype = new google.maps.OverlayView();

	MyOverlay.prototype.setLocation = function(location) {
		this.location = location;
	};

	MyOverlay.prototype.onAdd = function() {
		var markerHtml = '<div class="marker">' + '<img class="avatar" src="' + this.avatarPath + '" />' + '<img class="pin" src="' + this.pinPath + '" />' + '</div>';
		var marker = $(markerHtml).appendTo(this.getPanes().overlayLayer);
		this.marker = marker.css({
			'opacity': 0,
			'position': 'absolute'
		});
		this.marker.find('.avatar').css({
			'position': 'absolute',
			'top': -17,
			'border-radius': 20,
			'width': 48
		})
		this.markerWidth = marker.width();
		this.markerHeight = marker.height();
	};

	MyOverlay.prototype.setLocation = function(location) {
		this.location = location;
	};

	MyOverlay.prototype.getPosition = function() {
		var overlayProjection = this.getProjection();
		var position = overlayProjection.fromLatLngToDivPixel(this.location);
		return {
			'top': position.y - this.markerHeight,
			'left': position.x - this.markerWidth / 2
		}
	};

	MyOverlay.prototype.getPositionReferToContainer = function() {
		var overlayProjection = this.getProjection();
		var position = overlayProjection.fromLatLngToContainerPixel(this.location);
		return {
			'top': position.y - this.markerHeight,
			'left': position.x - this.markerWidth / 2
		}
	};

	MyOverlay.prototype.draw = function() {
		this.marker.css(this.getPosition());
	};

	MyOverlay.prototype.hide = function(location, callback) {
		this.setLocation(location);
		var position = this.getPosition();
		var positionReferToContainer = this.getPositionReferToContainer();
		var top = position.top == positionReferToContainer.top ? 0 : position.top - positionReferToContainer.top;
		this.marker.css({
			'top': top,
			'left': position.left
		});
		this.marker.animate({
			'opacity': 1,
			'top': position.top
		}, 2000, 'easeOutBounce', callback);
	};

	MyOverlay.prototype.show = function(location, callback) {
		this.setLocation(location);
		var position = this.getPosition();
		this.marker.css({
			'top': position.top,
			'left': position.left,
			'opacity': 1
		});
		this.marker.animate({
			'opacity': 0,
			'top': 0
		}, 2000, 'easeInBounce', callback);
	};

	MyOverlay.prototype.onRemove = function() {
		this.marker.remove();
	};

	function animate(map, startCityName, endCityName, overlay) {

		var geocoder = new google.maps.Geocoder();

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

						google.maps.event.addListenerOnce(map, 'idle', function() {
							overlay.show(startLocation, function() {
								google.maps.event.addListenerOnce(map, 'idle', function() {
									overlay.hide(endLocation);
								});
								map.panTo(endLocation);
							});
						});

						overlay.setLocation(startLocation);
						map.setCenter(startLocation);
					} else {
						console.log("Geocode was not successful for the following reason: " + status);
					}
				});
			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	$.fn.fly = function(startCityName, endCityName, avatarPath, pinPath) {
		return this.each(function() {
			var mapElement = $(this);
			var mapOffset = mapElement.offset();
			var map = new google.maps.Map(this, {
				disableDefaultUI: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoom: 6
			});
			var overlay = new MyOverlay(map, avatarPath, pinPath);
			overlay.setMap(map);

			animate(map, startCityName, endCityName, overlay);
		});
	}
})(jQuery);
