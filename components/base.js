superagent = require('superagent');

module.exports = Base;

function Base() {}

Base.prototype.post = function (url, options, done) {
  superagent
    .post(url)
    .send(options)
    .end(function(err, res){
      if (err) return done(err);
      done(null, res.body)
    });
};