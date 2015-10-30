var express = require('express');
var extend = require('extend');

var Invite = require('./Invite');
var defaultOptions = require('./defaultOptions');

var router = express.Router();

Invite.prototype.middleware = function (options) {
  // some things are done here with config
  this.options = options = extend(true, defaultOptions, options);

  // Move hooks to module directly, so they have access to it as context
  for (var name in this.options.hooks) {
    var fn = this.options.hooks[name];
    this[name] = fn;
  }
  delete this.options.hooks;

  var self = this;

  // Here we check user for logging in and setting invite to be used, if it wasn't
  router.get('*', function (req, res, next){
    var model = req.getModel();

    var key = req.cookies['inviteKey'];
    var isLogged = model.get('_session.loggedIn');

    if (key && isLogged) {
      res.cookie('inviteKey', '');
      var userId = model.get('_session.userId');

      var alreadyInvitedQuery = model.query(options.collection, {registered: userId});
      var invitingUsersQuery = model.query(options.collection, {userId: userId});
      model.fetch(alreadyInvitedQuery, invitingUsersQuery, function () {
        var alreadyInvited = alreadyInvitedQuery.get();
        var invitingUsers = invitingUsersQuery.get();
        if (alreadyInvited.length == 0 && invitingUsers.length == 0) {
          model.subscribe(options.collection + '.' + key, function() {
            var invite = model.get(options.collection + '.' + key);
            if (invite) {
              model.set(options.collection + '.' + key + '.registered', userId);
            }
          });
        }
      });
    }
    next();
  });

  // Route to send email with link
  router.post(options.urls.invite, function (req, res) {
    var email = req.body.email;
    var model = req.getModel();

    self.getUserInviteLink(model, email, function (err, link) {
      self.sendEmailToUser(email, link, function (err) {
        if (err) return res.status(500).send(err).end();
        res.json({status: true, link: link});
      });
    });
  });

  // Users with link come here
  router.get(options.urls.link, function (req, res) {
    var model = req.getModel();
    var id = req.query[options.urlGetKey];
    if (id) {
      res.cookie('inviteKey', id);
    }
    res.redirect('/');
  });

  return router;
};