
/* Circle vs Circle
 * INPUT: two circles specified by position and radius:
 *  c1 = {x:, y:, r:}, c2 = {x:, y:, r:}
 * RETURN VALUE:
 *  false if c1 and c2 do not intersect
 *  true if c1 and c2 do intersect
 */
function circleCircle(c1,c2) {
	var to = {
		x:c2.x - c1.x,
		y:c2.y - c1.y
	};
	var lenSq = to.x * to.x + to.y * to.y;
	if (lenSq <= (c2.r + c1.r) * (c2.r + c1.r)) {
		return true;
	} else {
		return false;
	}
}

/* Rectangle vs Rectangle
 * INPUT: rectangles specified by their minimum and maximum extents:
 *  r = {min:{x:, y:}, max:{x:, y:}}
 * RETURN VALUE:
 *  false if r1 and r2 do not intersect
 *  true if r1 and r2 do intersect
 */
function rectangleRectangle(r1, r2) {
	if (r1.max.x < r2.min.x) return false;
	if (r1.min.x > r2.max.x) return false;
	if (r1.max.y < r2.min.y) return false;
	if (r1.min.y > r2.max.y) return false;
	return true;
}

/* Convex vs Convex
 * INPUT: convex polygons as lists of vertices in CCW order
 *  p = [{x:,y:}, ..., {x:, y:}]
 * RETURN VALUE:
 *  false if p1 and p2 do not intersect
 *  true if p1 and p2 do intersect
 */
function convexConvex(p1, p2) {

	function separated(convex, pts) {
		var prev = convex[convex.length-1];
		return convex.some(function(at){
			var perp = {
				x:-(at.y - prev.y),
				y:at.x - prev.x
			};
			
			var limit = perp.x * prev.x + perp.y * prev.y;

			var allOutside = !pts.some(function(p){
				return p.x * perp.x + p.y * perp.y > limit;
			});

			if (allOutside) return true;

			prev = at;
		});
	}

	return !(separated(p1, p2) || separated(p2, p1));
}

/* Rav vs Circle
 * INPUT: ray specified as a start and end point, circle as above.
 *  ray = {start:{x:, y:}, end:{x:, y:}}
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayCircle(r, c) {
	//check for starting inside circle:
	var lenSq = (r.start.x - c.x) * (r.start.x - c.x) + (r.start.y - c.y) * (r.start.y - c.y);
	if (lenSq <= c.r * c.r) return {t:0.0};

	//solve quadratic equation for: (t * to + r.start - c)^2 - c.r^2 = 0
	var to = {
		x:r.end.x - r.start.x,
		y:r.end.y - r.start.y
	};
	
	var a = to.x * to.x + to.y * to.y;
	if (a == 0.0) return null;

	var b = 2.0 * (to.x * (r.start.x - c.x) + to.y * (r.start.y - c.y));
	var c = (r.start.x - c.x) * (r.start.x - c.x) + (r.start.y - c.y) * (r.start.y - c.y) - c.r * c.r;

	var d = b * b - 4.0 * a * c;
	if (d < 0.0) return null;
	var center = -b / (2.0 * a);
	var rad = Math.sqrt(d) / (2.0 * a);

	//check bounds:
	if (center - rad > 1.0) return null;
	if (center + rad < 0.0) return null;

	return {t:center - rad};
}

/* Rav vs Rectangle
 * INPUT: ray as above, rectangle as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayRectangle(r, b) {
	//Lazy mode:
	return rayConvex(r, [
		{x:b.min.x, y:b.min.y},
		{x:b.max.x, y:b.min.y},
		{x:b.max.x, y:b.max.y},
		{x:b.min.x, y:b.max.y}
		]);

	return null;
}

/* Rav vs Convex
 * INPUT: ray as above, convex polygon as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayConvex(r, convex) {
	var to = {
		x:r.end.x - r.start.x,
		y:r.end.y - r.start.y
	};

	var minInside = 0.0;
	var maxInside = 1.0;

	var prev = convex[convex.length-1];
	convex.forEach(function(at){
		//Check for t such that
		// (t * to + r.start - at) * perp > 0

		var perp = {
			x:-(at.y - prev.y),
			y:  at.x - prev.x
		};

		var amt =-((r.start.x - at.x) * perp.x + (r.start.y - at.y) * perp.y);
		var slope = to.x * perp.x + to.y * perp.y;

		//rephrasing the above, want t * slope > amt
		
		//prune the min/maxInside range:
		if (slope > 0.0) {
			//ray is moving toward the inside, so update the minimum position:
			if (minInside * slope < amt) {
				minInside = amt / slope;
			}
		} else if (slope == 0.0) {
			//ray is parallel to the side
			if (amt < 0.0) {
				//if it misses the side, then it can't intersect:
				minInside = Infinity;
				maxInside =-Infinity;
			}
		} else { //slope < 0.0
			//ray is moving toward the outside, so update maximum intersection:
			if (maxInside * slope < amt) {
				maxInside = amt / slope;
			}
		}

		prev = at;
	});

	if (minInside > maxInside) return null;
	return {t:minInside};
}


module.exports = {
	circleCircle: circleCircle,
	rectangleRectangle: rectangleRectangle,
	convexConvex: convexConvex,
	rayCircle: rayCircle,
	rayRectangle: rayRectangle,
	rayConvex: rayConvex
};
