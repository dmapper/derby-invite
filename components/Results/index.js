_ = require('lodash');
module.exports = Results;
function Results() {}
Results.prototype = _.clone(require('../base').prototype);

Results.prototype.name = 'invite:results';
Results.prototype.view = require('./index.jade');

Results.prototype.init = function () {
  var self = this;
  var invitesQuery = self.model.root.query('derby_invites', {});
  var usersQuery = self.model.root.at('users');

  self.model.root.subscribe(invitesQuery, usersQuery, function() {
    self.model.ref('invites', invitesQuery);
    self.model.ref('users', usersQuery);
  });
};

Results.prototype.create = function () {
  this.model.start('list', 'invites', 'users', this._getList.bind(this));
};

Results.prototype._getList = function(invites, users) {
  var list = {};

  for (var i = 0, l = invites.length; i < l; i++) {
    var invite = invites[i];
    var userId = invite['userId'];
    if (!list[userId]) {
      list[userId] = {
        name: users[userId].name,
        total: 0,
        success: 0
      };
    }
    list[userId]['total']++;
    if (invite.registered) {
      list[userId]['success']++;
    }
  }
  var array = [];
  keys = Object.keys(list);
  for (i = 0, l = keys.length; i < l; i++) {
    var id = keys[i];
    var value = list[id];
    value.id = id;
    array.push(value);
  }

  array.sort(function(a,b){
    return b.success - a.success;
  });

  return array;
};
