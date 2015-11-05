module.exports = function (model, email, done) {
  var userId = model.get(this.options.userIdStorage);

  done(null, this.options.urls.link + '?' + this.options.urlGetKey + '=' + id);

};

