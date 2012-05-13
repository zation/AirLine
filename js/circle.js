var circle = {
  centerX: 640,
  centerY: 480,
  radius: 10,
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
