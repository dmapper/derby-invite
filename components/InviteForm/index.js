module.exports = InviteForm;
function InviteForm() {}
InviteForm.prototype = require('../base').prototype;

InviteForm.prototype.name = 'invite:form';
InviteForm.prototype.view = __dirname;

InviteForm.prototype.submit = function () {
  var self = this;
  var email = this.model.get('email');
  if (!email || email.trim().length == 0) {
    return;
  }
  self.emit('submit', email);
  self.model.set('error', null);
  self.model.set('message', null);
  self.model.set('sending', true);
  this.post('/invite', {email: email}, function(err, data) {
    self.model.set('sending', false);
    if (err) {
      self.model.set('error', err.message);
      self.emit('error', err.message);
      return;
    }
    self.emit('success');
    self.model.set('email', null);
    self.model.set('message', 'Successfully sent invite to ' + email);
  });
};