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

function lineSide(p1, p2, point){
	var x1 = p2.x - p1.x;
	var y1 = p2.y - p1.y;

	var normal = {x: -y1; y: x;};

	var x2 = point.x - p1.x;
	var y2 = point.y - p1.y;

	var v2 = {"x" : x2, "y" : y2};

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
	//TODO
	return null;
}

/* Rav vs Rectangle
 * INPUT: ray as above, rectangle as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayRectangle(r, b) {
	//TODO
	return null;
}

/* Rav vs Convex
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
