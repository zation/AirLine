(function($) {
	function animate(map, startCityName, endCityName, avatar) {

		geocoder = new google.maps.Geocoder();

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
							avatar.animate({
								opacity: 1
							}, 2000, function() {
								google.maps.event.addListenerOnce(map, 'idle', function() {
									avatar.animate({
										opacity: 0
									}, 2000);
								});
								map.panTo(endLocation);
							});
						});
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
		var avatar = $('.avatar');
		if (avatar.length == 0) {
			var avatarHtml = '<div class="avatar">' + '<img class="avatar-image" src="' + avatarPath + '" />' + '<img class="pin" src="' + image / pin_map.png + '" />' + '</div>';
			$('body').append(avatarHtml);
			avatar = $('.avatar').css({
				'opacity': 0,
				'position': 'absolute'
			});
		}

		return this.each(function() {
			var mapElement = $(this);
			var mapOffset = mapElement.offset();
			var map = new google.maps.Map(this, {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoom: 6
			});

			avatar.offset({
				top: mapOffset.top + mapElement.height() / 2 - avatar.height(),
				left: mapOffset.left + mapElement.width() / 2 - avatar.width() / 2
			})
			animate(map, startCityName, endCityName, avatar);
		});
	}
})(jQuery);
