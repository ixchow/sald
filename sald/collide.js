// Convex polygons are defined as CCW list of point, therefore
// use right hand rule to determine whether you're "inside" or "outside"
function LineSideEnum() {
	this.ON_LINE = new LineSideEnum();
	this.INSIDE = new LineSideEnum();
	this.OUTSIDE = new LineSideEnum();
}

function dotProduct(v1, v2){
	return (v1.x * v2.x) + (v1.y * v2.y);
}

// Ray Class

function Ray(start, end){
	this.start = new Vector(start.x, start.y);
	this.end = new Vector(end.x, end.y);
}

Ray.prototype.isMoreVertical = function() {
	return Math.abs(this.end.x - this.start.x) < Math.abs(this.end.y - this.start.y);
}

/* Given an input (x,y) value, return a value between 0.0 and 1.0 
 * if the x would lie on the ray, use y if the line is near vertical
 * return null otherwise.
 * 
 * DO NOT USE to check whether point is precisely on ray, but rather where
 * along the ray is closest should it be near the ray
 */
Ray.prototype.pointToProgress = function(point){
	var x = point.x;
	var y = point.y;

	if (y < Math.min(this.start.y, this.end.y) || y > Math.max(this.end.y, this.start.y)){
		return null;
	}
	if (x < Math.min(this.start.x, this.end.x) || x > Math.max(this.end.x, this.start.x)){
		return null;
	}

	if (this.isMoreVertical()){
		var cY = (y - this.start.y);
		var endY = this.end.y - this.start.y;

		return cY / endY;
	} else {
		var cX = (x - this.start.x);
		var endX = this.end.x - this.start.x;

		return cx / endX;
	}
}

// Vector Class

function Vector(x, y){
	this.x = x;
	this.y = y;
}

Vector.prototype.plus = function(v){
	return {"x": this.x + v.x, "y": this.y + v.y};
}

Vector.prototype.minus = function(v){
	return {"x": this.x - v.x, "y": this.y - v.y};
}

Vector.prototype.timesScalar = function(scalar){
	return {"x": scalar * this.x, "y": scalar * this.y};
}

function lineSide(p1, p2, point){
	var x1 = p2.x - p1.x;
	var y1 = p2.y - p1.y;

	var normal = {"x": -y1, "y": x1};

	var x2 = point.x - p1.x;
	var y2 = point.y - p1.y;

	var v2 = new Vector(x2, y2);

	var dotProd = dotProduct(normal, v2);

	if (dotProd == 0.0){
		return LineSideEnum.ON_LINE;
	} else if (dotProd < 0.0){
		return LineSideEnum.INSIDE;
	} else {
		return LineSideEnum.OUTSIDE;
	}
}

/* Circle vs Circle
 * INPUT: two circles specified by position and radius:
 *  c1 = {x:, y:, r:}, c2 = {x:, y:, r:}
 * RETURN VALUE:
 *  false if c1 and c2 do not intersect
 *  true if c1 and c2 do intersect
 */
function circleCircle(c1,c2) {
	var a = (c1.x - c2.x);
	var b = (c1.y - c2.y);
	var dist = c1.r + c2.r;

	return ((a * a) + (b * b)) < (dist * dist);
}

/* Rectangle vs Rectangle
 * INPUT: rectangles specified by their minimum and maximum extents:
 *  r = {min:{x:, y:}, max:{x:, y:}}
 * RETURN VALUE:
 *  false if r1 and r2 do not intersect
 *  true if r1 and r2 do intersect
 */
function rectangleRectangle(r1, r2) {
	
	var minX = Math.max(r1.min.x, r2.min.x);
	var minY = Math.max(r1.min.y, r2.min.y);

	var maxX = Math.min(r1.max.x, r2.max.x);
	var maxY = Math.min(r1.max.y, r2.max.y);

	var x = maxX - minX;
	var y = maxY - minY;

	return (x * y) > 0;
}

/* Convex vs Convex
 * INPUT: convex polygons as lists of vertices in CCW order
 *  p = [{x:,y:}, ..., {x:, y:}]
 * RETURN VALUE:
 *  false if p1 and p2 do not intersect
 *  true if p1 and p2 do intersect
 */
function convexConvex(p1, p2) {

	/* Loop through each edge in polygon p2
	 */
	for (var i = 0; i < p2.length; i++){
		var iNext = i + 1 % p2.length;

		var a = p2[i];
		var b = p2[iNext];

		var netSide = LineSideEnum.OUTSIDE;

		/* For each edge on shape p2, check if each j in p1 is on the 
		 * outside-side of of the polygon p2. 
		 */
		for (var j = 0; j < p1.length; j++){
			var side = lineSide(a, b, point);

			if (side == LineSideEnum.INSIDE){
				netSide = LineSideEnum.INSIDE;
				break;
			}
		}

		/* If all points are on the outside-side of the line,
		 * we know that the two shapes don't intersect
		 */
		if (netSide == LineSideEnum.OUTSIDE){
			return false;
		}
	}

	/* If there is no clear separation axis between convex p1 and convex p2,
	 * then the two shapes must be intersecting.
	 */
	return true;
}

/* Ray vs Circle
 * INPUT: ray specified as a start and end point, circle as above.
 *  ray = {start:{x:, y:}, end:{x:, y:}}
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayCircle(ray, c) {
	// If ray starts in the circle
	if (circleCircle({"x" : ray.start.x, "y" : ray.start.y, "r" : 0}, c)){
		return {"t" : 0.0};
	}

	var r = new Ray(ray.start, ray.end);

	var localStart = new Vector(r.start.x - c.x, r.start.y - c.y);
	var localEnd = new Vector(r.end.x - c.x, r.end.y - c.y);

	var localRayVector = new Vector(localEnd.x - localStart.x, localEnd.y - localStart.y);

	var radius = c.r;

	// Quadratic Formula

	// TODO cull points that are not going to lead anywhere

	var a = (localRayVector.x * localRayVector.x) + (localRayVector.y * localRayVector.y);
	var b = 2 * ((localRayVector.x * localStart.x) + (localRayVector.y * localStart.y));
	var c = (localStart.x * localStart.x) + (localStart.y * localStart.y) - (radius * radius);

	var delta = (b * b) - (4 * a * c);

	var progress = null;
	var p1 = r.start;

	// Check how many points of intersection there are
	if (delta == 0){ 
		// 1 intersection
		var u = -b / (2 * a);
		var point = p1.plus(localRayVector.timesScalar(u));

		progress = r.pointToProgress(point);
	} else if (delta > 0){
		// 2 intersections
		squareRootDelta = Math.sqrt(delta);

		//var u1 = (-b + squareRootDelta) / (2 * a);
		var u2 = (-b - squareRootDelta) / (2.0 * a);
		
		var point = p1.plus(localRayVector.timesScalar(u2));

		progress = r.pointToProgress(point);
	}

	if (progress == null) {
		// There were 0 intersections
		return null;
	} else {
		return {"t" : progress};
	}
}

function allPointsOnOneSideOfBoundingBox(ray, box){
	var maxY = Math.max(ray.start.y, ray.end.y);
	if (maxY < box.min.y) return true;

	var minY = Math.min(ray.start.y, ray.end.y);
	if (minY > box.max.y) return true;

	var maxX = Math.max(ray.start.x, ray.end.x);
	if (maxX < box.min.x) return true;

	var minX = Math.min(ray.start.x, ray.end.x);
	if (minX > box.max.x) return true;

	return false;
}

function getBoundingBox(poly){
	var minX = Number.MAX_VALUE;
	var minY = Number.MAX_VALUE;
	var maxX = Number.MIN_VALUE;
	var maxY = Number.MIN_VALUE;

	for (var i = 0; i < poly.length; i++){
		var point = poly[i];

		minX = Math.min(point.x, minX);
		minY = Math.min(point.y, minY);
		maxX = Math.max(point.x, maxX);
		maxY = Math.max(point.y, maxY);
	}

	var minP = {"x": minX, "y": minY};
	var maxP = {"x": maxX, "y": maxY};

	return {"min": minP, "max": maxP};
}

function findRayIntersectPoly(ray, points){
	var numPoints = points.length;

	var vertical = false;

	for (var i = 0; i < numPoints; i++){
		var iNext = (i+1) % numPoints;

		var p1 = points[i];
		var p2 = points[iNext];

		var startLineSide = lineSide(p1, p2, ray.start);
		var endLineSide = lineSide(p1, p2, ray.end);

		/* If a ray starts on the shape, should this be considered an intersection?
		 * This may be bad for ray "coming from" some rectangle
		 */
		if (startLineSide == LineSideEnum.ON_LINE){
			return {"t" : 0.0};
		} else if (endLineSide == LineSideEnum.ON_LINE){
			return {"t" : 1.0};
		}

		if (startLineSide != endLineSide){
			// from http://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line

			var x1y2 = (p1.x * p2.y);
			var y1x2 = (p1.y * p2.x);
			var x3minusX4 = (ray.start.x - ray.end.x);
			var x1minusX2 = (p1.x - p2.x);
			var x3y4 = (ray.start.x * ray.end.y);
			var y3x4 = (ray.start.y * ray.end.x);
			var y3minusY4 = (ray.start.y - ray.end.y);
			var y1minusY2 = (ray.start.y - ray.end.y);

			var denom = (x1minusX2 * y3minusY4) - (y1minusY2 * x3minusX4);

			// If they're parallel, avoid div by zero
			if (denom != 0){
				var x1y2minusY1x2 = (x1y2 - y1x2);
				var x3y4minusY3x4 = (x3y4 - y3x4);

				var xNumerator = (x1y2minusY1x2 * x3minusX4) - (x1minusX2 * x3y4minusY3x4);
				var yNumerator = (x1y2minusY1x2 * y3minusY4) - (y1minusY2 * x3y4minusY3x4);

				var x = xNumerator/denom;
				var y = yNumerator/denom;

				if (vertical){
					if (y > Math.min(p1.y, p2.y) && y < Math.max(p1.y, p2.y)){
						var progress = ray.pointToProgress({"x": x, "y": y});
						return {"t": progress};
					}
				} else {
					if (x > Math.min(p1.x, p2.x) && x < Math.max(p1.x, p2.x)){
						var progress = ray.pointToProgress({"x": x, "y": y});
						return {"t": progress};
					}
				}
			}
		}
		vertical = !vertical;
	}
	return null;
}

/* Ray vs Rectangle
 * INPUT: ray as above, rectangle as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayRectangle(ray, box) {
	// Don't do unneccessary math if the ray is not possibly intersecting
	
	if (allPointsOnOneSideOfBoundingBox(ray, box)){
		return null;
	}

	var bl = box.min;
	var tr = box.max;
	var tl = {"x": bl.x, "y": tr.y};
	var br = {"x": tr.x, "y": bl.y};

	var points = [bl, br, tr, tl];
	
	return findRayIntersectPoly(ray, points);
}

/* Ray vs Convex
 * INPUT: ray as above, convex polygon as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayConvex(ray, poly) {
	/* cacheing said bounding box within the poly object would help 
	 * reduce computation considerably
	 */
	var boundingBox = getBoundingBox(poly);

	if (allPointsOnOneSideOfBoundingBox(ray, boundingBox)){
		return null;
	}

	return findRayIntersectPoly(ray, poly);
}


module.exports = {
	circleCircle: circleCircle,
	rectangleRectangle: rectangleRectangle,
	convexConvex: convexConvex,
	rayCircle: rayCircle,
	rayRectangle: rayRectangle,
	rayConvex: rayConvex
};
