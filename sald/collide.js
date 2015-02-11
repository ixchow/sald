function neg2(v) {
    return {x:-v.x,y:-v.y};
}

function dot2(u,v) {
    return u.x*v.x + u.y*v.y;
}

function length_squared2(v) {
    return dot2(v,v);
}

function length(v) {
    return Math.sqrt(length_squared2(v));
}

function add2(u,v) {
    return {x: u.x + v.x, y: u.y + v.y};
}

function sub2(u,v) {
    return {x: u.x - v.x, y: u.y - v.y};
}

function perp2(v) {
    return {x: -v.y, y: v.x};
}

function norm2(v) {
    var l = Math.sqrt(dot2(v,v));
    return {x: v.x/l, y: v.y/l};
}

function cross2(u,v) {
    return u.x * v.y - u.y * v.x;
}

function minDot2(p, pos, axis) {
    function f(v) {
        return dot2(sub2(v,pos), axis);
    }

    var v = Number.POSITIVE_INFINITY;
    for(var i = 0; i < p.length; i++) {
        v = Math.min(v,f(p[i]));
    }
    return v;
}

/* Circle vs Circle
 * INPUT: two circles specified by position and radius:
 *  c1 = {x:, y:, r:}, c2 = {x:, y:, r:}
 * RETURN VALUE:
 *  false if c1 and c2 do not intersect
 *  true if c1 and c2 do intersect
 */
function circleCircle(c1,c2) {
    var r = c1.r + c2.r;
    var d = sub2(c1,c2);
    return Math.abs(dot2(d,d)) < r*r;
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
    for(var i = 0; i < p1.length; i++) {
        var edge = sub2(p1[i], p1[(i+1) % p1.length]);
        var axis = perp2(edge);

        var d  = minDot2(p2, p1[i], axis, p2.lastMin);
        
        if(d > 0) {
            return false;
        }
        
    }

    for(var i = 0; i < p2.length; i++) {
        var edge = sub2(p2[i], p2[(i+1) % p2.length]);
        var axis = perp2(edge);
        
        var d = minDot2(p1, p2[i], axis, p1.lastMin);
        
        if(d > 0) {
            return false;
        }
    }

    return true;
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
    var d = sub2(r.end, r.start);
    var cp = sub2(r.start,c);

    var a = dot2(d,d);
    var b = 2*dot2(d,cp);
    var c = dot2(cp,cp) - c.r*c.r;

    var disc = b*b - 4*a*c;
    if(disc < 0) {
        return null;
    } else {
        disc = Math.sqrt(disc);

        var ts = [(-b-disc)/(2*a),(-b+disc)/(2*a)];
        var min = Math.min(ts[0],ts[1]);
        var max = Math.max(ts[1],ts[1]);
        if(max <= 0 || min >= 1)
            return null;
        if(min >= -1)
            return {t: Math.max(0,min)};
        else
            return {t: max};
    }
}

/* Rav vs Rectangle
 * INPUT: ray as above, rectangle as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayRectangle(r, b) {
    var e = r.start;
    var d = sub2(r.end,r.start);
    var min = sub2(b.min,e);
    var max = sub2(b.max,e);

    var tx1 = min.x / d.x;
    var tx2 = max.x / d.x;
    var ty1 = min.y / d.y;
    var ty2 = max.y / d.y;

    var txmin = Math.max(0,Math.min(tx1,tx2));
    var txmax = Math.max(tx1,tx2);
    var tymin = Math.max(0,Math.min(ty1,ty2));
    var tymax = Math.max(ty1,ty2);

    if(txmin > tymax || tymin > txmax)
        return null;
    else
        return {t: Math.max(txmin,tymin)};
}

// http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
function lineIntersection(r1,r2) {
    var p = r1.start;
    var r = sub2(r1.end,r1.start);

    var q = r2.start;
    var s = sub2(r2.end,r2.start);

    var denom = cross2(r,s);
    if(denom == 0)
        return null;

    var qp = sub2(q,p);

    var t = cross2(qp,s) / denom;
    var u = cross2(qp,r) / denom;

    if(0 <= t && 0 <= u && u <= 1)
        return {t: t};
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
    var t = Number.POSITIVE_INFINITY;
    var passed = 0;
    for(var i = 0; i < p.length; i++) {
        var col = lineIntersection(r,{start: p[i], end: p[(i + 1) % p.length]});
        if(col) {
            t = Math.min(t,col.t);
            passed++;
        }
    }
    // Jordan curve theorem
    if(passed % 2)
        return {t: 0};
    if(t <= 1)
        return {t: t};
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
