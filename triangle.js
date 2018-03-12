var canvas = document.getElementById("canvas");
canvas.onselectstart = function() {
	return false;
}
var main = document.getElementById("main");
main.onselectstart = function() {
	return false;
}

var ctx = canvas.getContext("2d");
var posx, posy;
var drag = false,
	dragging = false;
var cursor = {};
var color, width, height;
var currx, curry, currIndex;
var states = [];

function state(x, y, w, h, c) {
	this.posx = x;
	this.posy = y;
	this.width = w;
	this.height = h;
	this.color = c;

}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkPoint(x, y, w, h, xx, yy) {
	return isInside(x, y, x + w / 2, y + h, x - w / 2, y + h, xx, yy);
}

function areaOfTriangle(x1, y1, x2, y2, x3, y3) {
	var sum = 0;
	sum = sum + x1 * (y2 - y3);
	sum = sum + x2 * (y3 - y1);
	sum = sum + x3 * (y1 - y2);
	sum = sum / 2;

	return Math.abs(sum);
}

function isInside(x1, y1, x2, y2, x3, y3, xx, yy) {
	var A = areaOfTriangle(x1, y1, x2, y2, x3, y3);
	var A1 = areaOfTriangle(xx, yy, x2, y2, x3, y3);
	var A2 = areaOfTriangle(x1, y1, xx, yy, x3, y3);
	var A3 = areaOfTriangle(x1, y1, x2, y2, xx, yy);

	var subSum = A1 + A2 + A3;
	return (A === subSum);
}

function getRndColor() {
	var r = 255 * Math.random() | 0,
		g = 255 * Math.random() | 0,
		b = 255 * Math.random() | 0;

	r = r + getRandomInt(100, 1000);
	r = r % 256;
	g = g + getRandomInt(100, 1000);
	g = g % 256;
	b = b + getRandomInt(100, 1000);
	b = b % 256;

	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function drawTriangle(context, x, y, triangleWidth, triangleHeight, color) {
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + triangleWidth / 2, y + triangleHeight);
	context.lineTo(x - triangleWidth / 2, y + triangleHeight);
	context.closePath();
	context.fillStyle = color;

	context.fill();
}

function doubleClick(e) {

	var dbx = e.pageX - this.offsetLeft;
	var dby = e.pageY - this.offsetTop;
	var triColor, index;

	var len = states.length;

	if (len != 0) {
		for (var i = len - 1; i >= 0; i--) {
			var elem = states[i];
			if (checkPoint(elem.posx, elem.posy, elem.width, elem.height, dbx, dby)) {

				states.splice(i, 1);
				clearScreen();
				states.forEach(function(element) {
					drawTriangle(ctx, element.posx, element.posy, element.width, element.height, element.color);
				});
				break;
			}
		}
	}
}

function mouseDown(e) {
	posx = e.pageX - this.offsetLeft;
	posy = e.pageY - this.offsetTop;
	var on = false;
	var len = states.length;

	if (len != 0) {
		for (var i = len - 1; i >= 0; i--) {
			var elem = states[i];
			if (checkPoint(elem.posx, elem.posy, elem.width, elem.height, posx, posy)) {

				darg = false;
				currx = posx - elem.posx;
				curry = posy - elem.posy;
				currIndex = i;
				dragging = true;
				on = true;
				break;
			}
		}
		if (!on) {

			color = getRndColor();
			drawTriangle(ctx, posx, posy, 1, 1, color);
			drag = true;
		}
	} else {
		color = getRndColor();
		drawTriangle(ctx, posx, posy, 1, 1, color);
		drag = true;
	}

}

function mouseMove(e) {
	if (drag) {
		cursor.x = e.pageX - this.offsetLeft;
		cursor.y = e.pageY - this.offsetTop;

		width = cursor.x - posx;
		height = cursor.y - posy;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (states.length != 0) {
			states.forEach(function(element) {
				drawTriangle(ctx, element.posx, element.posy, element.width, element.height, element.color);
			});
		}
		drawTriangle(ctx, posx, posy, width, height, color);
	}
	if (dragging) {
		cursor.x = e.pageX - this.offsetLeft;
		cursor.y = e.pageY - this.offsetTop;

		clearScreen();
		var len = states.length;
		for (var i = len - 1; i >= 0; i--) {
			var elem = states[i];
			if (i == currIndex) {
				elem.posx = cursor.x - currx;
				elem.posy = cursor.y - curry;
			}
			drawTriangle(ctx, elem.posx, elem.posy, elem.width, elem.height, elem.color);
		}
	}
}

function mouseUp(e) {
	if (drag) {
		states.push(new state(posx, posy, width, height, color));
		drag = false;
	}
	if (dragging) {
		dragging = false;
	}

}

function init() {
	canvas.addEventListener('mousedown', mouseDown, false);
	canvas.addEventListener('mouseup', mouseUp, false);
	canvas.addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('dblclick', doubleClick, false);
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var clear = document.getElementById('clear');
clear.onclick = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	states = [];
}

init();
