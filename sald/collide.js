/* Circle vs Circle
 * INPUT: two circles specified by position and radius:
 *  c1 = {x:, y:, r:}, c2 = {x:, y:, r:}
 * RETURN VALUE:
 *  false if c1 and c2 do not intersect
 *  true if c1 and c2 do intersect
 */
function circleCircle(c1,c2) {
    var rsum = c1.r + c2.r;
    var dx = c1.x - c2.x;
    var dy = c1.y - c2.y;
    var distsq = dx*dx + dy*dy
    
    return rsum*rsum > distsq;
}

/* Rectangle vs Rectangle
 * INPUT: rectangles specified by their minimum and maximum extents:
 *  r = {min:{x:, y:}, max:{x:, y:}}
 * RETURN VALUE:
 *  false if r1 and r2 do not intersect
 *  true if r1 and r2 do intersect
 */
function rectangleRectangle(r1, r2) {
    return r1.min.x < r2.max.x  // no gap in [r2.max.x,r1.min.x]
        && r2.min.x < r1.max.x  // no gap in [r1.max.x,r2.min.x]
        && r1.min.y < r2.max.y  // no gap in [r2.max.y,r1.min.y]
        && r2.min.y < r1.max.y; // no gap in [r1.max.y,r2.min.y]
}

/* Convex vs Convex
 * INPUT: convex polygons as lists of vertices in CCW order
 *  p = [{x:,y:}, ..., {x:, y:}]
 * RETURN VALUE:
 *  false if p1 and p2 do not intersect
 *  true if p1 and p2 do intersect
 */
function convexConvex(p1, p2) {
    return convexConvexHelper(p1, p2) && convexConvexHelper(p2, p1)
}

function convexConvexHelper(p1, p2) {
    for (var i = 0; i < p1.length; i++) {
        var x1 = p1[i].x;
        var y1 = p1[i].y;
        
        var x2 = p1[(i+1) % p1.length].x;
        var y2 = p1[(i+1) % p1.length].y;
        
        var x3 = p1[(i+2) % p1.length].x;
        var y3 = p1[(i+2) % p1.length].y;
        
        var p1Side = lineSide(x1, y1, x2, y2, x3, y3);
        var p2Side = 0;
        
        for (var j = 0; j < p2.length; j++) {
            var p2x = p2[j].x;
            var p2y = p2[j].y;
            
            p2Side = lineSide(x1, y1, x2, y2, p2x, p2y);
            if (p1Side == p2Side) {
                break;
            }
        }
        
        if (p1Side != p2Side) {
            return false;
        }
    }
    
    return true;
}

function lineSide(x1, y1, x2, y2, px, py) {
    return Math.sign((x1-x2)*(py-y1) - (y1-y2)*(px-x1));
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
    // Reference: http://math.stackexchange.com/questions/311921/get-location-of-vector-circle-intersection
    var ray_dx = r.end.x - r.start.x;
    var ray_dy = r.end.y - r.start.y;
    var A = ray_dx * ray_dx + ray_dy * ray_dy;
    
    var rel_circlex = r.start.x - c.x;
    var rel_circley = r.start.y - c.y;
    
    
    var B = 2 * (ray_dx * rel_circlex + ray_dy * rel_circley);
    var C = rel_circlex * rel_circlex + rel_circley * rel_circley - c.r * c.r;

    var discriminant = B * B - 4 * A * C;
    
    if (discriminant < 0) {
        return null;
    }
    else {
        var T = (-B - Math.sqrt(discriminant))/(2*A)
        var T2 = (-B + Math.sqrt(discriminant))/(2*A);
        
        if (T > 0 && T < 1) {
            return {t:T};
        }
        else if (T2 > 0 && T2 < 1) {
            return {t:T2};
        }
    }
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
    var dx = r.end.x - r.start.x;
    var dy = r.end.y - r.start.y;
    var minx = b.min.x - r.start.x;
    var miny = b.min.y - r.start.y;
    var maxx = b.max.x - r.start.x;
    var maxy = b.max.y - r.start.y;

    var tx1 = minx / dx;
    var tx2 = maxx / dx;
    var ty1 = miny / dy;
    var ty2 = maxy / dy;

    var txmin = Math.min(tx1,tx2);
    var txmax = Math.max(tx1,tx2);
    var tymin = Math.min(ty1,ty2);
    var tymax = Math.max(ty1,ty2);

    var min = Math.max(txmin,tymin);
    var max = Math.min(txmax,tymax);
    if(min < max && min <= 1 && max >= 0) {
        return {t: Math.max(0,min)};
    }
    else {
        return null;
    }
}

/* Rav vs Convex
 * INPUT: ray as above, convex polygon as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
/* Rav vs Convex
 * INPUT: ray as above, convex polygon as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayConvex(r, p) {
    var ray_dx = r.end.x - r.start.x;
    var ray_dy = r.end.y - r.start.y;
    var T_enter = Number.NEGATIVE_INFINITY;
    var T_exit = Number.POSITIVE_INFINITY;
    
    for (var i = 0; i < p.length; i++) {
        var startx = p[i].x;
        var starty = p[i].y;
        var endx = p[(i+1)%p.length].x;
        var endy = p[(i+1)%p.length].y;
        
        var norm_dx = starty - endy;
        var norm_dy = endx - startx;
        
        // Enter/exiting reference: http://geomalgorithms.com/a13-_intersect-4.html
        var dot = ray_dx * norm_dx + ray_dy * norm_dy;
        
        var slope = (endy - starty)/(endx - startx);
        
        var T_numerator = (r.start.x - startx) * slope + starty - r.start.y;
        var T_denominator = ray_dy - slope * ray_dx;
        
        var T_intersect = T_numerator / T_denominator;
        
        if (dot > 0) {
            if (T_intersect > T_enter) {
                T_enter = T_intersect;
            }
        }
        else {
            if (T_intersect < T_exit) {
                T_exit = T_intersect;
            }
        }
    }
    
    if (T_enter > T_exit) {
        return null;
    }
    
    if (T_enter > 0 && T_enter < 1) {
        return {t:T_enter};
    }
    else if (T_exit > 0 && T_exit < 1) {
        return {t:T_exit};
    }
    
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
