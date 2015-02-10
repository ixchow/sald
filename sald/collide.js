function neg2(v) {
    return {x:-v.x,y:-v.y};
}

function dot2(u,v) {
    return u.x*v.x + u.y+v.y;
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

function minDot2(p,d,initial) {
    var i = initial || 0;
    
    var v,next = dot(p[i],d);
    do {
        v = next;
        i = (i + 1) % p.length;
        next = dot(p[i],d);
    } while(v > next)
    i--;

    next = v;
    do {
        v = next;
        i = (i - 1 + p.length) % p.length;
        next = dot(p[i], d);
    } while (v > next)
    i++;

    return {i: i, v: v};
}

function gjk(p,q) {
    var initial_axis = {x:0,y:1};
    var A = sub2(p.start(q.pos), q.start(p.pos));
    var s = [A];
    var D = neg2(A);
    while(true) {
        A = sub2(p.support(D),q.support(neg2(D));
        if(dot2(A,D) < 0) {
            return false;
        }
        // s = s + {A}
        s.push(A);
        if(s.length > 3) {
            s.pop();
        }
        // nearest simplex
        
        // accept if simplex contains origin
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
    var r = c1.r + c2.r;
    return dot(c1,c1) < r*r;
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
        var edge = neg2(p1[(i+1) % p1.length],p1[i]);
        var axis = perp2(edge);
        var naxis = neg2(axis);

        var min1 = minDot2(p1, axis, p1.lastMin);
        var max2 = minDot2(p1, naxis, p1.lastMax);
        var min2 = minDot2(p2, axis, p2.lastMin);
        var max2 = minDot2(p2, naxis, p2.lastMax);

        p1.lastMin = min1.i;
        p1.lastMax = max1.i;
        p2.lastMin = min2.i;
        p2.lastMax = max2.i;

        if(min1.x > max2.x ||
            min2.x > max1.x ||
            min1.y > max2.y ||
            min2.y > max1.y)
            return false;
    }

    for(var i = 0; i < p2.length; i++) {
        var edge = neg2(p2[(i+1) % p2.length],p2[i]);
        var axis = perp2(edge);
        var naxis = neg2(axis);

        var min1 = minDot2(p1, axis, p1.lastMin);
        var max2 = minDot2(p1, naxis, p1.lastMax);
        var min2 = minDot2(p2, axis, p2.lastMin);
        var max2 = minDot2(p2, naxis, p2.lastMax);

        p1.lastMin = min1.i;
        p1.lastMax = max1.i;
        p2.lastMin = min2.i;
        p2.lastMax = max2.i;

        if(min1.x > max2.x ||
            min2.x > max1.x ||
            min1.y > max2.y ||
            min2.y > max1.y)
            return false;
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
