// Convex polygons are defined as CCW list of point, therefore
// use right hand rule to determine whether you're "inside" or "outside"
public class LineSideEnum {
	private LineSideEnum() {}
	public static final LineSideEnum ON_LINE = new LineSideEnum();
	public static final LineSideEnum INSIDE = new LineSideEnum();
	public static final LineSideEnum OUTSIDE = new LineSideEnum();
}

function dotProduct(v1, v2){
	return (v1.x * v2.x) + (v1.y * v2.y);
}

public class Ray{
	var start, end;

	public Ray(_start, _end){
		start = _start;
		end = _end;
	}

	public function isMoreVertical(){
		return abs(end.x - start.x) < abs(end.y - start.y);
	}

	/* Given an input (x,y) value, return a value between 0.0 and 1.0 
	 * if the x would lie on the ray, use y if the line is near vertical
	 * return null otherwise.
	 * 
	 * DO NOT USE to check whether point is precisely on ray, but rather where
	 * along the ray is closest should it be near the ray
	 */
	public function pointToProgress(point){
		var x = point.x;
		var y = point.y;

		if (y < start.y || y > end.y) return null;
		if (x < start.x || x > end.x) return null;

		if (isMoreVertical()){
			var cY = (y - start.y);
			var endY = end.y - start.y;

			return cY / endY;
		} else {
			var cX = (x - start.x);
			var endX = end.x - start.x;

			return cx / endX;
		}
	}
}

public class Vector{
	var x, y;

	public Vector(_x, _y){
		x = _x;
		y = _y;
	}

	public function plus(v){
		return {"x": x + v.x, "y": y + v.y};
	}

	public function minus(v){
		return {"x": x - v.x, "y": y - v.y};
	}

	public function timesScalar(scalar){
		return {"x": scalar * x, "y": scalar * y};
	}
}

function lineSide(p1, p2, point){
	var x1 = p2.x - p1.x;
	var y1 = p2.y - p1.y;

	var normal = {x: -y1; y: x;};

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

	return ((a * a) + (b * b)) < (r * r);
}

/* Rectangle vs Rectangle
 * INPUT: rectangles specified by their minimum and maximum extents:
 *  r = {min:{x:, y:}, max:{x:, y:}}
 * RETURN VALUE:
 *  false if r1 and r2 do not intersect
 *  true if r1 and r2 do intersect
 */
function rectangleRectangle(r1, r2) {
	
	var minX = max(r1.min.x, r2.min.x);
	var minY = max(r1.min.y, r2.min.y);

	var maxX = min(r1.max.x, r2.max.x);
	var maxY = min(r1.max.x, r2.max.x);

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
		for (int j = 0; j < p1.length; j++){
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
function rayCircle(r, c) {
	var start = new Vector(r.start.x - c.x, r.start.y - c.y);
	var end = new Vector(r.end.x - c.x, r.end.y - c.y);

	var rayVector = new Vector(end.x - start.x, end.y - start.y);

	var radius = c.radius;

	// Quadratic Formula

	// TODO cull points that are not going to lead anywhere

	var a = (rayVector.x * rayVector.x) + (rayVector.y * rayVector.y);
	var b = 2 * ((rayVector.x * start.x) + (rayVector.y * start.y));
	var c = (start.x * start.x) + (start.y * start.y) - (radius * radius);

	var delta = b * b - (4 * a * c);

	var progress = null;

	// Check how many points of intersection there are
	if (delta == 0){ 
		// 1 intersection
		var u = -b / (2 * a);
		var point = start.plus(rayVector.timesScalar(u));

		progress = r.pointToProgress(point);
	} else if (delta > 0){
		// 2 intersections
		squareRootDelta = sqrt(delta);

		var u1 = (-b + squareRootDelta) / (2 * a);
		// var u2 = (-b - squareRootDelta) / (2.0 * a);

		var point = start.plus(rayVector.timesScalar(u1));

		progress = r.pointToProgress(point);
	}

	if (progress == null) {
		// There were 0 intersections
		return null;
	} else {
		return {"t" : progress};
	}
}

/* Ray vs Rectangle
 * INPUT: ray as above, rectangle as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayRectangle(r, b) {
	// Don't do unneccessary math if the ray is not possibly intersecting
	var maxY = max(ray.start.y, ray.end.y);
	if (maxY < b.min.y) return null;

	var minY = min(ray.start.y, ray.end.y);
	if (minY > b.max.y) return null;

	var maxX = max(ray.start.x, ray.end.x);
	if (maxX < b.min.x) return null;

	var minX = min(ray.start.x, ray.end.x);
	if (minX > b.max.x) return null;


	//TODO
	return null;

	return {"t": t};
}

/* Ray vs Convex
 * INPUT: ray as above, convex polygon as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayConvex(r, p) {
	//TODO
	return null;
}


module.exports = {
	circleCircle: circleCircle,
	rectangleRectangle: rectangleRectangle,
	convexConvex: convexConvex,
	rayCircle: rayCircle,
	rayRectangle: rayRectangle,
	rayConvex: rayConvex
};
