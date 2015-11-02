var extend = require('extend');
var InviteForm = require('./InviteForm');
var Results = require('./Results');

module.exports = function(app, options) {
  app.component(InviteForm);
  app.component(Results);
};
