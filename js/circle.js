var circle = {
  centerX: 250,
  centerY: 250,
  radius: 125,
  angle: 0
};

var theCanvas = document.getElementById('theCanvas');
var context = theCanvas.getContext('2d');

context.beginPath();
context.strokeStyle = '#000';
context.lineWidth = 3;

context.arc(circle.centerX, circle.centerY, circle.radius, 0, (Math.PI / 180) * 360, false);
context.stroke();
context.closePath();
