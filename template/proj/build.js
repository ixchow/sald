function loadImage(file) {
  var script = [
    'var img = new Image();',
    'img.src = "data:' + this.mime + ';' + this.encoding + ',' + file.data + '";',
    'module.exports = img;'
  ].join('\n');
  return script;
}

function loadAudio(file) {
  return 'module.exports = new Audio("data:' + this.mime + ';' + this.encoding + ',' + file.data + '");';
}

module.exports = {
  entry :  {
    js : 'src/main.js',
    html : 'src/main.html'
  },
  output : {
    html : '.tmp/build.html'
  },
  files : {
    '.jpg' : {
      mime : 'image/jpg',
      encoding : 'base64',
      load: loadImage
    },
    '.png' : {
      mime : 'image/png',
      encoding : 'base64',
      load: loadImage
    },
    '.ogg' : {
      mime : 'audio/ogg',
      encoding : 'base64',
      load: loadAudio
    },
    '.wav' : {
      mime : 'audio/vnd.wave',
      encoding : 'base64',
      load: loadAudio
    }
  }
};
