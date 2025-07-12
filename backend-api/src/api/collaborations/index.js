const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator, usersService }) => {
    const handler = new CollaborationsHandler(service, playlistsService, validator, usersService);
    server.route(routes(handler));
  },
};
