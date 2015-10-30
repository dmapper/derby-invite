module.exports = function (model, email, done) {
  var self = this;
  var collection = self.options.collection;
  var userId = model.get(self.options.userIdStorage);

  var existingInviteQueue = model.query(collection, {email: email});
  model.fetch(existingInviteQueue, function () {
    var existingInvite = existingInviteQueue.get();

    function getUrl(id) {
      return self.options.urls.link + '?' + self.options.urlGetKey + '=' + id;
    }

    if (existingInvite.length > 0) {
      return done(null, getUrl(existingInvite[0].id));
    }

    var id = model.add(collection, {
      email: email,
      userId: userId,
      created: Date.now(),
      registered: false
    });

    done(null, getUrl(id));
  });
};

