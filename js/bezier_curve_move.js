var p0 = {
	x: 50,
	y: 350
};
var p1 = {
	x: 250,
	y: 250
};
var p2 = {
	x: 400,
	y: 250
};
var p3 = {
	x: 600,
	y: 350
};
var ball = {
	x: 0,
	y: 0,
	speed: 0.01,
	t: 0
};

var theCanvas = document.getElementById('theCanvas');
var context = theCanvas.getContext('2d');

setInterval(draw, 33);

function draw() {
	context.fillStyle = '#EEE';
  context.fillRect(0, 0, theCanvas.width, theCanvas.height);

  context.strokeStyle = '#000';
  context.strokeRect(1, 1, theCanvas.width - 2, theCanvas.height - 2);

  context.lineWidth = 3;
  context.strokeStyle = '#000';
  context.beginPath();
  context.moveTo(p0.x, p0.y);
  context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  context.stroke();

	var t = ball.t;
	var cx = 3 * (p1.x - p0.x);
	var bx = 3 * (p2.x - p1.x) - cx;
	var ax = p3.x - p0.x - cx - bx;

	var cy = 3 * (p1.y - p0.y);
	var by = 3 * (p2.y - p1.y) - cy;
	var ay = p3.y - p0.y - cy - by;

	var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
	var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

	ball.t += ball.speed;

	if (ball.t > 1) ball.t = 1;

	context.fillStyle = '#000';
	context.beginPath();
	context.arc(xt, yt, 10, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
}
