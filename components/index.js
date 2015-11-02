var extend = require('extend');
module.exports = function(app, options) {
  options = extend(true, {
    webpack: false
  }, options);

  var components = [
    require('./InviteForm'),
    require('./Results')
  ];

  if (options.webpack) {
    components = components.map(function (elem) {
      elem.prototype.view = require(elem.prototype.view);
    });
  }

  for (var i = 0, l = components.length; i < l; i++) {
    app.component(components[i]);
  }
};