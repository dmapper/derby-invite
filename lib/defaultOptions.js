module.exports = {
  collection: 'derby_invites',
  usersColection: 'users',

  userIdStorage: '_session.userId',
  loggedStorage: '_session.loggedIn',
  inviteStorage: '_session.inviteKey',

  urls: {
    invite: '/invite',
    link: '/invite/register',
    redirect: '/'
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