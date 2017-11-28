var input = document.getElementById('input');
var output = document.getElementById('output');

output.style.textShadow = "black 2px 2px 6px";

input.onkeypress = function (e) {
  output.innerHTML = e.target.value;
};

setInterval(function () {
  var currentStyle = output.style.textShadow.split(' ');
  var xOffset = parseInt(currentStyle[1]);
  var yOffset = parseInt(currentStyle[2]);

  xOffset += rando();
  if (xOffset === 4) xOffset -= 1;
  if (xOffset === -4) xOffset += 1;

  yOffset += rando();
  if (yOffset === 4) yOffset -= 1;
  if (yOffset === -4) yOffset += 1;

  output.style.textShadow = `black ${xOffset}px ${yOffset}px 1px`;
}, 115)

function rando() {
  return Math.random() > 0.5 ? 1 : -1;
}
