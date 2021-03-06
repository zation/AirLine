var radius = 100;
var circle = {
  centerX: 250,
  centerY: 250,
  radius: 125,
  angle: 0
};
var ball = {
  x: 0,
  y: 0,
  speed: 0.01
};
var theCanvas = document.getElementById('theCanvas');
var context = theCanvas.getContext('2d');

setInterval(draw, 20);

function draw() {
  context.fillStyle = '#EEE';
  context.fillRect(0, 0, theCanvas.width, theCanvas.height);

  context.strokeStyle = '#000';
  context.strokeRect(1, 1, theCanvas.width - 2, theCanvas.height - 2);

  context.beginPath();
  context.strokeStyle = '#000';
  context.lineWidth = 3;
  context.arc(circle.centerX, circle.centerY, circle.radius, 0, (Math.PI / 180) * 360, false);
  context.stroke();
  context.closePath();

  ball.x = circle.centerX + Math.cos(circle.angle) * circle.radius;
  ball.y = circle.centerY + Math.sin(circle.angle) * circle.radius;

  circle.angle += ball.speed;

  context.fillStyle = '#000';
  context.beginPath();
  context.arc(ball.x, ball.y, 15, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
}
