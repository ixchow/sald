var collision = require("sald:collide.js");

var GameObject = function(x_, y_, width_, height_, anchor_){
	var width = width_;
	var height = height_;

	if (!width) width = 0;
	if (!height) height = 0;

	var inputAnchor;
	var scaledAnchor;

	var heightChanged = false;
	var widthChanged = false;

	var hasCollisionRect = false;
	var hasCollisionCircle = false;
	var hasCollisionConvex = false;
	var wasInputRelative = false;

	this.transform = {
		x : x_,
		y : y_
	};

	var collisionRect = null;
	var collisionCircle = null;
	var collisionConvex = null;

	var inputRect = null;
	var inputCircle = null;
	var inputConvex = null;

	this.hasCollisionRect = function(){
		return hasCollisionRect;
	}

	this.hasCollisionCircle = function(){
		return hasCollisionCircle;
	}

	this.hasCollisionConvex = function(){
		return hasCollisionConvex;
	}

	this.collisionRect = function(){
		if (!hasCollisionRect){
			return null;
		}

		if (heightChanged || widthChanged){
			this.setCollisionRect(inputRect, wasInputRelative);
		}

		var x = this.transform.x + scaledAnchor.x;
		var y = this.transform.y + scaledAnchor.y;

		var bb = collisionRect;
		var min_ = {x : x + bb.min.x,
					y : y + bb.min.y};
		var max_ = {	
			x : x + bb.max.x,
			y : y + bb.max.y 
		}

		return {
			min : min_,
			max : max_
		};
	} 

	this.collisionCircle = function(){
		if (!hasCollisionCircle){
			return null;
		}

		if (heightChanged || widthChanged){
			this.setCollisionCircle(inputCircle, wasInputRelative);
		}

		var x = this.transform.x + scaledAnchor.x;
		var y = this.transform.y + scaledAnchor.y;

		var circle = {
			x : x + collisionCircle.x,
			y : y + collisionCircle.y,
			r : collisionCircle.r
		};

		return circle;
	} 

	this.collisionConvex = function(){
		if (!hasCollisionConvex){
			return null;
		}

		if (heightChanged || widthChanged){
			this.setCollisionConvex(inputConvex, wasInputRelative);
		}

		var poly = [];
		var points = this.collisionConvex;

		var x = this.transform.x + scaledAnchor.x;
		var y = this.transform.y + scaledAnchor.y;

		for (var i = 0; i < points.length; i++){
			var oldPoint = points[i];

			var pt = {
				x : oldPoint.x + x,
				y : oldPoint.y + y
			};

			poly.push(pt);
		}

		return poly;
	}

	this.getWidth = function() {
		return width;
	}

	this.getHeight = function() {
		return height;
	}

	this.setWidth = function(num){
		width = num;
		widthChanged = true;
	}

	this.setHeight = function(num){
		height = num;
		heightChanged = true;
	}

	this.setAnchor = function(anchor_){
		inputAnchor = anchor_;

		scaledAnchor = {
			x : anchor_.x * width,
			y : anchor_.y * height
		};
	}

	if (anchor_ === undefined || anchor_ === null){
		this.setAnchor({x : 0, y : 0});
	} else {
		this.setAnchor(anchor_);
	}

	this.getAnchor = function(){
		return {
			x : inputAnchor.x,
			y : inputAnchor.y
		};
	}

	this.getScaledAnchor = function(){
		return {
			x : scaledAnchor.x,
			y : scaledAnchor.y
		};
	}

	this.setCollisionRect = function(rect, isRelative){
		if (rect === null){
			hasCollisionRect = false;

			collisionRect = null;
			inputRect = null;
		} else {
			hasCollisionRect = true;
			wasInputRelative = isRelative;

			if (isRelative){
				collisionRect = {
					min : {
						x : (rect.min.x - inputAnchor.x) * width,
						y : (rect.min.y - inputAnchor.y) * height
					},
					max : {
						x : (rect.max.x - inputAnchor.x) * width,
						y : (rect.max.y - inputAnchor.y) * height
					}
				};
			} else {
				collisionRect = rect;
			}

			inputRect = rect;
		}

		hasCollisionCircle = false;
		hasCollisionConvex = false;
		heightChanged = false;
		widthChanged = false;
	}

	this.setCollisionCircle = function(circle, isRelative){
		if (circle === null){
			hasCollisionCircle = false;

			collisionCircle = null;
			inputCircle = null;
		} else {
			hasCollisionCircle = true;
			wasInputRelative = isRelative;

			if (isRelative){
				collisionCircle = {
					x : (circle.x - inputAnchor.x) * width,
					y : (circle.y - inputAnchor.y) * width,
					r : circle.r * width
				};
			} else {
				collisionCircle = circle;
			}

			inputCircle = circle;
		}

		hasCollisionRect = false;
		hasCollisionConvex = false;
		heightChanged = false;
		widthChanged = false;
	}

	this.setCollisionConvex = function(convex, isRelative){
		if (convex === null || convex.length === 0){
			hasCollisionConvex = false;

			collisionConvex = null
			inputConvex = null;
		} else {
			hasCollisionConvex = true;
			wasInputRelative = isRelative;

			if (isRelative){
				result = [];

				for (var i = 0; i < convex.length; i++){
					var pt = convex[i];

					var scaledPoint = {
						x : (pt.x - inputAnchor.x) * width,
						y : (pt.y - inputAnchor.y) * height
					}

					result.push(scaledPoint);
				}

				collisionConvex = result;
			} else {
				collisionConvex = convex;
			}

			inputConvex = convex;
		}

		hasCollisionRect = false;
		hasCollisionCircle = false;
		heightChanged = false;
		widthChanged = false;
	}

	this.setCollisionShape = function(shape, isRelative){
		if (shape.hasOwnProperty("rect")){
			this.setCollisionRect(shape.rect, isRelative);
		} else if (shape.hasOwnProperty("circle")){
			this.setCollisionCircle(shape.circle, isRelative);
		} else if (shape.hasOwnProperty("convex")){
			this.setCollisionConvex(shape.convex, isRelative);
		}
	}
}

GameObject.prototype.collisionShape = function() {
	if (this.hasCollisionRect()){
		return {rect : this.collisionRect()};
	} else if (this.hasCollisionCircle()){
		return {circle : this.collisionCircle()};
	} else if (this.hasCollisionConvex()){
		return {convex : this.collisionConvex()};
	} else {
		return null;
	}
};

GameObject.prototype.isColliding = function(obj2){
	var shape2 = obj2.collisionShape();
	if (shape2 === null) return false;

	var shape1 = this.collisionShape();
	if (shape1 === null) return false;

	if (shape1.hasOwnProperty("rect")){
		if (shape2.hasOwnProperty("rect")){
			return collision.rectangleRectangle(shape1.rect, shape2.rect);
		} else if (shape2.hasOwnProperty("circle")){
			return collision.circleConvex(shape2.circle, collision.convertRectToConvex(shape1.rect));
		} else if (shape2.hasOwnProperty("convex")){
			return collision.convexConvex(shape2.convex, collision.convertRectToConvex(shape1.rect));
		}
	} else if (shape1.hasOwnProperty("circle")){
		if (shape2.hasOwnProperty("circle")){
			return collision.circleCircle(shape1.circle, shape2.circle);
		} else if (shape2.hasOwnProperty("rect")){
			return collision.circleConvex(shape1.circle, collision.convertRectToConvex(shape2.rect));
		} else if (shape2.hasOwnProperty("convex")){
			return collision.circleConvex(shape1.circle, shape2.convex);
		}
	} else if (shape1.hasOwnProperty("convex")){
		if (shape2.hasOwnProperty("convex")){
			return collision.convexConvex(shape1.convex, shape2.convex);
		} else if (shape2.hasOwnProperty("rect")){
			return collision.convexConvex(shape1.convex, collision.convertRectToConvex(shape2.rect));
		} else if (shape2.hasOwnProperty("circle")){
			return collision.circleConvex(shape2.circle, shape1.convex);
		}
	}

	return false;
};

module.exports = GameObject;