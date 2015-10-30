module.exports = {
  collection: 'derby_invites',
  userIdStorage: '_session.userId',
  inviteStorage: '_session.inviteKey',

  urls: {
    invite: '/invite',
    link: '/invite/register'
  },

  urlGetKey: 'invite',
  cookieKey: 'inviteKey',

  hooks: {
    sendEmailToUser: require('./hooks/sendEmailToUser'),
    getUserInviteLink: require('./hooks/getUserInviteLink')
  },

  errors: {
    inviteExists: 'Invite already exists'
  }
};