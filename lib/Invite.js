function Invite() {}

Invite.prototype.getUrl = function (id) {
  return this.options.urls.link + '?' + this.options.urlGetKey + '=' + id;
};

module.exports = Invite;