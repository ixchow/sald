/*
 * Sprite - prototype for sprite object
 * Possible arguments
 *  (image,options)
 *  (images,options)
 *  (options)
 *
 */
var ctx = window.sald.ctx;

var Sprite = function (arg1,arg2) {
  var data;

  // arg1 is img
  if(arg1 instanceof HTMLImageElement) {
    data = normalize_options(arg2,arg1); //the final data object would have a list of animations and the image. 
  }
  this.data = data;
}

/*
 * exists - helper function to check if a key exists
 */
function exists(x) {
  return typeof x !== 'undefined';
}

/*
 * normalize_options - squeeze all possible options into the sprite data
 *  format
 */
function normalize_options(opts,img) {
  var data = {
    animations: {} //would populate this field after we fetch the list of anims, 'walk' ,'run' etc
  };

  if(img) {
    data.img = img;
  }

  var anims = opts;
  
  // loop each animation in opts
  for(var name in anims) {
    var anim = anims[name];  //anim is the string passed in the object definition, 'walk', 'run'
    if (exists(anim.size)) {
      anim.img = data.img;
      anim.frames = expand_repeat_opts(anim); //anim.frames is an array of individual sprites for that particular animation. for eg: walk could have 4 different frames for walk animation and these get populated in frames
      data.animations[name] = anim;
    }
    else {
      throw new Error(name + ' did not match any valid animation definitions');
    }
  }
  return unroll_draw_data(data);
}

function expand_repeat_opts(opts) {
  var frames = [];

  // loop by size, collect each individual sprites and store it in the frames array
  for(var i = 0; i < opts.size; i++) {
    // increment location frame is read from
    var x = opts.x + i*opts.width; 
    var y = opts.y;

    // create new frame
    var tmp = {
      x: x % opts.img.width,
      y: y + Math.floor(x/opts.img.width)*opts.height
    }

    // store new frame
    frames.push(tmp);
  }
  return frames;
}

/*
 * unroll_draw_data - propogate information used by draw down to the frames
 *  this allows for properties of the sprite to be inherited to each animation,
 *  and properties of each animation to each frame
 */
function unroll_draw_data(data) {
  var spriteData = {
    x: data.x,
    y: data.y,
    width: data.width,
    height: data.height,
    img: data.img
  };

  for(var name in data.animations) {
    var anim = data.animations[name];
    var animData = propogate_draw_data(spriteData,anim);
    for(var i = 0; i < anim.frames.length; i++) {
      anim.frames[i] = propogate_draw_data(animData,anim.frames[i]);
    }
  }
  return data;
}

/*
 * propogate_draw_data - pass the draw data from prev to next, unless next has
 *  already defined it, in which case take the value of next
 */
function propogate_draw_data(prev,next) {
  return {
    x: exists(next.x) ? next.x : prev.x,
    y: exists(next.y) ? next.y : prev.y,
    width: exists(next.width) ? next.width : prev.width,
    height: exists(next.height) ? next.height : prev.height,
    img: exists(next.img) ? next.img : prev.img
  }
}

/*
 * draw - draw the sprite animation specified
 * anim: current animation to draw
 * frame: frame of animation
 * x: x position in world space
 * y: y position in world space
 */

Sprite.prototype.draw = function (anim,frame,x,y) {
  var drawData = this.data.animations[anim].frames[frame]; //fetches a single frame image to draw. to loop through animations, we would just update the frame every update
  //console.log(drawData);
 
  //draw this stuff
  if(window.sald.ctx) {
    window.sald.ctx.save();
    
    //locally flip the 'y' axis since images draw with upper-left origins:
    window.sald.ctx.transform(1,0,
      0,-1,
      Math.round(x*drawData.width - 0.5 * drawData.width)/drawData.width,
      Math.round(y*drawData.height - 0.5 * drawData.height)/drawData.height
    );

    window.sald.ctx.drawImage(drawData.img,
      drawData.x, drawData.y,
      drawData.width, drawData.height,
      0,0,1,1);
    window.sald.ctx.restore();
  }
}

module.exports = Sprite;
