var avatar = new Image();
avatar.src = "image/mike.jpeg";

var airLine = new AirLine(document.getElementById('map_canvas'), document.getElementById('draw_canvas'));

document.getElementById('find').addEventListener('click', function() {
	airLine.fly(document.getElementById('start-city').value, document.getElementById('end-city').value, avatar);
}, false);
