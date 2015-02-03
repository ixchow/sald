/*
 * Sprite - prototype for sprite object
 * Possible arguments
 *  (image,options)
 *  (images,options)
 *  (options)
 *
 */
var Sprite = function (arg1,arg2) {
  var data;
  // arg1 is img
  if(arg1 instanceof HTMLImageElement) {
    data = normalize_options(arg2,arg1);
  }
  // arg1 is imgs
  else if(Array.isArray(arg1)) {
    data = normalize_options(arg2);
    deref_images(arg1,data);
  }
  // arg1 is opts
  else {
    data = normalize_options(arg1);
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
    animations: {}
  };

  if(img) {
    data.img = img;
  }

  var anims = opts.animations || opts;

  // loop each animation in opts
  for(var name in anims) {
    var anim = anims[name];
    // if opts is just frames, store
    if(Array.isArray(anim)) {
      data.animations[name] = {frames:anim};
    }
    // if opts specifies how to repeat
    else if (exists(anim.size)) {
      anim.img = anim.img || data.img;
      anim.frames = expand_repeat_opts(anim);
      data.animations[name] = anim;
    }
    // if opts specifies frames explicitly
    else if(exists(anim.frames)) {
      data.animations[name] = anim;
    }
    // not supported
    else {
      //console.log(opts);
      throw new Error(name + ' did not match any valid animation definitions');
    }
  }

  return unroll_draw_data(data);
}

/*
 * deref_images - used if an array of images was provided, turns the value of
 *  img keys to a reference to that image if it is an index into the imgs array
 */
function deref_images(imgs,opts) {
  function deref(imgs,x) {
    if(typeof x.img == 'number') {
      x.img = imgs[x.img]
    }
  }

  deref(imgs,opts);
  for(var name in opts.animations) {
    var anim = opts.animations[name];
    deref(imgs,anim);
    for(var i = 0; i < anim.frames.length; i++) {
      deref(imgs,anim.frames[i]);
    }
  }
}

/*
 * expand_repeat_opts: take a frame definition with size (numeber of frames)
 *  specified, and turn it into each individual frame
 */
function expand_repeat_opts(opts) {
  var frames = [];

  // loop by size
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
  var drawData = this.data.animations[anim].frames[frame];
  //console.log(drawData);

  //draw this stuff
  if(window.ctx) {
    window.ctx.save();

    //locally flip the 'y' axis since images draw with upper-left origins:
    window.ctx.transform(1,0,
      0,-1,
      Math.round(x*drawData.width - 0.5 * drawData.width)/drawData.width,
      Math.round(y*drawData.height - 0.5 * drawData.height)/drawData.height
    );

    window.ctx.drawImage(drawData.img,
      drawData.x, drawData.y,
      drawData.width, drawData.height,
      0,0,1,1);
    window.ctx.restore();
  }
}

module.exports = Sprite;
