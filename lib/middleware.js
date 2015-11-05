var express = require('express');
var _ = require('lodash');

var Invite = require('./Invite');
var defaultOptions = require('./defaultOptions');

var router = express.Router();

Invite.prototype.middleware = function (options) {
  // some things are done here with config
  this.options = options = _.defaultsDeep(options, defaultOptions);

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
    var isLogged = model.get(options.loggedStorage);

    if (isLogged) {
      var key = req.cookies[options.cookieKey];
      res.cookie(options.cookieKey, '');
      var userId = model.get(options.userIdStorage);
      var recordQuery = model.query(options.collection, {userId: userId});

      model.fetch(recordQuery, function () {
        var record = recordQuery.get();
        var id = null;
        if (record.length == 0) {

          var newRecord = {
            userId: userId,
            invited: false,
            invitedBy: null,
            created: Date.now(),
          };

          if (key.length > 0) {
            var invitedUser = model.at(options.usersCollection + '.' + key);
            model.fetch(invitedUser, function () {
              invitedUser = invitedUser.get();
              if (invitedUser != null) {
                newRecord.invited = true;
                newRecord.invitedBy = invitedUser.id;
              }
              model.add(options.collection, newRecord);
            });
          } else {
            model.add(options.collection, newRecord);
          }
        }
      });
    }

    return next();
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
      res.cookie(options.cookieKey, id);
    }
    res.redirect(options.urls.redirect);
  });

  return router;
};